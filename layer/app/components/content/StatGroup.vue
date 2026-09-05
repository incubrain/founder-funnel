<!-- app/components/content/StatGroup.vue -->
<!--
  Citation-friendly statistics (product-validator-m0f.7): a stat lifted from
  a named source outperforms an unattributed one for AI-citation rate. Each
  stat renders as a <figure> with a visible source line — `<cite>`, linked
  when `href` is given — instead of a bare number.
-->
<script setup lang="ts">
interface Stat {
  value: string
  label: string
  source?: string
  href?: string
}

interface Props {
  stats: Stat[]
  columns?: 2 | 3 | 4
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
})

const gridClasses = computed(() => {
  const colMap = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }
  return ['grid grid-cols-1 gap-6', colMap[props.columns]].join(' ')
})
</script>

<template>
  <section class="my-12">
    <div :class="gridClasses">
      <figure
        v-for="(stat, index) in stats"
        :key="index"
        class="p-5 rounded-lg bg-muted/10 border border-default"
      >
        <p class="text-3xl font-bold text-highlighted">
          {{ stat.value }}
        </p>
        <figcaption class="text-sm text-muted mt-1">
          {{ stat.label }}
        </figcaption>
        <p
          v-if="stat.source"
          class="text-xs text-muted mt-3 pt-3 border-t border-default"
        >
          Source:
          <a
            v-if="stat.href"
            :href="stat.href"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:text-primary"
          ><cite>{{ stat.source }}</cite></a>
          <cite v-else>{{ stat.source }}</cite>
        </p>
      </figure>
    </div>
  </section>
</template>
