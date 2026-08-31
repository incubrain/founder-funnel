<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const props = defineProps<{
  pkg: string
  location: string
}>()

const PMS = {
  pnpm: 'pnpm add',
  npm: 'npm i',
  yarn: 'yarn add',
  bun: 'bun add',
} as const
type Pm = keyof typeof PMS

// pnpm is the station standard; the visitor's switch persists locally.
const pm = useLocalStorage<Pm>('station-pm', 'pnpm')
const command = computed(() => `${PMS[pm.value] ?? PMS.pnpm} ${props.pkg}`)

const { trackEvent } = useEvents()
const copied = ref(false)
async function copy() {
  trackEvent({ id: `offer_click_service_${props.location}_install_${pm.value}`, type: 'offer_click', target: 'service_internal' })
  try {
    await navigator.clipboard.writeText(command.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  catch { /* clipboard unavailable — the command stays selectable */ }
}
</script>

<template>
  <div class="w-full md:max-w-md">
    <div
      class="flex border-x border-t"
      style="border-color: var(--st-verm)"
      role="tablist"
      aria-label="Package manager"
    >
      <button
        v-for="(_, name) in PMS"
        :key="name"
        type="button"
        role="tab"
        :aria-selected="pm === name"
        class="st-mono flex-1 px-2 py-1.5 !text-[0.64rem] !tracking-[0.12em] uppercase"
        :style="pm === name
          ? { background: 'var(--st-verm)', color: 'var(--st-soot)' }
          : { color: 'var(--st-faint)' }"
        @click="pm = name"
      >
        {{ name }}
      </button>
    </div>
    <button
      type="button"
      class="st-invert-verm block w-full border px-5 py-4 text-left"
      :style="{ borderColor: 'var(--st-verm)' }"
      :aria-label="`Copy install command: ${command}`"
      @click="copy"
    >
      <span
        class="st-mono-label block"
        style="color: var(--st-verm)"
      >{{ copied ? 'copied to clipboard' : 'install · click to copy' }}</span>
      <code
        class="st-mono mt-1 block !text-[0.9rem]"
        style="color: var(--st-light); letter-spacing: 0"
      >$ {{ command }}</code>
    </button>
  </div>
</template>
