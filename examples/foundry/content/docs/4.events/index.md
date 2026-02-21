---
label: Events & Tracking
title: Events Overview
description: How the analytics-agnostic event system works — hook pipeline, providers, and module configuration.
---

Foundry's event system is designed so you can swap analytics providers without changing a single line of event code.

## Architecture

The events system uses a hook-based pub/sub pattern:

```
User Action → useEvents().trackEvent() → nuxtApp.callHook('events:track') → Providers
                                                                              ├── Console (logs)
                                                                              ├── Umami (analytics)
                                                                              └── Webhook (server delivery)
```

1. A component calls `trackEvent()` with an event payload
2. The payload is enriched with user ID and timestamp
3. The `events:track` hook fires
4. Each registered provider listens on that hook and handles the event independently

This means adding or removing an analytics provider is a config change — no event code needs to change.

## Module Configuration

Configure the events module in `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  events: {
    providers: ['console', 'umami', 'webhook'],
    webhook: {
      enabled: true,
      platforms: ['discord'],
    },
    debug: false,
  },
})
```

| Option | Type | Default | Description |
|---|---|---|---|
| `providers` | `string[]` | `['console']` | Active providers: `'console'`, `'umami'`, `'webhook'` |
| `webhook.enabled` | `boolean` | `false` | Register the `/api/v1/webhook` server handler |
| `webhook.platforms` | `string[]` | `[]` | Supported platforms: `'discord'`, `'slack'`, `'telegram'` |
| `debug` | `boolean` | `false` | Enable debug logging |

## Provider Registration

Providers are Nuxt client-side plugins that register themselves on the `events:track` hook:

```ts
// Simplified provider structure
export default defineNuxtPlugin({
  name: 'events-provider-example',
  dependsOn: ['events-core'],
  setup(nuxtApp) {
    nuxtApp.hook('events:track', (payload) => {
      // Handle the event (send to analytics, log, etc.)
    })
  },
})
```

The `events-core` plugin must load first (enforced via `dependsOn`), followed by any number of providers.

## DevEvents Component

In development mode, a `DevEvents` component is available for testing events without a real form submission. It provides:

- Event type selector grouped by category
- Auto-generated mock data for each event type
- Event chain status tracking (pending, success, error)
- Full payload inspection

This component is dev-only and throws an error if used in production.

::card-group
  ::card{title="Tracking Events" icon="i-lucide-mouse-pointer-click" to="/docs/events/tracking"}
  useEvents(), event types, and payload shapes.
  ::

  ::card{title="Providers" icon="i-lucide-plug" to="/docs/events/providers"}
  Console, Umami, and webhook providers.
  ::

  ::card{title="Webhooks" icon="i-lucide-webhook" to="/docs/events/webhooks"}
  Server handler, platform formatters, and multi-webhook delivery.
  ::

  ::card{title="Anti-Spam" icon="i-lucide-shield" to="/docs/events/anti-spam"}
  Honeypot, rate limiting, JS token validation, and scoring.
  ::
::
