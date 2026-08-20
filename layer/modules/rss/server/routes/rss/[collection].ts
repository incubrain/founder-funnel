import { getRSSHandler } from '../../utils/rss-registry'

export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')

  if (!collection) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Collection not specified — use /rss/{collection}, e.g. /rss/blog',
    })
  }

  const handler = getRSSHandler(collection)

  if (!handler) {
    throw createError({
      statusCode: 404,
      statusMessage: `RSS feed not available for "${collection}" — add it to rss.feeds in nuxt.config.ts`,
    })
  }

  try {
    const feed = await handler(event)

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')

    return feed
  }
  catch (error: unknown) {
    // Thrown here, captured by the Nitro error hook into the signal buffer.
    throw createError({
      statusCode: 500,
      statusMessage: `RSS generation failed for "${collection}": ${error instanceof Error ? error.message : 'unknown error'}`,
    })
  }
})
