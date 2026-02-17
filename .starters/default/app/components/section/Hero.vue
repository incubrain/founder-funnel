<!-- Custom Hero section. Use in content as: ::section-hero -->
<script setup lang="ts">
defineProps<{
  badge?: { label: string, to: string, description: string, icon: string }
  intro?: { title: string, highlight: string, description: string }
  cta?: {
    primary?: { label: string, offerSlug?: string, to?: string, icon?: string }
    secondary?: { label: string, to: string, icon?: string }
  }
  media?: { src: string, alt: string }
}>()
</script>

<template>
  <section class="relative overflow-hidden bg-neutral-950 text-white min-h-[80vh] flex items-center justify-center py-16">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />

    <div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <SectionHeroBadge
        v-if="badge"
        v-bind="badge"
      />

      <div
        v-if="intro"
        class="text-center max-w-3xl mx-auto space-y-6 mb-8"
      >
        <h1 class="font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
          <span class="block text-white">{{ intro.title }}</span>
          <span class="block bg-linear-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            {{ intro.highlight }}
          </span>
        </h1>
        <p class="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {{ intro.description }}
        </p>
      </div>

      <SectionHeroCta
        v-if="cta"
        v-bind="cta"
      />

      <div
        v-if="media"
        class="relative w-full max-w-4xl mx-auto mt-12"
      >
        <div class="rounded-xl bg-neutral-900 border border-neutral-800 p-2 shadow-2xl">
          <NuxtImg
            :src="media.src"
            :alt="media.alt"
            class="rounded-lg w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>
