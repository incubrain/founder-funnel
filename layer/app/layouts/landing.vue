<script setup lang="ts">
// See default.vue for why the layout fetches its own page data
// (useAsyncData dedupes — this is a cache hit, not a second request).
const { getPage } = useContentPage()
const { data: page } = await getPage()

watchEffect(() => {
  if (!page.value) return
  useSeoMeta({
    title: (page.value as any).title,
    description: (page.value as any).description,
    ogTitle: (page.value as any).title,
    ogDescription: (page.value as any).description,
  })
})

watchEffect(() => {
  if (!page.value) return
  defineOgImageComponent('Landing', {
    title: (page.value as any).title,
    description: (page.value as any).description,
  })
})
</script>

<template>
  <UMain>
    <UPage>
      <slot />
    </UPage>
  </UMain>
</template>
