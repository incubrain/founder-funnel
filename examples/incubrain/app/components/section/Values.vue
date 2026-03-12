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
    <div class="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex gap-4"
      >
        <span class="text-3xl font-black text-primary/30 leading-none select-none">
          {{ String(i + 1).padStart(2, '0') }}
        </span>
        <div>
          <div class="flex items-center gap-2">
            <UIcon
              :name="item.icon"
              class="size-4 text-primary"
            />
            <h3 class="text-base sm:text-lg font-heading font-bold text-highlighted">
              {{ item.title }}
            </h3>
          </div>
          <p class="mt-2 text-sm text-dimmed leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
