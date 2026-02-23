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

**Server plugins:**
- Create evlog drain plugins in `server/plugins/evlog-drain.ts`
- Use `createDrainPipeline()` for production batching + retry
- See `examples/astronera/server/plugins/evlog-drain.ts` for reference

**Environment variables:**
- App-specific env vars in `.env` (gitignored)
- Document required vars in `.env.example`
- Use `useRuntimeConfig()` for server-side secrets

**Deployment:**
- Dockerfile in `deploy/` directory
- `vercel.json` for Vercel deployment
- Railway config included
