import { defineEventHandler, getQuery, createError } from 'h3'
import { queryCollectionItemSurroundings } from '@nuxt/content/server'

// GET /api/_foundry/content/surround?collection=pages&path=/foo&fields=title,description,label
export default defineEventHandler(async (event) => {
  const q = getQuery(event) as {
    collection?: string
    path?: string
    fields?: string
  }
  if (!q.collection || !q.path) {
    throw createError({ statusCode: 400, statusMessage: 'collection and path required' })
  }
  const fields = q.fields ? q.fields.split(',') : undefined
  return queryCollectionItemSurroundings(
    event,
    q.collection as any,
    q.path,
    fields ? { fields } : undefined,
  )
})
