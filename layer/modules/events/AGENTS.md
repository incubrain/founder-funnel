# Events Module — AI Agent Instructions

Event tracking and webhook streaming system. Analytics-agnostic, provider-swappable.

## File Map

```
layer/modules/events/
├── index.ts                          # Module setup (auto-imports, provider registration)
├── runtime/
│   ├── types/
│   │   └── events.ts                 # Event types, interfaces, module options
│   ├── composables/
│   │   ├── useEvents.ts              # Main event tracking API
│   │   └── useUserIdentity.ts        # Anonymous UUID generation/persistence
│   ├── plugins/
│   │   └── events.client.ts          # Core plugin (hook infrastructure)
│   ├── providers/
│   │   ├── console.ts                # Dev provider (logs to console)
│   │   ├── umami.ts                  # Analytics provider (Umami)
│   │   └── webhook.ts                # Client-side webhook trigger
│   ├── components/
│   │   └── DevEvents.vue             # Dev tools modal for manual testing
│   └── utils/
│       └── locations.ts              # Event metadata and categorization
└── server/
    └── handlers/
        └── webhook.post.ts           # POST /api/v1/webhook (form submissions)
```

## Key Architecture

### Hook-Based Provider System
```
useEvents.trackEvent() → nuxtApp.callHook('events:track', payload)
                    ↓
              Providers listen independently:
              - Console (dev)
              - Umami (analytics)
              - Webhook (form submission)
```

Swap providers without changing event code. Multiple providers fire simultaneously.

### Form Submission Flow
Client triggers `form_submitted` → webhook provider → server POST → inline honeypot/timing
check → zod payload validation → (TODO: signal-buffer persistence) → best-effort, fire-and-forget
JSON POST to `NUXT_WEBHOOK_URL` if configured. No platform detection, formatting, or retry —
that lives in the upcoming unified signal-export channel.

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

### Change the webhook destination
Set `NUXT_WEBHOOK_URL` to a single endpoint. `webhook.post.ts` forwards the raw form data
as one plain JSON POST — no per-platform formatting. Per-platform notification formatting
is being replaced by a unified signal-export channel (next wave).

## Environment Variables

- `NUXT_WEBHOOK_URL` — Single webhook URL (best-effort notification target)

## Design Principles

1. No database — events stream directly to destinations
2. No auth — anonymous UUID sufficient for signal capture
3. No sequences — immediate webhook, use external tools for drip campaigns
4. Provider-agnostic — swap analytics without component changes
