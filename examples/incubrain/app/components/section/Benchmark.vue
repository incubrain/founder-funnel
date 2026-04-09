<script setup lang="ts">
const props = defineProps<{
  title?: string
  description?: string
  headline?: string
  metrics?: Array<{
    label: string
    hint: string
    lowerIsBetter?: boolean
    key: string
  }>
  models?: Array<{
    name: string
    cer: number
    wer: number
    exactMatch: number
    throughput: number
    isOurs?: boolean
  }>
}>()

function maxFor(key: string) {
  return Math.max(...(props.models?.map(m => (m as Record<string, number>)[key]) ?? [1]))
}
</script>

<template>
  <SectionWrapper
    section-id="benchmark"
    :title="title"
    :description="description"
    :headline="headline"
  >
    <div class="mt-10 sm:mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="metric in metrics"
        :key="metric.key"
        class="p-5 rounded-lg border border-default"
      >
        <h3 class="text-sm font-heading font-bold text-highlighted mb-0.5">
          {{ metric.label }}
        </h3>
        <p class="text-xs text-dimmed mb-5">
          {{ metric.hint }}
        </p>
        <div class="space-y-2.5">
          <div
            v-for="model in models"
            :key="`${metric.key}-${model.name}`"
            class="flex items-center gap-3"
          >
            <span
              class="w-24 text-xs text-right font-medium shrink-0"
              :class="model.isOurs ? 'text-primary font-bold' : 'text-dimmed'"
            >
              {{ model.name }}
            </span>
            <div class="flex-1 h-7 bg-muted/50 rounded relative">
              <div
                class="h-full rounded"
                :class="model.isOurs ? 'bg-primary' : 'bg-muted'"
                :style="{ width: `${Math.max(((model as Record<string, number>)[metric.key] / maxFor(metric.key)) * 100, 8)}%` }"
              />
              <span
                class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold whitespace-nowrap"
                :class="model.isOurs ? 'text-inverted' : 'text-highlighted'"
              >
                {{ metric.key === 'throughput'
                  ? (model as Record<string, number>)[metric.key].toLocaleString()
                  : (model as Record<string, number>)[metric.key] }}{{ metric.key !== 'throughput' ? '%' : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
