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
    <div class="mt-12 sm:mt-16 max-w-3xl mx-auto divide-y divide-default">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex gap-5 sm:gap-8 py-8 first:pt-0"
      >
        <div class="size-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
          <UIcon
            :name="item.icon"
            class="size-6 text-primary"
          />
        </div>
        <div>
          <h3 class="text-lg sm:text-xl font-heading font-bold text-highlighted">
            {{ item.title }}
          </h3>
          <p class="mt-2 text-sm sm:text-base text-dimmed leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
