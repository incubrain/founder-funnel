<script setup lang="ts">
definePageMeta({ key: 'render-citations' })
</script>

<template>
  <div data-testid="render-citations-page">
    <p>render-citations: renders the citation-first content components (product-validator-m0f.7) so the GEO content e2e suite has a real page to fetch.</p>

    <StatGroup
      :stats="[
        {
          value: '22–40%',
          label: 'AI-citation lift from citation-first content',
          source: 'Princeton/Georgia Tech GEO study',
          href: 'https://example.com/geo-study',
        },
      ]"
    />

    <CaseStudy
      :client="{ name: 'Dr. Jane Doe', role: 'AI Researcher' }"
      quote="Citation-first content measurably improves how often AI engines quote a source."
      source-url="https://example.com/expert-interview"
    />
  </div>
</template>
