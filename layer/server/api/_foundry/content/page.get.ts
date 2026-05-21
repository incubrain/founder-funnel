import { defineEventHandler, getQuery, createError } from 'h3'
import { queryCollection } from '@nuxt/content/server'

// GET /api/_foundry/content/page?collection=pages&path=/foo
// Single content-query boundary for SSR. We sit on the public
// `@nuxt/content/server` API; pages should call this via useFetch.
export default defineEventHandler(async (event) => {
  const q = getQuery(event) as { collection?: string, path?: string }
  if (!q.collection || !q.path) {
    throw createError({ statusCode: 400, statusMessage: 'collection and path required' })
  }
  return queryCollection(event, q.collection as any).path(q.path).first()
})
