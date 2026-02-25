<script setup lang="ts">
interface Stat {
  value: string
  label: string
  sublabel?: string
  icon: string
}

defineProps<{
  stats: Stat[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
    <UPageCard
      v-for="(stat, i) in stats"
      :key="i"
      variant="soft"
      :icon="stat.icon"
    >
      <template #title>
        {{ stat.value }} {{ stat.label }}
      </template>
      <template #description>
        {{ stat.sublabel }}
      </template>
    </UPageCard>
  </div>
</template>
