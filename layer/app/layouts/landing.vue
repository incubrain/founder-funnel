<script setup lang="ts">
// Pure presentation. SEO + OG image are reactive to whatever the catch-all
// publishes into the content context. Safe to mount on an app page that has
// no content — page is just null and the head metadata stays empty.
const { context } = useContentPage()
const page = computed(
  () => (context.value?.page ?? null) as Record<string, any> | null,
)

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
