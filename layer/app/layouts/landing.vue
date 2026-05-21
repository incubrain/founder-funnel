<script setup lang="ts">
// See default.vue for why the layout fetches its own page data
// (useAsyncData dedupes — this is a cache hit, not a second request).
const { getPage } = useContentPage()
const { data: page } = await getPage()

watchEffect(() => {
  if (!page.value) return
  useSeoMeta({
    title: page.value.title,
    description: page.value.description,
    ogTitle: page.value.title,
    ogDescription: page.value.description,
  })
})

watchEffect(() => {
  if (!page.value) return
  defineOgImageComponent('Landing', {
    title: page.value.title,
    description: page.value.description,
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
