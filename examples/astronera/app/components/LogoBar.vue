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
  <div class="flex flex-wrap items-center justify-center gap-8 md:gap-12">
    <div
      v-for="(logo, i) in logos"
      :key="i"
      class="rounded-lg px-3 py-2 dark:bg-white/10 dark:backdrop-blur-sm transition-all duration-300"
    >
      <NuxtImg
        :src="logo.src"
        :alt="logo.alt"
        class="h-10 md:h-12 w-auto opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 dark:brightness-150"
        loading="lazy"
      />
    </div>
  </div>
</template>
