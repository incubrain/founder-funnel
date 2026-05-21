import type { PageCollections } from '@nuxt/content'
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
  // `fields` is a Nuxt Content branded literal-union; cast through unknown
  // since we accept arbitrary strings from the query param.
  type FieldList = NonNullable<Parameters<typeof queryCollectionItemSurroundings>[3]>['fields']
  const fields = q.fields ? (q.fields.split(',') as unknown as FieldList) : undefined
  return queryCollectionItemSurroundings(
    event,
    q.collection as keyof PageCollections,
    q.path,
    fields ? { fields } : undefined,
  )
})
