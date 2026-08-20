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
Max layer component: 50 lines (reusable)
Max example app component: ~150 lines (extract composables beyond this)
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

**No drain pipeline:**
- evlog is the structured-logging *library* only — console output, one wide event per request
- No drain adapters, no sampling plugin, no enrichers, no browser transport
- Errors and warnings reach external consumers through the signal buffer instead (below)

## Signal Capture (capture → buffer → pull)

**One envelope for everything:**
- `SignalRow { id, seq, ts, site, kind: 'event'|'log', name, severity?, visitor?, page?, referrer?, utm?, data? }`
- Analytics events (`kind: 'event'`) and error/warning logs (`kind: 'log'`) share the stream

**Flow:**
- Client events → signal provider → `POST /api/_signals/ingest` (debounced batch, beacon on pagehide)
- Client errors (`window.onerror`, `unhandledrejection`, Vue `errorHandler`) → same ingest
- Server: form captures and request errors → `appendSignal()` directly
- All rows → capped ring buffer over `useStorage('signals')` (default 10 000 rows, oldest evicted)
- External consumer (Polaris) pulls `GET /api/_signals/export?since=<seq>&limit=<n≤1000>`
  → `{ rows, cursor, site }`, `Authorization: Bearer <token>` required
- See: `layer/modules/events/server/utils/signal-buffer.ts`, `layer/modules/events/AGENTS.md`

**Key env vars:**
- `NUXT_SIGNAL_EXPORT_TOKEN` — bearer token for the export endpoint (unset → 503, never open)
- `NUXT_PUBLIC_SITE_ID` — site identifier on every row (falls back to the request host)

## Integration Points

**Analytics:**
- Pre-configured: Umami (privacy-first)
- Swap: Change `nuxt.config.ts` scripts registry
- Events flow through same system

**Webhooks:**
- `NUXT_WEBHOOK_URL` — single webhook URL, best-effort JSON POST on form capture
- No per-platform formatting/retry — the durable copy lives in the signal buffer

**Deployment:**
- Railway: Dockerfile included
- Vercel: `vercel.json` configured
- Zero setup tax (< 5 minutes)
