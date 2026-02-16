import { createUserAgentEnricher, createGeoEnricher } from 'evlog/enrichers'

export default defineNitroPlugin((nitroApp) => {
  const ua = createUserAgentEnricher()
  const geo = createGeoEnricher()

  nitroApp.hooks.hook('evlog:enrich', (ctx) => {
    ua(ctx)
    geo(ctx)
  })
})
