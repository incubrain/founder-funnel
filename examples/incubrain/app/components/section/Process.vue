<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  items?: Array<{
    title: string
    description: string
  }>
}>()
</script>

<template>
  <SectionWrapper
    section-id="process"
    :title="title"
    :description="description"
  >
    <div class="mt-10 sm:mt-14 max-w-4xl mx-auto">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="relative flex gap-5 pb-8 last:pb-0"
      >
        <div class="flex flex-col items-center">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-inverted font-bold text-sm">
            {{ i + 1 }}
          </div>
          <div
            v-if="i < (items?.length ?? 0) - 1"
            class="w-px flex-1 bg-primary/20 mt-2"
          />
        </div>
        <div class="pt-1">
          <h3 class="text-base sm:text-lg font-heading font-bold text-highlighted">
            {{ item.title }}
          </h3>
          <p class="mt-1 text-sm text-dimmed leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
