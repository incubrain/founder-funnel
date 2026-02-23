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
    ├── handlers/
    │   └── webhook.post.ts           # POST /api/v1/webhook (form submissions)
    ├── formatters/
    │   ├── discord.ts                # Discord message formatter
    │   ├── slack.ts                  # Slack message formatter
    │   └── telegram.ts              # Telegram message formatter
    └── utils/
        ├── anti-spam.ts              # Rate limiting + honeypot + scoring
        └── webhook-retry.ts          # Retry with exponential backoff
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
Client triggers `form_submitted` → webhook provider → server POST → anti-spam validation → format per platform → deliver to destinations (Slack/Discord/Telegram).

### Anti-Spam Layers
Honeypot → instant reject. Rate limit (5/15min per IP) → 429. Form time + JS detection → risk score (0-100).

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

### Add new webhook destination format
1. Create formatter in `server/formatters/my-service.ts`
2. Add URL detection in `webhook.post.ts` `detectPlatform()`
3. Add domain to whitelist in `server/utils/webhook-retry.ts`

## Environment Variables

- `NUXT_WEBHOOK_URL` — Comma-separated webhook URLs
- `NUXT_TELEGRAM_CHAT_ID` — Telegram chat/group ID

## Design Principles

1. No database — events stream directly to destinations
2. No auth — anonymous UUID sufficient for signal capture
3. No sequences — immediate webhook, use external tools for drip campaigns
4. Provider-agnostic — swap analytics without component changes
