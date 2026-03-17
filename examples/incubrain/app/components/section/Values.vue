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
    section-id="values"
    :title="title"
    :description="description"
  >
    <div class="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="space-y-3"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl font-black text-primary/40 leading-none select-none">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <UIcon
            :name="item.icon"
            class="size-5 text-primary"
          />
        </div>
        <h3 class="text-base font-heading font-bold text-highlighted">
          {{ item.title }}
        </h3>
        <p class="text-sm text-dimmed leading-relaxed">
          {{ item.description }}
        </p>
      </div>
    </div>
  </SectionWrapper>
</template>
