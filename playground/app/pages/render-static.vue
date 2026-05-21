<script setup lang="ts">
definePageMeta({ key: 'render-static' })
</script>

<template>
  <div data-testid="render-static-page">
    <p>app-page-wins: This is an explicit <code>app/pages/render-static.vue</code>.</p>
    <p>If this renders instead of <code>content/pages/render-static.md</code>, app pages beat content via the catch-all.</p>
  </div>
</template>
