<script setup lang="ts">
defineProps<{ id: string }>()
defineSlots<{ default: () => void }>()
</script>

<template>
  <dfn><slot /></dfn>
</template>
