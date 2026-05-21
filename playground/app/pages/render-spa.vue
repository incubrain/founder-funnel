<script setup lang="ts">
definePageMeta({ ssr: false })

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <div data-testid="render-spa-page">
    <p>spa-only: this page is configured with <code>ssr: false</code>.</p>
    <p>The initial server HTML should NOT contain the "client-mounted" sentinel below — it only appears after client hydration.</p>
    <p
      v-if="mounted"
      data-testid="render-spa-mounted"
    >
      client-mounted-sentinel
    </p>
  </div>
</template>
