<script setup lang="ts">
// SSR shell + client-only island. The outer marker SSRs; the inner one does not.
</script>

<template>
  <div data-testid="render-client-only-page">
    <p data-testid="render-client-only-shell">
      ssr-shell: this paragraph IS rendered server-side.
    </p>
    <ClientOnly>
      <p data-testid="render-client-only-island">
        client-island: this paragraph is NOT in the SSR HTML — it appears only after hydration.
      </p>
    </ClientOnly>
  </div>
</template>
