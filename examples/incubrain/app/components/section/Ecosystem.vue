<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  headline?: string
  items?: Array<{
    id: string
    name: string
    description: string
    icon: string
    to?: string
  }>
}>()
</script>

<template>
  <SectionWrapper
    section-id="ecosystem"
    :title="title"
    :description="description"
    :headline="headline"
  >
    <div class="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="item.to || ''"
        :target="item.to ? '_blank' : undefined"
        class="flex items-start gap-4 p-5 rounded-lg border border-default bg-default hover:bg-muted/60 transition-colors"
      >
        <UIcon
          :name="item.icon"
          class="size-5 shrink-0 text-primary mt-0.5"
        />
        <div>
          <h3 class="text-sm font-bold text-highlighted">
            {{ item.name }}
          </h3>
          <p class="mt-1 text-xs text-dimmed leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </SectionWrapper>
</template>
