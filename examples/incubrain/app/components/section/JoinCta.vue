<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <SectionWrapper
    id="apply"
    section-id="join-cta"
    :title="title"
    :description="description"
    class="scroll-mt-24"
  >
    <div class="mt-10 sm:mt-14 max-w-2xl mx-auto">
      <slot />
    </div>
  </SectionWrapper>
</template>
