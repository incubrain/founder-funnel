// Evlog Drain — Opt-in Template
//
// This file is a starter template. No drain is active by default — server logs
// are only printed to the console. To send logs to an external service:
//
// 1. Pick a drain (Sentry, Axiom, PostHog, Better Stack, OTLP, or custom).
// 2. Set the required env vars (e.g. NUXT_SENTRY_DSN). See .env.example.
// 3. Uncomment the imports and wiring code below.
//
// Architecture docs: .agents/rules/architecture.md (section "Structured Logging (evlog)")
// Supported drains & env vars are listed there under "Key env vars".

// import { createSentryDrain } from 'evlog/sentry'
// import { createDrainPipeline } from 'evlog/pipeline'

export default defineNitroPlugin((_nitroApp) => {
  // TODO: Uncomment and configure a drain to start shipping logs externally.
  //
  // const pipeline = createDrainPipeline({
  //   batch: { size: 50, intervalMs: 5000 },
  //   retry: { maxAttempts: 3, backoff: 'exponential' },
  //   onDropped: (events, error) => {
  //     console.error(`[evlog] Dropped ${events.length} events:`, error?.message)
  //   },
  // })
  //
  // const drain = pipeline(createSentryDrain())
  //
  // _nitroApp.hooks.hook('evlog:drain', drain)
  // _nitroApp.hooks.hook('close', () => drain.flush())

  console.warn('[evlog] No log drain configured — events are not being sent to an external service. See server/plugins/evlog-drain.ts')
})
