<script setup lang="ts">
// Station override: one in-world footer strip — the layer's multi-column
// footer is off-world furniture on a one-page instrument.
import type { Ref } from 'vue'

interface SiteConfig {
  business?: { foundingYear?: number, legalName?: string }
  socials?: Record<string, string>
}

const site = inject<Ref<SiteConfig | null>>('site_config')
const year = new Date().getFullYear()
const founding = computed(() => site?.value?.business?.foundingYear ?? year)
const legal = computed(() => site?.value?.business?.legalName ?? 'Incubrain Pvt. Ltd.')
const socials = computed(() => site?.value?.socials ?? {})
const version = useAppConfig().foundry?.version
</script>

<template>
  <footer class="border-t st-rule">
    <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 py-5 sm:px-8">
      <p class="st-mono !text-[0.68rem]">
        © {{ founding }}–{{ year }} {{ legal }} · MIT license
      </p>
      <p class="st-mono flex items-center gap-4 !text-[0.68rem]">
        <a
          v-for="(href, name) in socials"
          :key="name"
          :href="href"
          target="_blank"
          rel="noopener noreferrer"
          class="st-invert px-1 uppercase !tracking-[0.1em]"
          style="color: var(--st-dim)"
        >{{ name }}</a>
        <span>built with @incubrain/foundry{{ version ? ` v${version}` : '' }}</span>
      </p>
    </div>
  </footer>
</template>
