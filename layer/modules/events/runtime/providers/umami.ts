import type { EventPayload } from '../types/events'

export default defineNuxtPlugin({
  name: 'events-provider-umami',
  dependsOn: ['events-core'],
  setup(nuxtApp) {
    nuxtApp.hook('events:track', async (payload: EventPayload) => {
      const $scripts = (nuxtApp as unknown as Record<string, unknown>).$scripts as Record<string, unknown> | undefined
      const umamiAnalytics = $scripts?.umamiAnalytics as { proxy?: { track: (type: string, data: Record<string, unknown>) => Promise<void> } } | undefined

      if (umamiAnalytics?.proxy) {
        try {
          await umamiAnalytics.proxy.track(payload.type, {
            event_id: payload.id,
            location: payload.location,
            action: payload.action,
            target: payload.target,
            timestamp: payload.timestamp,
            ...payload.data,
          })
        }
        catch (error) {
          log.error('umami', `Track failed: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    })
  },
})
