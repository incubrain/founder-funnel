<script setup lang="ts">
// Layout pulls page data via the same key the catch-all uses; useAsyncData
// dedupes, so this is a cache hit, not a second HTTP request. We need the
// data at LAYOUT render time (not just page render time) because layouts
// render before their slot — if we read from a shared context that the
// catch-all populates inside its slot, SSR sees `null` and the client
// hydrates with the populated value → guaranteed CLS / hydration mismatch.
const { getPage } = useContentPage()
const { data: page } = await getPage()
</script>

<template>
  <UMain>
    <UPage class="pb-12 lg:pb-16">
      <UPageHero
        v-if="page?.hero && (page?.title || page?.description)"
        :title="page?.title"
        :description="page?.description"
      />
      <UContainer>
        <slot />
      </UContainer>
    </UPage>
  </UMain>
</template>
