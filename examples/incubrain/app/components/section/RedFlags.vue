<script setup lang="ts">
const props = defineProps<{
  title?: string
  description?: string
  items?: Array<{
    title: string
    description: string
    icon: string
  }>
}>()

const accordionItems = computed(() =>
  props.items?.map(item => ({
    label: item.title,
    icon: item.icon,
    content: item.description,
  })) ?? [],
)
</script>

<template>
  <SectionWrapper
    section-id="red-flags"
    :title="title"
    :description="description"
    class="bg-muted/50"
  >
    <!-- Desktop: 2-col grid -->
    <div class="mt-10 sm:mt-14 hidden md:grid grid-cols-2 gap-4">
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
          <h3 class="text-sm font-heading font-bold text-highlighted">
            {{ item.title }}
          </h3>
          <p class="mt-1 text-sm text-dimmed leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Mobile: accordion -->
    <div class="mt-10 md:hidden">
      <UAccordion :items="accordionItems" />
    </div>
  </SectionWrapper>
</template>
