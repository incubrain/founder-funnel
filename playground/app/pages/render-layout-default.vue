<script setup lang="ts">
// App-page that opts into Foundry's `default` layout with NO sibling content
// file. Exercises the path where a layout must not 404 when the catch-all
// hasn't populated the content context.
definePageMeta({ layout: 'default' })
</script>

<template>
  <div data-testid="render-layout-default-page">
    <p>app-page-with-default-layout: the page is wrapped by Foundry's default layout (UMain → UPage → UContainer) without any content fetch.</p>
  </div>
</template>
