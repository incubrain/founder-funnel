<script setup lang="ts">
// Station override: the masthead strip IS the site header — the instrument is
// the top chrome. Replaces the layer's generic UHeader on this one-page site.
import type { Ref } from 'vue'

interface HeaderConfig {
  socials?: Record<string, string>
  navigation?: { label: string, to: string }[]
}

const headerData = inject<Ref<HeaderConfig>>('navigation_header')
const nav = computed(() => headerData?.value?.navigation ?? [])
const socials = computed(() => headerData?.value?.socials ?? {})

const { trackEvent } = useEvents()
function onSocial(name: string) {
  trackEvent({ id: `offer_click_social_header_${name}`, type: 'offer_click', target: 'social_external' })
}

const utc = useState('station-utc', () => new Date().toISOString().slice(0, 19).replace('T', ' '))
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => {
    utc.value = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b st-rule"
    style="background: var(--st-soot)"
  >
    <div class="flex flex-wrap items-center justify-between gap-x-5 gap-y-1 px-5 py-2.5 sm:px-8">
      <NuxtLink
        to="/"
        class="st-mono-label whitespace-nowrap !text-[0.62rem] sm:!text-[0.7rem]"
        style="color: var(--st-light)"
      >
        FOUNDRY · SIGNAL STATION №1
      </NuxtLink>

      <nav
        v-if="nav.length"
        aria-label="Sections"
        class="hidden items-center gap-1 md:flex"
      >
        <a
          v-for="item in nav"
          :key="item.to"
          :href="item.to"
          class="st-invert st-mono px-2 py-1 !text-[0.66rem] !tracking-[0.1em] uppercase"
          style="color: var(--st-dim)"
        >{{ item.label }}</a>
      </nav>

      <p class="st-mono flex items-center gap-3 whitespace-nowrap !text-[0.66rem]">
        <a
          v-if="socials.x"
          :href="socials.x"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          class="st-invert px-1"
          style="color: var(--st-dim)"
          @click="onSocial('x')"
        ><UIcon
          name="i-simple-icons-x"
          class="size-3.5 align-middle"
        /></a>
        <a
          v-if="socials.github"
          :href="socials.github"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="st-invert px-1"
          style="color: var(--st-dim)"
          @click="onSocial('github')"
        ><UIcon
          name="i-simple-icons-github"
          class="size-3.5 align-middle"
        /></a>
        <span class="flex items-center gap-2">
          <span
            class="st-rec-lamp inline-block h-2 w-2 rounded-full"
            style="background: var(--st-verm)"
            aria-hidden="true"
          />
          <span class="sr-only">recording,</span>
          <time :datetime="utc.replace(' ', 'T') + 'Z'">{{ utc }} UTC</time>
        </span>
      </p>
    </div>
  </header>
</template>
