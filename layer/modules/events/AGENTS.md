# Events Module — AI Agent Instructions

Event tracking and webhook streaming system. Analytics-agnostic, provider-swappable.

## File Map

```
layer/modules/events/
├── index.ts                          # Module setup (auto-imports, provider registration)
├── runtime/
│   ├── types/
│   │   ├── events.ts                 # Event types, interfaces, module options
│   │   └── signal.ts                 # SignalRow envelope (events AND logs)
│   ├── composables/
│   │   ├── useEvents.ts              # Main event tracking API
│   │   ├── useSignalQueue.ts         # Client batch queue → /api/_signals/ingest
│   │   └── useUserIdentity.ts        # Anonymous UUID generation/persistence
│   ├── plugins/
│   │   ├── events.client.ts          # Core plugin (hook infrastructure)
│   │   └── errors.client.ts          # window.onerror / rejections / Vue errors → signals
│   ├── providers/
│   │   ├── console.ts                # Dev provider (logs to console)
│   │   ├── umami.ts                  # Analytics provider (Umami)
│   │   ├── signal.ts                 # Signal buffer provider (all events)
│   │   └── webhook.ts                # Client-side webhook trigger
│   ├── components/
│   │   └── DevEvents.vue             # Dev tools modal for manual testing
│   └── utils/
│       ├── locations.ts              # Event metadata and categorization
│       └── signal.ts                 # EventPayload → SignalRow, page/utm context
└── server/
    ├── handlers/
    │   ├── webhook.post.ts           # POST /api/v1/webhook (form submissions)
    │   ├── signals-ingest.post.ts    # POST /api/_signals/ingest (client rows)
    │   └── signals-export.get.ts     # GET  /api/_signals/export (cursor pull)
    ├── plugins/
    │   └── signal-errors.ts          # Nitro request errors → signal buffer
    └── utils/
        ├── signal-buffer.ts          # Capped ring buffer (unstorage) + appendSignal
        └── signal-export.ts          # Bearer auth check + query parsing
```

## Key Architecture

### Hook-Based Provider System
```
useEvents.trackEvent() → nuxtApp.callHook('events:track', payload)
                    ↓
              Providers listen independently:
              - Console (dev)
              - Umami (analytics)
              - Signal (buffer, always on)
              - Webhook (form submission)
```

Swap providers without changing event code. Multiple providers fire simultaneously.

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
  `visitor.class` is left unset — classification is a later task.
- **Cursor:** `seq` is monotonic. Consumers send back the last `cursor` they saw.
- **Buffer:** `useStorage('signals')` (memory by default — mount fs/KV in `nitro.storage`
  to survive restarts). Capacity `events.signals.capacity`, default 10 000 rows; oldest evicted.
- **Auth:** export requires `Authorization: Bearer <NUXT_SIGNAL_EXPORT_TOKEN>`. Missing/wrong
  token → 401. Token not configured → 503 (never open by default).
- **Client batching:** `useSignalQueue()` debounces POSTs (~800 ms, max 25 rows) and flushes
  with `navigator.sendBeacon` on pagehide.

### Form Submission Flow
Client triggers `form_submitted` → webhook provider → server POST → inline honeypot/timing
check → zod payload validation → `appendSignal({ kind: 'event', name: 'form_submitted' })` →
best-effort, fire-and-forget JSON POST to `NUXT_WEBHOOK_URL` if configured. No platform
detection, formatting, or retry — the durable copy lives in the signal buffer.

### Logging
`useLogger(event)` / `createEvlogError()` (evlog) stay as the structured-logging library for
server handlers — console output, one wide event per request. There is **no** drain, sampling,
or enrichment pipeline: errors reach external consumers through the signal buffer instead.

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

### Add new analytics provider
1. Create `runtime/providers/my-provider.ts`
2. Listen to `nuxtApp.hook('events:track', handler)` in a plugin with `dependsOn: ['events-core']`
3. Enable in `nuxt.config.ts` events config

### Emit a signal from server code
```ts
import { appendSignal } from '../utils/signal-buffer'

await appendSignal({ kind: 'log', severity: 'warning', name: 'quota_low', data: { … } }, event)
```
`site`, `id`, `ts`, and `seq` are filled in for you.

### Change the webhook destination
Set `NUXT_WEBHOOK_URL` to a single endpoint. `webhook.post.ts` forwards the raw form data
as one plain JSON POST — no per-platform formatting. Per-platform notification formatting
is being replaced by a unified signal-export channel (next wave).

## Environment Variables

- `NUXT_WEBHOOK_URL` — Single webhook URL (best-effort notification target)
- `NUXT_SIGNAL_EXPORT_TOKEN` — Bearer token for `GET /api/_signals/export` (unset → 503)
- `NUXT_PUBLIC_SITE_ID` — Site identifier stamped on every row (defaults to request host)

## Design Principles

1. No database — events stream directly to destinations (buffer is a transient ring, not storage)
2. No auth — anonymous UUID sufficient for signal capture
3. No sequences — immediate webhook, use external tools for drip campaigns
4. Provider-agnostic — swap analytics without component changes
