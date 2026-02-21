---
label: Deployment
title: Deployment Overview
description: Ship-first philosophy and general deployment guidance.
---

Deployment should take less than 5 minutes. If it takes longer, something is wrong.

Foundry is a standard Nuxt application. Anything that can run a Node.js server can host it.

## Build

```bash
pnpm build
```

This produces a `.output/` directory with a self-contained Node.js server.

## Preview

Test the production build locally:

```bash
pnpm preview
```

## Environment Variables

Set your environment variables in the hosting provider's dashboard. At minimum, you need `NUXT_PUBLIC_SITE_URL`. Add `NUXT_WEBHOOK_URL` and analytics variables as needed.

See the [full environment variables reference](/docs/reference/environment-variables) for all available variables.

## Supported Targets

| Platform | Method | Config Included |
|---|---|---|
| [Docker](/docs/deployment/docker) | Dockerfile | Yes (in example apps) |
| [Vercel](/docs/deployment/vercel) | Git push | Yes (`vercel.json`) |
| [Railway](/docs/deployment/railway) | Dockerfile | Yes |
| [Netlify](https://nuxt.com/deploy/netlify){target="_blank"} | Git push | Use Nuxt preset |
| [Cloudflare](https://nuxt.com/deploy/cloudflare){target="_blank"} | Git push | Use Nuxt preset |
| Any Node.js host | `node .output/server/index.mjs` | — |

For platforms not listed here, see the [Nuxt deployment documentation](https://nuxt.com/deploy){target="_blank"}.

::card-group
  ::card{title="Docker" icon="i-lucide-container" to="/docs/deployment/docker"}
  Multi-stage Dockerfile for any container host.
  ::

  ::card{title="Vercel" icon="i-lucide-triangle" to="/docs/deployment/vercel"}
  Zero-config deployment to Vercel.
  ::

  ::card{title="Railway" icon="i-lucide-train-front" to="/docs/deployment/railway"}
  Dockerfile deployment on Railway.
  ::
::
