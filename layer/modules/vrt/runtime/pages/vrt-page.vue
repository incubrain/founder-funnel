<script setup lang="ts">
definePageMeta({ layout: 'vrt' })

const route = useRoute()
const contentPath = computed(() => {
  const p = route.params.path
  return Array.isArray(p) ? `/${p.join('/')}` : `/${p}`
})

const { data: page } = await useAsyncData(
  () => `vrt-page-${contentPath.value}`,
  () => queryCollection('pages').path(contentPath.value).first(),
  { watch: [contentPath] },
)
</script>

<template>
  <div data-testid="vrt-container">
    <ContentRenderer
      v-if="page"
      :value="page"
    />
    <div
      v-else
      data-testid="vrt-error"
    >
      Page not found: {{ contentPath }}
    </div>
  </div>
</template>
