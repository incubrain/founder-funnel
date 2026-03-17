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
    section-id="manifesto-list"
    :title="title"
    :description="description"
  >
    <div class="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex gap-4"
      >
        <div class="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
          <UIcon
            :name="item.icon"
            class="size-5 text-primary"
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
