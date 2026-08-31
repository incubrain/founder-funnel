<script setup lang="ts">
defineProps<{
  headline: string
  install: string
  github: string
  agents: { path: string, note: string }[]
  colophon: string
}>()

const { el } = useSectionSignal('tag')
const { trackEvent } = useEvents()

const copied = ref(false)
async function copyInstall(cmd: string) {
  trackEvent({ id: 'offer_click_service_close_install', type: 'offer_click', target: 'service_internal' })
  try {
    await navigator.clipboard.writeText(cmd)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  catch { /* command stays selectable */ }
}
function onGithub() {
  trackEvent({ id: 'offer_click_service_close_github', type: 'offer_click', target: 'service_external' })
}
</script>

<template>
  <section
    ref="el"
    aria-labelledby="tag-headline"
    class="relative z-10"
  >
    <div class="px-5 py-16 sm:px-8 md:py-24">
      <h2
        id="tag-headline"
        class="st-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.6rem)] text-balance"
      >
        {{ headline }}
      </h2>

      <div class="mt-10 flex flex-col gap-3 md:flex-row md:items-stretch">
        <button
          type="button"
          class="st-invert-verm border px-6 py-5 text-left md:min-w-96"
          :style="{ borderColor: 'var(--st-verm)' }"
          :aria-label="`Copy install command: ${install}`"
          @click="copyInstall(install)"
        >
          <span
            class="st-mono-label block"
            style="color: var(--st-verm)"
          >{{ copied ? 'copied to clipboard' : 'install · click to copy' }}</span>
          <code
            class="st-mono mt-1 block !text-[1rem]"
            style="color: inherit; letter-spacing: 0"
          >$ {{ install }}</code>
        </button>
        <a
          :href="github"
          target="_blank"
          rel="noopener noreferrer"
          class="st-invert flex items-center border px-6 py-5"
          :style="{ borderColor: 'var(--st-grat)' }"
          @click="onGithub"
        >
          <span
            class="st-mono !text-[0.85rem]"
            style="color: inherit"
          >read the source → github.com/incubrain/foundry</span>
        </a>
      </div>

      <div class="mt-12 border st-rule p-5">
        <p
          class="st-mono-label"
          style="color: var(--st-verm)"
        >
          for agents reading this page
        </p>
        <ul class="m-0 mt-3 grid list-none gap-x-8 gap-y-2 p-0 sm:grid-cols-2">
          <li
            v-for="a in agents"
            :key="a.path"
            class="flex items-baseline gap-3"
          >
            <a
              :href="a.path"
              class="st-mono !text-[0.78rem] underline"
              style="color: var(--st-light); letter-spacing: 0"
            >{{ a.path }}</a>
            <span class="st-mono !text-[0.68rem]">{{ a.note }}</span>
          </li>
        </ul>
      </div>

      <p class="st-mono mt-12 border-t st-rule pt-5 !text-[0.7rem]">
        {{ colophon }}
      </p>
    </div>
  </section>
</template>
