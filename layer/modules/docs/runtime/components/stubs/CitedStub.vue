<script setup lang="ts">
defineProps<{ id: string }>()
defineSlots<{ default(props?: Record<string, never>): void }>()
</script>

<template>
  <span><slot /></span>
</template>
