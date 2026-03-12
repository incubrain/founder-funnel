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
    <div class="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex gap-4 p-5 rounded-xl border border-error/15 bg-error/5"
      >
        <div class="size-9 shrink-0 rounded-lg bg-error/10 flex items-center justify-center">
          <UIcon
            :name="item.icon"
            class="size-4.5 text-error"
          />
        </div>
        <div>
          <h3 class="text-sm sm:text-base font-heading font-bold text-highlighted">
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
