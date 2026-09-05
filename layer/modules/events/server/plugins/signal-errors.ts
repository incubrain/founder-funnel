import { appendSignal } from '../utils/signal-buffer'
import { describeVisitor } from '../utils/visitor-class'

const MAX_MESSAGE = 500
const MAX_STACK = 1000

/** Request errors → the same signal stream as analytics events. */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, ctx) => {
    const err = error as Error & { statusCode?: number }

    // A crashed request may not always carry a User-Agent header — leave
    // `visitor` unset rather than guess when there's nothing to classify.
    const userAgent = ctx.event ? getHeader(ctx.event, 'user-agent') : undefined

    void appendSignal({
      kind: 'log',
      severity: 'error',
      name: 'server_error',
      page: ctx.event?.path,
      visitor: userAgent ? describeVisitor(userAgent) : undefined,
      data: {
        message: String(err?.message ?? err).slice(0, MAX_MESSAGE),
        stack: err?.stack?.slice(0, MAX_STACK),
        statusCode: err?.statusCode,
      },
    }, ctx.event).catch(() => {})
  })
})
