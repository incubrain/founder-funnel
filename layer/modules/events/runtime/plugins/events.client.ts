import type { EventPayload } from '../types/events'

export default defineNuxtPlugin({
  name: 'events-core',
  enforce: 'pre',
  setup(nuxtApp) {
    // Core plugin sets up the hook infrastructure. The signal provider listens
    // to `events:track` and queues each payload for /api/_signals/ingest.

    // Dev visibility only — `events.debug` in nuxt.config.
    if (useRuntimeConfig().public.events?.debug) {
      nuxtApp.hook('events:track', (payload: EventPayload) => {
        console.info(`📊 Event [${payload.type}]:`, payload)
      })
    }

    return {
      provide: {
        events: {
          track: async (payload: EventPayload) => {
            await useNuxtApp().callHook('events:track', payload)
          },
        },
      },
    }
  },
})
