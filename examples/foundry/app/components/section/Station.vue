<script setup lang="ts">
import type { TraceEvent } from '../../utils/trace'
import { buildTracePath } from '../../utils/trace'

const props = defineProps<{
  headline: string
  sub: string
  install: string
  github: string
  events: TraceEvent[]
}>()

const { el } = useSectionSignal('station')
const { trackEvent } = useEvents()

const W = 1600
const H = 340
const tracePath = computed(() => buildTracePath(props.events, W, H))

const copied = ref(false)
async function copyInstall() {
  trackEvent({ id: 'offer_click_service_hero_install', type: 'offer_click', target: 'service_internal' })
  try {
    await navigator.clipboard.writeText(props.install)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  catch { /* clipboard unavailable — the command is selectable text */ }
}
function onGithub() {
  trackEvent({ id: 'offer_click_service_hero_github', type: 'offer_click', target: 'service_external' })
}
</script>

<template>
  <section
    ref="el"
    aria-labelledby="station-headline"
    class="relative z-10 border-b st-rule"
  >
    <!-- The drum: full-bleed live trace of real station events -->
    <figure
      class="st-drum relative m-0 border-b st-rule"
      role="img"
      aria-label="Seismogram of real station events: each spike is a recorded event on this project"
    >
      <svg
        :viewBox="`0 0 ${W} ${H}`"
        class="block h-[38vh] min-h-[240px] w-full sm:h-[44vh]"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <!-- graticule -->
        <g
          stroke="var(--st-grat)"
          stroke-width="1"
        >
          <line
            v-for="i in 7"
            :key="'h' + i"
            x1="0"
            :y1="(i * H) / 8"
            :x2="W"
            :y2="(i * H) / 8"
          />
          <line
            v-for="i in 15"
            :key="'v' + i"
            :x1="(i * W) / 16"
            y1="0"
            :x2="(i * W) / 16"
            :y2="H"
          />
        </g>
        <!-- event ink marks -->
        <g
          v-for="ev in events"
          :key="ev.label"
        >
          <line
            :x1="ev.at * W"
            y1="0"
            :x2="ev.at * W"
            :y2="H"
            stroke="var(--st-verm)"
            stroke-width="1.5"
            stroke-dasharray="3 5"
            opacity="0.8"
          />
        </g>
        <!-- the scratch: a faint halo under the stroke reads as light
             breaking through soot, not a uniform vector line -->
        <path
          :d="tracePath"
          fill="none"
          stroke="var(--st-light)"
          stroke-width="3.4"
          opacity="0.28"
          style="filter: blur(2.2px)"
        />
        <path
          :d="tracePath"
          fill="none"
          stroke="var(--st-light)"
          stroke-width="1.6"
          class="st-trace-animate"
          style="--trace-len: 6200"
        />
      </svg>
      <!-- event labels: real happenings, readable without CSS or JS -->
      <ul class="absolute inset-x-0 top-2 m-0 hidden list-none p-0 md:block">
        <li
          v-for="ev in events"
          :key="ev.label"
          class="st-invert-verm absolute max-w-40 -translate-x-1/2 border px-1.5 py-1 text-center"
          :style="{ left: `${ev.at * 100}%`, borderColor: 'var(--st-grat)', background: 'var(--st-soot)' }"
        >
          <span
            class="st-mono-label block !text-[0.58rem]"
            style="color: var(--st-verm)"
          >{{ ev.date }}</span>
          <span
            class="st-mono block !text-[0.62rem]"
            style="color: var(--st-light)"
          >{{ ev.label }}</span>
        </li>
      </ul>
      <!-- Mobile event ticker: the labels the drum can't fit -->
      <ul class="m-0 flex list-none gap-5 overflow-x-auto border-t st-rule px-5 py-2 md:hidden">
        <li
          v-for="ev in events"
          :key="ev.label"
          class="st-mono shrink-0 whitespace-nowrap !text-[0.62rem]"
        >
          <span style="color: var(--st-verm)">{{ ev.date }}</span>
          <span
            class="pl-1.5"
            style="color: var(--st-light)"
          >{{ ev.label }}</span>
        </li>
      </ul>
    </figure>

    <!-- Reading + action -->
    <div class="grid gap-10 px-5 py-12 sm:px-8 md:grid-cols-12 md:py-16">
      <div class="md:col-span-7">
        <h1
          id="station-headline"
          class="st-display text-[clamp(2.6rem,7vw,5.6rem)] text-balance"
        >
          {{ headline }}
        </h1>
        <p
          class="mt-6 max-w-[62ch] text-lg leading-relaxed"
          style="color: var(--st-dim)"
        >
          {{ sub }}
        </p>
      </div>
      <div class="flex flex-col justify-end gap-3 md:col-span-5 md:items-end">
        <button
          type="button"
          class="st-invert-verm group w-full border px-5 py-4 text-left md:max-w-md"
          :style="{ borderColor: 'var(--st-light)' }"
          :aria-label="`Copy install command: ${install}`"
          @click="copyInstall"
        >
          <span
            class="st-mono-label block"
            style="color: var(--st-verm)"
          >{{ copied ? 'copied to clipboard' : 'install · click to copy' }}</span>
          <code
            class="st-mono mt-1 block !text-[0.9rem]"
            style="color: inherit; letter-spacing: 0"
          >$ {{ install }}</code>
        </button>
        <a
          :href="github"
          target="_blank"
          rel="noopener noreferrer"
          class="st-invert block w-full border px-5 py-3 md:max-w-md"
          :style="{ borderColor: 'var(--st-grat)' }"
          @click="onGithub"
        >
          <span
            class="st-mono !text-[0.8rem]"
            style="color: inherit"
          >github.com/incubrain/foundry → MIT · open source</span>
        </a>
      </div>
    </div>
  </section>
</template>
