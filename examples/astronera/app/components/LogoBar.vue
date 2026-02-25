<script setup lang="ts">
interface Logo {
  src: string
  alt: string
}

defineProps<{
  logos: Logo[]
}>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70">
    <NuxtImg
      v-for="(logo, i) in logos"
      :key="i"
      :src="logo.src"
      :alt="logo.alt"
      class="h-10 md:h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
      loading="lazy"
    />
  </div>
</template>
