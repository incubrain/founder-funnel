import { useEventListener } from '@vueuse/core'
import { useSignalQueue } from '../composables/useSignalQueue'
import { pageContext, truncate } from '../utils/signal'

const MAX_MESSAGE = 500
const MAX_STACK = 1000

/** Client errors → signal buffer as `kind: 'log', severity: 'error'`. */
export default defineNuxtPlugin({
  name: 'events-error-capture',
  dependsOn: ['events-core'],
  setup(nuxtApp) {
    const { enqueue } = useSignalQueue()

    const report = (name: string, message: unknown, stack?: string) => {
      enqueue({
        kind: 'log',
        severity: 'error',
        name,
        ...pageContext(),
        data: {
          message: truncate(message, MAX_MESSAGE),
          stack: truncate(stack, MAX_STACK),
        },
      })
    }

    const previous = nuxtApp.vueApp.config.errorHandler
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
      report('vue_error', (error as Error)?.message ?? error, (error as Error)?.stack)
      previous?.(error, instance, info)
    }

    useEventListener(window, 'error', (event: ErrorEvent) => {
      report('window_error', event.message, event.error?.stack)
    })

    useEventListener(window, 'unhandledrejection', (event: PromiseRejectionEvent) => {
      report('unhandled_rejection', event.reason?.message ?? event.reason, event.reason?.stack)
    })
  },
})
