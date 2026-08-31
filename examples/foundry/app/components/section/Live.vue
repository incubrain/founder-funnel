<script setup lang="ts">
defineProps<{
  plate: string
  title: string
  body: string
  capacity?: number
}>()

const { el } = useSectionSignal('live')

interface TailRow {
  key: number
  time: string
  type: string
  detail: string
}

// Live tail of this page's own emissions: every trackEvent() call fires the
// layer's `events:track` hook before the row is queued for
// POST /api/_signals/ingest — we mirror it here, ring-buffer style.
const rows = ref<TailRow[]>([])
const evicted = ref(0)
let key = 0

const nuxtApp = useNuxtApp()
nuxtApp.hook('events:track', (payload: { id?: string, type?: string, target?: string }) => {
  const cap = 8
  rows.value.unshift({
    key: key++,
    time: new Date().toISOString().slice(11, 23),
    type: payload.type ?? 'event',
    detail: payload.target ?? payload.id ?? '',
  })
  if (rows.value.length > cap) {
    rows.value.length = cap
    evicted.value++
  }
})
</script>

<template>
  <section
    id="live"
    ref="el"
    aria-labelledby="live-title"
    class="relative z-10 border-b st-rule"
  >
    <div class="grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-12 md:py-20">
      <div class="st-plate-tick md:col-span-4">
        <p class="st-mono-label">
          {{ plate }}
        </p>
        <h2
          id="live-title"
          class="st-display mt-3 text-[clamp(1.9rem,4vw,3.2rem)] text-balance"
        >
          {{ title }}
        </h2>
        <p
          class="mt-5 max-w-[52ch] leading-relaxed"
          style="color: var(--st-dim)"
        >
          {{ body }}
        </p>
      </div>

      <figure
        class="m-0 md:col-span-8"
        aria-label="Live tail of the signal rows this page is emitting during your visit"
      >
        <div class="border st-rule">
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b st-rule px-4 py-2.5">
            <p
              class="st-mono-label"
              style="color: var(--st-verm)"
            >
              live tail — POST /api/_signals/ingest
            </p>
            <p class="st-mono !text-[0.64rem]">
              ring buffer · capacity 8 · {{ evicted }} evicted
            </p>
          </div>
          <ol
            class="m-0 list-none p-0"
            aria-live="polite"
            aria-relevant="additions"
          >
            <li
              v-if="!rows.length"
              class="st-mono px-4 py-6 !text-[0.78rem]"
            >
              — stylus down. scroll or click: your first row lands here —
            </li>
            <li
              v-for="(row, i) in rows"
              :key="row.key"
              class="st-tail-row flex flex-wrap items-baseline gap-x-5 border-t st-rule px-4 py-2.5"
              :style="{ opacity: 1 - i * 0.09 }"
            >
              <time
                class="st-mono !text-[0.72rem]"
                style="color: var(--st-grat-label); letter-spacing: 0"
              >{{ row.time }}</time>
              <span
                class="st-mono w-28 !text-[0.72rem] !tracking-[0.08em] uppercase"
                :style="{ color: row.type === 'offer_click' ? 'var(--st-verm)' : 'var(--st-light)' }"
              >{{ row.type }}</span>
              <code
                class="st-mono !text-[0.72rem]"
                style="color: var(--st-dim); letter-spacing: 0"
              >{{ row.detail }}</code>
            </li>
          </ol>
        </div>
        <figcaption class="st-mono mt-2">
          Your session only — the server stamps each row's visitor class before it hits the drum.
        </figcaption>
      </figure>
    </div>
  </section>
</template>
