<script setup lang="ts">
const route = useRoute()

// Use unified content page composable
const { getPage, setContext } = useContentPage()

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
      defineOgImageComponent('Landing', {
        title: newPage.title,
        description: newPage.description,
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
