<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <div data-testid="render-layout-false-page">
    <p>layout-false: no <code>&lt;NuxtLayout&gt;</code> wrapper should appear around this page's content.</p>
    <p>The Foundry layouts (default/landing/article) must NOT be applied. The app.vue chrome (header/footer) may still render — it's outside the NuxtLayout slot.</p>
  </div>
</template>
