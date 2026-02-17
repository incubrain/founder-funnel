<script setup lang="ts">
definePageMeta({ layout: 'vrt' })

const { data: page } = await useAsyncData('vrt-homepage', () =>
  queryCollection('pages').path('/').first(),
)
</script>

<template>
  <div data-testid="vrt-container">
    <ContentRenderer
      v-if="page"
      :value="page"
    />
    <div
      v-else
      data-testid="vrt-error"
    >
      No homepage content found
    </div>
  </div>
</template>
