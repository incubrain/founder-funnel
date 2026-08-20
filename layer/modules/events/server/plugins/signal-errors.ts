import { appendSignal } from '../utils/signal-buffer'

const MAX_MESSAGE = 500
const MAX_STACK = 1000

/** Request errors → the same signal stream as analytics events. */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, ctx) => {
    const err = error as Error & { statusCode?: number }

    void appendSignal({
      kind: 'log',
      severity: 'error',
      name: 'server_error',
      page: ctx.event?.path,
      data: {
        message: String(err?.message ?? err).slice(0, MAX_MESSAGE),
        stack: err?.stack?.slice(0, MAX_STACK),
        statusCode: err?.statusCode,
      },
    }, ctx.event).catch(() => {})
  })
})
