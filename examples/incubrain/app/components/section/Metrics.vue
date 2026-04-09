<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  pattern?: {
    name: string
    opacity?: number
  }
  items?: Array<{
    id: string
    value: string
    label: string
    detail?: string
    icon?: string
  }>
}>()
</script>

<template>
  <SectionWrapper
    section-id="metrics"
    :title="title"
    :description="description"
    class="bg-muted/50 relative overflow-hidden"
  >
    <BgPattern
      v-if="pattern"
      :name="(pattern.name as any)"
      :opacity="pattern.opacity || 0.1"
      absolute
    />
    <div class="relative z-10 mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
      <div
        v-for="item in items"
        :key="item.id"
        class="text-center p-6 rounded-lg border border-default bg-default"
      >
        <UIcon
          v-if="item.icon"
          :name="item.icon"
          class="size-6 text-primary mb-3"
        />
        <div class="text-3xl sm:text-4xl font-heading font-bold text-primary">
          {{ item.value }}
        </div>
        <div class="mt-2 text-sm font-medium text-highlighted">
          {{ item.label }}
        </div>
        <p
          v-if="item.detail"
          class="mt-1 text-xs text-dimmed"
        >
          {{ item.detail }}
        </p>
      </div>
    </div>
  </SectionWrapper>
</template>
