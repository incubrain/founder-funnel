<script setup lang="ts">
// Regression fixture for product-validator-m0f.4.
//
// `ConvertInternal` resolves its CTA copy (label, description, icon) from the
// `pages` collection at `/offers/<offerSlug>`. That query used to run with
// `lazy: true, server: false`, so the SSR HTML shipped the generic "Learn More"
// fallback and the real conversion copy only appeared after hydration —
// invisible to AI crawlers, which execute zero JavaScript.
//
// `test/e2e/rendering.e2e.spec.ts` asserts the offer's title and description
// appear in this route's rendered (script-stripped) SSR HTML.
</script>

<template>
  <div data-testid="render-convert-page">
    <p>convert-ssr: the ConvertInternal CTA below must render server-side.</p>

    <ConvertInternal
      offer-slug="booking"
      variant="card"
      location="e2e-render-convert"
    />
  </div>
</template>
