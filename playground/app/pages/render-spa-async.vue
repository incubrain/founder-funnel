<script setup lang="ts">
// Mimics the astronera /viirs/maharashtra scenario: ssr:false + heavy async
// setup that delays paint. Use this fixture to verify the sticky-footer
// pattern keeps the footer pinned to the viewport bottom while the page is
// pending, instead of collapsing under the header.
definePageMeta({ ssr: false })

const ready = ref(false)

// Simulate a 1.5s async load (maps, geojson, etc).
await new Promise<void>((resolve) => {
  if (import.meta.client) setTimeout(resolve, 1500)
  else resolve()
})
ready.value = true
</script>

<template>
  <div
    data-testid="render-spa-async-page"
    class="p-8"
  >
    <p>spa-async-ready: this page took ~1.5s to mount. The footer must stay pinned at the viewport bottom during the wait, NOT collapse against the header.</p>
    <p
      v-if="ready"
      data-testid="render-spa-async-resolved"
    >
      resolved-marker
    </p>
  </div>
</template>
