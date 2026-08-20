---
paths:
  - "examples/**"
---

## Example App Rules

Example apps extend the core layer. They demonstrate usage patterns and serve as deployment targets.

**Content-first:**
- All page content in YAML/Markdown, never hardcoded in Vue components
- Content files live in `content/` directories within each example
- Customers edit content files, not code

**Layer usage:**
- Import composables and components from the layer — don't duplicate
- Each example has its own `nuxt.config.ts` extending the layer
- App-specific config in `app.config.ts`

**Observability:**
- No app-level log drains — events and errors land in the layer's signal buffer
- Set `NUXT_SIGNAL_EXPORT_TOKEN` and let the consumer pull `GET /api/_signals/export`
- Mount `nitro.storage.signals` (fs/KV) if rows must survive restarts

**Environment variables:**
- App-specific env vars in `.env` (gitignored)
- Document required vars in `.env.example`
- Use `useRuntimeConfig()` for server-side secrets

**Deployment:**
- Dockerfile in `deploy/` directory
- `vercel.json` for Vercel deployment
- Railway config included
