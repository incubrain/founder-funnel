<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)
</script>

<template>
  <div data-testid="render-dynamic-page">
    <p>dynamic-param: id=<span data-testid="render-dynamic-id">{{ id }}</span></p>
    <p>This page exercises a parameterized app/pages route (mirrors astronera's <code>pilots/[site].vue</code> and incubrain's <code>internal/influencers/[id].vue</code>).</p>
  </div>
</template>
