<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  pattern?: {
    name: string
    opacity?: number
  }
  items?: Array<{
    title: string
    description?: string
    icon?: string
    status?: 'active' | 'upcoming' | 'future'
  }>
}>()

const statusColor: Record<string, string> = {
  active: 'bg-primary text-inverted',
  upcoming: 'bg-muted text-highlighted',
  future: 'bg-muted/50 text-dimmed',
}

const statusLabel: Record<string, string> = {
  active: 'In Progress',
  upcoming: 'Next',
  future: 'Planned',
}
</script>

<template>
  <SectionWrapper
    section-id="roadmap"
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
    <div class="relative z-10 mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="p-5 rounded-lg border border-default bg-default"
      >
        <div class="flex items-center justify-between mb-3">
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="size-5 text-primary"
          />
          <span
            :class="statusColor[item.status || 'future']"
            class="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide"
          >
            {{ statusLabel[item.status || 'future'] }}
          </span>
        </div>
        <h3 class="text-sm font-bold text-highlighted">
          {{ item.title }}
        </h3>
        <p
          v-if="item.description"
          class="mt-1 text-xs text-dimmed leading-relaxed"
        >
          {{ item.description }}
        </p>
      </div>
    </div>
  </SectionWrapper>
</template>
