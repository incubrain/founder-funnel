import { useSignalQueue } from '../composables/useSignalQueue'
import { toSignalRow } from '../utils/signal'
import type { EventPayload } from '../types/events'

export default defineNuxtPlugin({
  name: 'events-provider-signal',
  dependsOn: ['events-core'],
  setup(nuxtApp) {
    const { enqueue } = useSignalQueue()

    nuxtApp.hook('events:track', (payload: EventPayload) => {
      enqueue(toSignalRow(payload))
    })
  },
})
