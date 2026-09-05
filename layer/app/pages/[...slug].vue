<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { ContentDoc } from '../composables/useContentPage'

// The catch-all is the only surface that 404s when a route has no matching
// content document. Layouts read from the shared content context — they do
// not fetch and do not throw.
const route = useRoute()
const { collection, getPage, setContext, context } = useContentPage()

const { data: page } = await getPage()

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

// Literal query values, not getters — see useContentPage.getPage() for why.
const { data: surround } = await useFetch<Array<ContentNavigationItem | null>>(
  '/api/_foundry/content/surround',
  {
    key: `surround-${collection.value}-${route.path}`,
    query: {
      collection: collection.value,
      path: route.path,
      fields: 'title,description,label',
    },
    default: () => [],
    watch: [() => route.path, collection],
  },
)

watchEffect(() => {
  if (!page.value || page.value.path !== route.path) return
  setContext(page.value as unknown as Record<string, unknown>, {
    surround: surround.value,
  })
})
</script>

<template>
  <div>
    <UPageHero
      v-if="page?.hero && (page?.title || page?.description)"
      :title="page?.title"
      :description="page?.description"
    />
    <ContentRenderer
      v-if="context?.page"
      :key="(context.page as ContentDoc).path"
      :value="context.page"
    />
  </div>
</template>
