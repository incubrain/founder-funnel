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

# Copy workspace metadata + lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json .npmrc* ./
COPY examples/foundry/package.json examples/foundry/

# Install with filter
RUN --mount=type=cache,id=pnpm-foundry-store,target=/root/.local/share/pnpm/store \
    pnpm install \
    --filter ./examples/foundry... \
    --frozen-lockfile \
    --reporter=append-only

# Copy source code
COPY examples/foundry examples/foundry

# Build
RUN pnpm --filter ./examples/foundry... build

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

COPY --from=builder /app/examples/foundry/.output ./.output

EXPOSE $PORT

CMD ["node", ".output/server/index.mjs"]
