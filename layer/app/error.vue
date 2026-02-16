<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: 'en',
    dir: 'ltr',
  },
})
</script>

<template>
  <UApp>
    <AppHeader />
    <UError :error="error" />
    <AppFooter />
  </UApp>
</template>
