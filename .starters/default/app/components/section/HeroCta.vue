<template>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
    <ConvertInternal
      v-if="primary?.offerSlug"
      :offer-slug="primary.offerSlug"
      :label="primary.label"
      location="hero"
      size="xl"
    />
    <UButton
      v-else-if="primary"
      :to="primary.to"
      :label="primary.label"
      :icon="primary.icon"
      color="primary"
      size="xl"
    />
    <UButton
      v-if="secondary"
      :to="secondary.to"
      :label="secondary.label"
      :icon="secondary.icon"
      color="neutral"
      variant="link"
      size="xl"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  primary?: {
    label: string
    offerSlug?: string
    to?: string
    icon?: string
  }
  secondary?: {
    label: string
    to: string
    icon?: string
  }
}>()
</script>
