<script setup lang="ts">
definePageMeta({ layout: 'article' })
</script>

<template>
  <div data-testid="render-layout-article-page">
    <p>app-page-with-article-layout: exercises the article layout slot. Header chrome (back button, title) will be empty because no article context was set, but the wrapper must still render without throwing.</p>
  </div>
</template>
