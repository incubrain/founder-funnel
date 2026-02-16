export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('evlog:emit:keep', (ctx) => {
    // Always keep successful signal capture events (form submissions, leads)
    if ((ctx.context.lead as Record<string, unknown> | undefined)?.email) {
      ctx.shouldKeep = true
    }

    // Always keep webhook delivery results
    if (ctx.context.delivery) {
      ctx.shouldKeep = true
    }
  })
})
