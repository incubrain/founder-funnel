<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  items?: Array<{
    title: string
    description: string
    icon: string
  }>
}>()
</script>

<template>
  <SectionWrapper
    section-id="red-flags"
    :title="title"
    :description="description"
  >
    <div class="mt-12 sm:mt-16 max-w-3xl mx-auto space-y-4">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex gap-5 sm:gap-6 p-5 sm:p-6 rounded-xl border border-error/20 bg-error/5"
      >
        <div class="size-10 shrink-0 rounded-lg bg-error/10 flex items-center justify-center">
          <UIcon
            :name="item.icon"
            class="size-5 text-error"
          />
        </div>
        <div>
          <h3 class="text-base sm:text-lg font-heading font-bold text-highlighted">
            {{ item.title }}
          </h3>
          <p class="mt-1.5 text-sm text-dimmed leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
