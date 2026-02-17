<template>
  <a
    :href="to"
    target="_blank"
    class="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 transition-colors"
  >
    <UIcon
      :name="icon"
      class="size-4"
    />
    <span class="font-medium text-white">{{ label }}</span>
    <span>{{ description }}</span>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  to: string
  description: string
  icon: string
}>()
</script>
