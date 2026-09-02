# Events Module — AI Agent Instructions

Signal capture. One pipe: client event → `events:track` hook → signal provider →
`/api/_signals/ingest` → capped ring buffer → external consumer pulls
`/api/_signals/export`. There are no analytics providers, no outbound webhooks, and no
logging library — anything that isn't the signal pipe was removed on purpose.

## File Map

```
layer/modules/events/
├── index.ts                          # Module setup (auto-imports, routes, plugins)
├── runtime/
│   ├── types/
│   │   ├── events.ts                 # Event types, interfaces, module options
│   │   └── signal.ts                 # SignalRow envelope (events AND logs)
│   ├── composables/
│   │   ├── useEvents.ts              # Main event tracking API
│   │   ├── useSignalQueue.ts         # Client batch queue → /api/_signals/ingest
│   │   └── useUserIdentity.ts        # Anonymous UUID generation/persistence
│   ├── plugins/
│   │   ├── events.client.ts          # Core plugin (hook infra + `debug` console echo)
│   │   ├── errors.client.ts          # window.onerror / rejections / Vue errors → signals
│   │   └── identity.client.ts        # Always-on ui.click / ui.section / ui.page emitter
│   ├── providers/
│   │   └── signal.ts                 # The only provider: events → signal queue
│   ├── components/
│   │   └── DevEvents.vue             # Dev tools modal for manual testing
│   └── utils/
│       ├── identity.ts               # Content-free click/section resolvers + emit throttles
│       ├── locations.ts              # Event metadata and categorization
│       └── signal.ts                 # EventPayload → SignalRow, page/utm/review context
└── server/
    ├── handlers/
    │   ├── webhook.post.ts           # POST /api/v1/webhook (form capture)
    │   ├── signals-ingest.post.ts    # POST /api/_signals/ingest (client rows)
    │   └── signals-export.get.ts     # GET  /api/_signals/export (cursor pull)
    ├── plugins/
    │   └── signal-errors.ts          # Nitro request errors → signal buffer
    └── utils/
        ├── signal-buffer.ts          # Capped ring buffer (unstorage) + appendSignal
        ├── signal-export.ts          # Bearer auth check + query parsing
        └── visitor-class.ts          # UA → human/agent/bot classification
```

## Key Architecture

### Hook-Based Tracking
```
useEvents.trackEvent() → nuxtApp.callHook('events:track', payload)
                    ↓
              signal.ts → useSignalQueue().enqueue() → POST /api/_signals/ingest
```

The hook stays because it decouples components from transport and gives DevEvents.vue a
read point. It is not a plugin system: `signal.ts` is the only listener, plus a
`console.info` echo in `events.client.ts` when `events.debug` is on.

### Signal Flow (the important one)
Everything a site captures — analytics events AND error/warning logs — becomes one
`SignalRow` (`runtime/types/signal.ts`) in a capped server-side ring buffer. An external
consumer (Polaris) pulls it with a cursor.

```
client events  → signal provider ─┐
client errors  → errors.client ───┼→ POST /api/_signals/ingest ─┐
                                  │                             ├→ ring buffer (unstorage)
form submits   → webhook.post.ts ─┘                             │        ↓
server errors  → server/plugins/signal-errors.ts ───────────────┘   GET /api/_signals/export
                                                                    ?since=<seq>&limit=<n≤2000>
                                                                    → { rows, cursor, site }
```

- **Envelope:** `{ id, seq, ts, site, kind: 'event'|'log', name, severity?, visitor?, page?, referrer?, utm?, review?, data? }`.
- **Review binding:** `review` is its own top-level field, read from a `?polaris_review=<token>`
  query param by `pageContext()`. It is **never** merged into `utm` and **never** persisted —
  only rows emitted while that tagged URL is current carry it. That is the whole design: an
  external reviewer needs exactly one tagged row to bind the token to a `visitor.anonId`, and
  persisting it would stamp every later row on every later page instead.
- **Visitor classification:** every ingest/append path stamps `visitor.class:
  'human' | 'agent' | 'bot'` server-side from the request's `User-Agent`
  (`server/utils/visitor-class.ts`) — a hand-rolled matcher, checked against
  `isbot` first but skipped since it can't separate AI agents from classic
  crawlers and isn't in this monorepo's lockfile. Client-supplied `visitor.class`
  is always overwritten, never trusted. Left unset only when a path has no
  request context to read a UA from (e.g. the Nitro error hook on a crash with
  no event). Agentic vs human traffic split is a core KPI (VISION.md) — this is
  itself signal, not metadata.
- **Cursor:** `seq` is monotonic. Consumers send back the last `cursor` they saw.
- **Buffer:** `useStorage('signals')` (memory by default — mount fs/KV in `nitro.storage`
  to survive restarts). Capacity `events.signals.capacity`, default 100 000 rows; oldest evicted.
  Sized for the identity stream: ~60 rows per visit × ~200 sessions/day ≈ 12k rows/day, so the
  buffer holds ~8 days and a consumer can be down for a week without losing rows.
- **Auth:** export requires `Authorization: Bearer <NUXT_SIGNAL_EXPORT_TOKEN>`. Missing/wrong
  token → 401. Token not configured → 503 (never open by default).
- **Client batching:** `useSignalQueue()` debounces POSTs (~800 ms, max 50 rows) and flushes
  with `navigator.sendBeacon` on pagehide. The ingest handler caps a request at 100 rows / 128 KB.

### Identity Events (always on, content-free)
`runtime/plugins/identity.client.ts` emits a behaviour stream for **every** visitor through the
normal `events:track` pipeline, so each row already carries `page`, `ts`, `visitor` and `review`:

| name | `data` |
| --- | --- |
| `ui.click` | `{ target, label?, section? }` |
| `ui.section` | `{ section, visible }` |
| `ui.page` | `{ from? }` — route change, and the first load |

**Content-free is a hard rule:** no pixel coordinates, no input values, no keystrokes. `target`
is built from authored attributes only (`data-signal-target` → `tag#id` → `tag[data-testid]` →
`tag`), and `label` (aria-label, else collapsed text, 80 chars max) is never read off a form
field. Add `data-signal-ignore` to an element or ancestor to exclude a subtree.

**Section identity convention.** A section is any element matching `[data-section]` or
`section[id]`; its stable id is `data-section` when present, else the element's `id`.
`SectionWrapper` stamps `data-section` from its `sectionId` prop, so layer-built pages are
covered for free; a hand-rolled section on a consuming site opts in with `data-section="pricing"`
or a plain `<section id="pricing">`.

**Volume control.** Clicks dedupe on `target|section` within 400 ms. Sections report settled
*transitions* only — a state must hold for 400 ms before it emits — so scrolling straight past
ten sections emits nothing rather than twenty rows, and an on-screen section never re-emits.

**No client-side bot filtering, on purpose:** `visitor.class` is stamped server-side from the
request UA at ingest and consumers filter on it. A second, weaker client verdict would only be
overwritten. Emission is also fully guarded — a dropped row costs a data point, a thrown one
costs the visit.

### Form Submission Flow
`useFormCapture()` validates client-side, then POSTs straight to `/api/v1/webhook` →
inline honeypot/timing check → zod payload validation →
`appendSignal({ kind: 'event', name: 'form_submitted' })`. The server is the durable
capture point (it also stamps `visitor.class`); a `$fetch` failure surfaces a toast and a
`form_error` event. There is no outbound forward to a third-party webhook — Polaris pulls
the buffer instead.

Route name is historical: `/api/v1/webhook` is the form-capture endpoint, not a webhook
sender. It's kept stable so existing deployments don't break.

### Logging
There is no logging library. Server handlers `throw createError({ statusCode,
statusMessage })` (h3 native) and the Nitro error hook (`server/plugins/signal-errors.ts`)
turns thrown request errors into `kind: 'log'` rows. **Do not** `appendSignal` an error in
a handler *and* throw it — that double-records. Pure info logging is gone.

### Anti-Spam Layers
Honeypot filled in, or `timeOnForm` under 2s → treated as a bot and silently accepted
(no error surfaced, so bots don't learn they were caught). Checked inline in
`webhook.post.ts` — no dedicated util or rate limiter.

### Anonymous Identity
`useUserIdentity().getUserId()` returns `user_<uuid>`. Persists to localStorage via `useAppStorage()`. SSR-safe (empty string on server). If storage throws outright — private mode, blocked site data — it falls back to a per-page-load id rather than throwing on every visitor.

## How to Modify

### Add new event type
1. Add to `TrackedEvents` union in `runtime/types/events.ts`
2. Add metadata in `runtime/utils/locations.ts`
3. Use in component: `trackEvent({ id: 'x', type: 'new_type', location: 'hero' })`

### Emit a signal from server code
```ts
import { appendSignal } from '../utils/signal-buffer'

await appendSignal({ kind: 'log', severity: 'warning', name: 'quota_low', data: { … } }, event)
```
`site`, `id`, `ts`, and `seq` are filled in for you.

## Module Options (`events:` in nuxt.config)

```ts
events: {
  signals: { enabled: true, capacity: 100_000, captureErrors: true },
  debug: true,   // console.info every tracked event (client)
}
```

That's the whole surface. There is no `providers` and no `webhook` option.

## Environment Variables

- `NUXT_SIGNAL_EXPORT_TOKEN` — Bearer token for `GET /api/_signals/export` (unset → 503)
- `NUXT_PUBLIC_SITE_ID` — Site identifier stamped on every row (defaults to request host)

Nothing else. If you're adding a third env var to this module, you're probably adding a
feature that doesn't capture signal.

## Design Principles

1. No database — the buffer is a transient ring consumers pull from, not storage
2. No auth — anonymous UUID sufficient for signal capture
3. No analytics vendors — one pipe out, the consumer decides what to do with it
4. No second destination — adding a fan-out target means two sources of truth
