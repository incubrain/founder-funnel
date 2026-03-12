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

RUN corepack enable && corepack prepare pnpm@10.12.0 --activate

WORKDIR /app

# ------------------------------------------------
# 1. Copy workspace metadata + lockfile (CRITICAL)
# ------------------------------------------------
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# ------------------------------------------------
# 2. Copy only package manifests needed for install
# ------------------------------------------------
COPY package.json .npmrc* ./
COPY examples/incubrain/package.json examples/incubrain/

# ------------------------------------------------
# 3. Install ONLY incubrain (uses root lockfile)
# ------------------------------------------------

RUN --mount=type=cache,id=s/incubrain-pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install \
    --filter ./examples/incubrain... \
    --frozen-lockfile \
    --reporter=append-only

# ------------------------------------------------
# 4. Copy source code AFTER install (cache-friendly)
# ------------------------------------------------
COPY examples/incubrain examples/incubrain

# ------------------------------------------------
# 5. Build only incubrain
# ------------------------------------------------
RUN pnpm --filter ./examples/incubrain... build

# ============================================
# STAGE 2: Production Runner
# ============================================
FROM node:22.21-bookworm-slim AS runner

ARG PORT=3000
ARG HOST=0.0.0.0
ARG WEBHOOK_URL=""
ARG TELEGRAM_CHAT_ID=""

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV PORT=$PORT
ENV HOST=$HOST
ENV WEBHOOK_URL=$WEBHOOK_URL
ENV TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID

WORKDIR /app

COPY --from=builder /app/examples/incubrain/.output ./.output

EXPOSE $PORT

CMD ["node", ".output/server/index.mjs"]
