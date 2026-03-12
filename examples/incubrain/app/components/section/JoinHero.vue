<script setup lang="ts">
defineProps<{
  headline?: string
  highlight?: string
  description?: string
  teaser?: string
  cta?: { label: string, to: string, icon?: string }
}>()
</script>

<template>
  <section
    data-testid="section-join-hero"
    class="relative py-16 sm:py-24 lg:py-32"
  >
    <div class="mx-auto max-w-3xl px-6 text-center">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-highlighted leading-[1.1]">
        {{ headline }}
        <span class="text-primary block mt-1">{{ highlight }}</span>
      </h1>
      <p class="mt-6 text-lg sm:text-xl text-dimmed leading-relaxed max-w-2xl mx-auto">
        {{ description }}
      </p>
      <p
        v-if="teaser"
        class="mt-4 text-sm text-muted italic max-w-xl mx-auto"
      >
        {{ teaser }}
      </p>
      <div
        v-if="cta"
        class="mt-8"
      >
        <UButton
          :label="cta.label"
          :to="cta.to"
          :trailing-icon="cta.icon"
          size="xl"
          color="primary"
          variant="solid"
        />
      </div>
    </div>
  </section>
</template>
