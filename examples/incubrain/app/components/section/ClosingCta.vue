<script setup lang="ts">
defineProps<{
  title?: string
  highlight?: string
  description?: string
  cta?: {
    label: string
    to: string
    icon?: string
  }
  pattern?: {
    name: string
    opacity?: number
  }
}>()
</script>

<template>
  <section
    data-testid="section-closing-cta"
    class="relative py-16 sm:py-24 bg-primary overflow-hidden"
  >
    <BgPattern
      v-if="pattern"
      :name="(pattern.name as any)"
      :opacity="pattern.opacity || 0.08"
      absolute
    />
    <div class="relative z-10 mx-auto max-w-3xl px-6 text-center">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-inverted leading-tight">
        {{ title }}
        <span
          v-if="highlight"
          class="block mt-1"
        >
          {{ highlight }}
        </span>
      </h2>
      <p
        v-if="description"
        class="mt-4 text-sm sm:text-base text-inverted/80 leading-relaxed max-w-xl mx-auto"
      >
        {{ description }}
      </p>
      <UButton
        v-if="cta"
        :label="cta.label"
        :to="cta.to"
        :icon="cta.icon"
        size="xl"
        color="neutral"
        variant="solid"
        trailing
        class="mt-8"
      />
    </div>
  </section>
</template>
