<script setup lang="ts">
interface Item {
  name: string
  detail: string
  status: 'SHIPPED' | 'PLANNED'
}

defineProps<{
  plate: string
  title: string
  body: string
  items: Item[]
}>()

const { el } = useSectionSignal('species')
</script>

<template>
  <section
    ref="el"
    aria-labelledby="species-title"
    class="relative z-10 border-b st-rule"
  >
    <div class="px-5 py-14 sm:px-8 md:py-20">
      <div class="grid gap-10 md:grid-cols-12">
        <div class="st-plate-tick md:col-span-5">
          <p class="st-mono-label">
            {{ plate }}
          </p>
          <h2
            id="species-title"
            class="st-display mt-3 text-[clamp(1.9rem,4vw,3.2rem)] text-balance"
          >
            {{ title }}
          </h2>
          <p
            class="mt-5 max-w-[56ch] leading-relaxed"
            style="color: var(--st-dim)"
          >
            {{ body }}
          </p>
        </div>
        <ul class="m-0 list-none space-y-0 p-0 md:col-span-7">
          <li
            v-for="item in items"
            :key="item.name"
            class="grid gap-1 border-t st-rule py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
          >
            <span
              class="st-mono self-start justify-self-start border px-2 py-0.5 !text-[0.62rem] !tracking-[0.14em]"
              :style="item.status === 'SHIPPED'
                ? { color: 'var(--st-soot)', background: 'var(--st-light)', borderColor: 'var(--st-light)' }
                : { color: 'var(--st-grat-label)', borderColor: 'var(--st-grat)' }"
            >{{ item.status }}</span>
            <div>
              <h3 class="st-display text-xl">
                {{ item.name }}
              </h3>
              <p
                class="mt-1 max-w-[62ch] text-sm leading-relaxed"
                style="color: var(--st-dim)"
              >
                {{ item.detail }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
