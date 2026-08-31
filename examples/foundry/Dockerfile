# syntax=docker/dockerfile:1.4

# ============================================
# STAGE 1: Builder
# ============================================
FROM node:22.21-bookworm AS builder

ARG NUXT_PUBLIC_SCRIPTS_UMAMI_ANALYTICS_WEBSITE_ID=""
ARG NUXT_PUBLIC_SCRIPTS_UMAMI_ANALYTICS_SCRIPT_INPUT_SRC=""
ARG NUXT_PUBLIC_SITE_URL=""

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=3072"
ENV NUXT_PUBLIC_SCRIPTS_UMAMI_ANALYTICS_WEBSITE_ID=$NUXT_PUBLIC_SCRIPTS_UMAMI_ANALYTICS_WEBSITE_ID
ENV NUXT_PUBLIC_SCRIPTS_UMAMI_ANALYTICS_SCRIPT_INPUT_SRC=$NUXT_PUBLIC_SCRIPTS_UMAMI_ANALYTICS_SCRIPT_INPUT_SRC
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /app

# ------------------------------------------------
# 1. Copy workspace metadata + lockfile (CRITICAL)
# ------------------------------------------------
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# ------------------------------------------------
# 2. Copy only package manifests needed for install
#    (layer/package.json is REQUIRED: the example depends on
#    @incubrain/foundry via workspace:^ — without it pnpm silently
#    installs nothing for the layer and the build fails at
#    auto-import time)
# ------------------------------------------------
COPY package.json .npmrc* ./
COPY layer/package.json layer/
COPY examples/foundry/package.json examples/foundry/

# ------------------------------------------------
# 3. Install ONLY foundry + its workspace deps (uses root lockfile).
#    --prod=false: install devDependencies too despite
#    NODE_ENV=production — the build needs them, matching local.
# ------------------------------------------------

RUN --mount=type=cache,id=s/705172d8-adee-407c-bc8c-5c02d4da348c-pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install \
    --filter '{./examples/foundry}...' \
    --frozen-lockfile \
    --prod=false \
    --reporter=append-only

# ------------------------------------------------
# 4. Copy source code AFTER install (cache-friendly)
# ------------------------------------------------
COPY layer layer
COPY examples/foundry examples/foundry

# ------------------------------------------------
# 5. Prepare the layer's typegen (fresh checkouts have no layer/.nuxt,
#    and the example's build resolves layer tsconfig references), then
#    build only foundry
# ------------------------------------------------
RUN pnpm exec nuxt prepare layer \
    && pnpm --filter '{./examples/foundry}' build

# ============================================
# STAGE 2: Production Runner
# ============================================
FROM node:22.21-bookworm-slim AS runner

ARG PORT=3000
ARG HOST=0.0.0.0
ARG NUXT_SIGNAL_EXPORT_TOKEN=""
ARG NUXT_PUBLIC_SITE_ID=""

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV PORT=$PORT
ENV HOST=$HOST
ENV NUXT_SIGNAL_EXPORT_TOKEN=$NUXT_SIGNAL_EXPORT_TOKEN
ENV NUXT_PUBLIC_SITE_ID=$NUXT_PUBLIC_SITE_ID

WORKDIR /app

COPY --from=builder /app/examples/foundry/.output ./.output

EXPOSE $PORT

CMD ["node", ".output/server/index.mjs"]
