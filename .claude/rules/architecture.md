## System Boundaries

**In Scope (What We Build):**
- Landing pages (section driven)
- Signal capture (email/presales/bookings)
- Documentation (markdown|nuxt/content)
- Event tracking (analytics-agnostic)
- Webhook streaming (your data, your destination)

**Out of Scope (External or Never):**
- Email sequences (use ConvertKit/Mailchimp)
- Authentication (validation ≠ product)
- Payment processing (external links only)
- Databases (webhook streams instead)

**Why Boundary Exists:**
Validation captures intent. Products deliver value. Mixing them creates scope creep.

## Key Patterns

**Content-First:**
- Customers edit YAML/Markdown, not code
- Progressive disclosure (start minimal, expand as validated)
- See: `templates/*/content/pages/index.md` for stage comments

**Multi-Config System:**
- `NUXT_PUBLIC_CONFIG_SOURCE` = `root` | `foundry`
- Showcase (`templates/`) ≠ User starting point (`root`)
- See: `shared/utils/config-resolver.ts`

**Event-Driven:**
- User action → `useEvents()` → Handler → Provider
- Swap analytics without changing event code
- See: `modules/events/*`

**Webhook Streaming:**
- Capture → Encrypt → Webhook → Your destination
- No storage decisions required
- See: `modules/events/server/handlers/webhook.ts`

## Critical Constraints

**Complexity Budget:**
```
Max component: 50 lines
Max props: 5
Max abstraction: 2 layers deep
Max nesting: 3 levels
```

**Validation Paths:**
1. Email capture (anonymous ID + UTM)
2. Presales links (external payment)
3. Service booking (calendly/cal.com)

**SSR Reality:**
- Nuxt 4: Some client APIs unavailable on server
- Use `import.meta.client` guards
- See: `layers/core/app/composables/useAppStorage.ts`

## Structured Logging (evlog)

**Wide Events:**
- One log per request with all accumulated context
- `useLogger(event)` in server handlers → `log.set()` to accumulate → auto-emitted
- `createEvlogError()` with `why`/`fix` fields for AI-readable errors
- See: `layer/modules/events/server/handlers/webhook.post.ts`

**Layer Plugins (automatic):**
- `evlog-enrich.ts` — Adds user agent + geo context to every request
- `evlog-sampling.ts` — Always keeps signal capture events (leads, webhook deliveries)

**App-Level Drain (your responsibility):**
- Create `server/plugins/evlog-drain.ts` in your app to send logs externally
- Supports: Sentry, Axiom, PostHog, Better Stack, OTLP, or custom
- Use `createDrainPipeline()` for batching + retry in production
- See: `examples/astronera/server/plugins/evlog-drain.ts`

**Browser Transport:**
- Client-side `log.info()`/`log.error()` auto-sent to server via `/api/_evlog/ingest`
- Enabled by default in layer config
- Flows through same drain pipeline as server logs

**Key env vars:**
- `NUXT_SENTRY_DSN` — Sentry log drain
- `NUXT_AXIOM_TOKEN` + `NUXT_AXIOM_DATASET` — Axiom drain
- `NUXT_POSTHOG_API_KEY` — PostHog drain

## Integration Points

**Analytics:**
- Pre-configured: Umami (privacy-first)
- Swap: Change `nuxt.config.ts` scripts registry
- Events flow through same system

**Webhooks:**
- Telegram: `NUXT_WEBHOOK_URL` + `NUXT_TELEGRAM_CHAT_ID`
- Discord: `NUXT_WEBHOOK_URL`
- Slack: `NUXT_WEBHOOK_URL`
- Multiple: Comma-separated URLs

**Deployment:**
- Railway: Dockerfile included
- Vercel: `vercel.json` configured
- Zero setup tax (< 5 minutes)
