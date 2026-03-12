export default defineNitroPlugin((_nitroApp) => {
  // TODO: Configure your log drain destination
  //
  // 1. Set NUXT_SENTRY_DSN in your .env file
  // 2. Uncomment the imports and code below
  //
  // import { createSentryDrain } from 'evlog/sentry'
  // import { createDrainPipeline } from 'evlog/pipeline'
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
