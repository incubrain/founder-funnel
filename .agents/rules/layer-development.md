---
paths:
  - "layer/**"
---

## Layer Development Rules

This is the core Nuxt layer. Everything here is reusable across example apps.

**Component constraints:**
- Max 50 lines per component — extract to composable if longer
- Max 5 props — use config object prop if more
- No prop drilling > 2 levels — use composable or provide/inject
- `data-testid` pattern: `{component-type}-{identifier}`

**Composable patterns:**
- `useEvents()` for all event tracking
- `useAppStorage()` for storage (never direct localStorage)
- `useContentCache()` for content queries
- `useUserIdentity()` for anonymous user IDs

**Component locations:**
- `layer/app/components/convert/` — Signal capture (Email, Booking, Pricing)
- `layer/app/components/section/` — Landing sections (Hero, Benefits, FAQ)
- `layer/app/components/nav/` — Navigation (Header, Footer)

**Module development:**
- Each module in `layer/modules/` has its own AGENTS.md — read it first
- Modules are self-contained with runtime/ (client) and server/ directories
- Auto-import composables and components via module setup

**SSR safety:**
- Use `import.meta.client` guards for browser-only APIs
- Use `.client.ts` / `.server.ts` file naming for platform-specific code
- Test with SSR enabled (default Nuxt behavior)
