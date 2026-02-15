import { useLogger, createError as createEvlogError } from 'evlog'

export default defineEventHandler(async (event) => {
  const log = useLogger(event)
  const collection = getRouterParam(event, 'collection')

  log.set({ rss: { collection } })

  if (!collection) {
    throw createEvlogError({
      status: 404,
      message: 'Collection not specified',
      why: 'No collection parameter in the URL',
      fix: 'Use /rss/{collection} — e.g. /rss/decisions',
    })
  }

  // Get handler from registry (auto-imported)
  const handler = getRSSHandler(collection)

  if (!handler) {
    throw createEvlogError({
      status: 404,
      message: `RSS feed not available for: ${collection}`,
      why: `No RSS handler registered for collection "${collection}"`,
      fix: 'Register an RSS handler using registerRSSHandler() in server/utils/rss/',
    })
  }

  try {
    const feed = await handler(event)

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')

    return feed
  }
  catch (error: unknown) {
    log.error(error instanceof Error ? error : new Error(String(error)), { step: 'rss-generation' })
    throw createEvlogError({
      status: 500,
      message: 'RSS generation failed',
      why: error instanceof Error ? error.message : 'Unknown error during feed generation',
      fix: `Check the RSS handler for "${collection}" and ensure content is available`,
    })
  }
})
