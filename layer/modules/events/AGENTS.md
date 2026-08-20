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
│   │   └── errors.client.ts          # window.onerror / rejections / Vue errors → signals
│   ├── providers/
│   │   └── signal.ts                 # The only provider: events → signal queue
│   ├── components/
│   │   └── DevEvents.vue             # Dev tools modal for manual testing
│   └── utils/
│       ├── locations.ts              # Event metadata and categorization
│       └── signal.ts                 # EventPayload → SignalRow, page/utm context
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
                                                                    ?since=<seq>&limit=<n≤1000>
                                                                    → { rows, cursor, site }
```

- **Envelope:** `{ id, seq, ts, site, kind: 'event'|'log', name, severity?, visitor?, page?, referrer?, utm?, data? }`.
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
  to survive restarts). Capacity `events.signals.capacity`, default 10 000 rows; oldest evicted.
- **Auth:** export requires `Authorization: Bearer <NUXT_SIGNAL_EXPORT_TOKEN>`. Missing/wrong
  token → 401. Token not configured → 503 (never open by default).
- **Client batching:** `useSignalQueue()` debounces POSTs (~800 ms, max 25 rows) and flushes
  with `navigator.sendBeacon` on pagehide.

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
`useUserIdentity().getUserId()` returns `user_<uuid>`. Persists to localStorage via `useAppStorage()`. SSR-safe (empty string on server).

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
  signals: { enabled: true, capacity: 10_000, captureErrors: true },
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
