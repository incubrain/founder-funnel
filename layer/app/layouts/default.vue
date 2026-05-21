<script setup lang="ts">
// Pure presentation. Reads page metadata from the shared content context if
// the catch-all populated it; otherwise renders the slot bare. Does NOT
// fetch and does NOT throw — that responsibility moved to `pages/[...slug].vue`.
const { context } = useContentPage()
const page = computed(
  () => (context.value?.page ?? null) as Record<string, any> | null,
)
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
