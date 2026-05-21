<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <div data-testid="playground-index">
    <p>playground-root: this app page exists so the test runner's startup health-check on `/` returns 200.</p>
    <p>The content-driven catch-all does not currently handle `/` — see <code>useContentPage</code> trailing-slash bug (filed separately).</p>
  </div>
</template>
