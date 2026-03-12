<script setup lang="ts">
defineProps<{
  quote?: string
  author?: string
}>()
</script>

<template>
  <section
    data-testid="section-quote"
    class="py-12 sm:py-16 bg-muted/50"
  >
    <blockquote class="mx-auto max-w-3xl px-6 text-center">
      <p class="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-highlighted leading-snug tracking-tight">
        &ldquo;{{ quote }}&rdquo;
      </p>
      <cite
        v-if="author"
        class="mt-4 block text-sm text-muted not-italic"
      >
        — {{ author }}
      </cite>
    </blockquote>
  </section>
</template>
