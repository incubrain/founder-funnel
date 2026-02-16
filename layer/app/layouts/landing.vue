<script setup lang="ts">
const route = useRoute()

// Use unified content page composable
const { getPage, setContext } = useContentPage()
const { collections } = useContentConfig()

// Get business name from site config
const { data: siteConfig } = await useAsyncData('app-config', () =>
  queryCollection(collections.config)
    .where('stem', '=', 'config/site')
    .first(),
)

// Fetch page data
const { data: page } = await getPage()

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

// Publish context for components
watchEffect(() => {
  if (!page.value || page.value.path !== route.path) return
  setContext(page.value as unknown as Record<string, unknown>)
})

// SEO
watchEffect(() => {
  if (!page.value) return
  useSeoMeta({
    title: page.value.title,
    description: page.value.description,
    ogTitle: page.value.title,
    ogDescription: page.value.description,
  })
})

// OG Image generation
watch(
  page,
  async (newPage) => {
    if (newPage) {
      defineOgImage({
        component: 'Frame',
        props: {
          title: newPage.title,
          description: newPage.description,
          image: ((siteConfig.value as Record<string, unknown> | null)?.business as Record<string, unknown> | undefined)?.logo,
        },
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <UMain>
    <UPage>
      <slot />
    </UPage>
  </UMain>
</template>
