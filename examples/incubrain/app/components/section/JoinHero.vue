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
    class="relative py-24 sm:py-32 lg:py-40"
  >
    <div class="mx-auto max-w-3xl px-6 text-center">
      <h1 class="text-4xl sm:text-5xl lg:text-7xl font-heading font-black tracking-tight text-highlighted leading-[1.1]">
        {{ headline }}
        <span class="text-primary block mt-2">{{ highlight }}</span>
      </h1>
      <p class="mt-8 text-lg sm:text-xl text-dimmed leading-relaxed max-w-2xl mx-auto">
        {{ description }}
      </p>
      <p
        v-if="teaser"
        class="mt-6 text-sm sm:text-base text-muted italic"
      >
        {{ teaser }}
      </p>
      <div
        v-if="cta"
        class="mt-10"
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
