<!-- app/components/content/AnswerBlock.vue -->
<!--
  Answer-first pattern (product-validator-m0f.7): a direct, quotable summary
  placed at the top of a page or section — the shape generative engines lift
  verbatim when citing a source. Authors fill `answer`; this renders it.
-->
<script setup lang="ts">
interface Props {
  answer: string
  label?: string
  updated?: string
}

withDefaults(defineProps<Props>(), {
  label: 'In short',
  updated: undefined,
})
</script>

<template>
  <section
    class="my-8 p-5 rounded-lg bg-primary/5 border border-primary/20"
    aria-label="Direct answer"
    data-testid="answer-block"
  >
    <p class="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
      {{ label }}
    </p>
    <p class="text-lg text-highlighted leading-relaxed">
      {{ answer }}
    </p>
    <p
      v-if="updated"
      class="text-xs text-muted mt-3"
    >
      Last verified
      <NuxtTime
        :datetime="updated"
        year="numeric"
        month="long"
        day="numeric"
      />
    </p>
  </section>
</template>
