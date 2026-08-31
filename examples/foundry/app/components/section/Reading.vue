<script setup lang="ts">
interface Stat {
  value: string
  claim: string
  source: { label: string, href: string }
}

defineProps<{
  plate: string
  title: string
  body: string
  stats: Stat[]
}>()

const { el } = useSectionSignal('reading')

// FIG. 1 — crossover chart geometry (drawn, not decorative)
const W = 720
const H = 300
</script>

<template>
  <section
    id="reading"
    ref="el"
    aria-labelledby="reading-title"
    class="relative z-10 border-b st-rule"
  >
    <div class="grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-12 md:py-20">
      <div class="st-plate-tick md:col-span-5">
        <p class="st-mono-label">
          {{ plate }}
        </p>
        <h2
          id="reading-title"
          class="st-display mt-3 text-[clamp(1.9rem,4vw,3.2rem)] text-balance"
        >
          {{ title }}
        </h2>
        <p
          class="mt-5 max-w-[58ch] leading-relaxed"
          style="color: var(--st-dim)"
        >
          {{ body }}
        </p>
        <ul class="mt-8 m-0 list-none space-y-5 p-0">
          <li
            v-for="s in stats"
            :key="s.value"
            class="border-l pl-4"
            style="border-color: var(--st-verm)"
          >
            <p
              class="st-display text-3xl"
              style="color: var(--st-light)"
            >
              {{ s.value }}
            </p>
            <p
              class="mt-1 max-w-[52ch] text-sm leading-relaxed"
              style="color: var(--st-dim)"
            >
              {{ s.claim }}
              <a
                :href="s.source.href"
                target="_blank"
                rel="noopener noreferrer"
                class="st-mono underline"
                style="color: var(--st-grat-label)"
              >[{{ s.source.label }}]</a>
            </p>
          </li>
        </ul>
      </div>

      <figure class="m-0 md:col-span-7">
        <svg
          :viewBox="`0 0 ${W} ${H}`"
          class="w-full border st-rule"
          role="img"
          aria-label="Chart: share of network traffic. The agent trace crosses above the human trace in May 2026 and continues steeply toward Cloudflare's 1,000-times projection."
        >
          <g
            stroke="var(--st-grat)"
            stroke-width="1"
          >
            <line
              v-for="i in 5"
              :key="'h' + i"
              x1="40"
              :y1="20 + (i - 1) * 55"
              x2="700"
              :y2="20 + (i - 1) * 55"
            />
            <line
              v-for="i in 6"
              :key="'v' + i"
              :x1="40 + (i - 1) * 132"
              y1="20"
              :x2="40 + (i - 1) * 132"
              y2="240"
            />
          </g>
          <!-- axis labels -->
          <g
            fill="var(--st-grat-label)"
            style="font-family: var(--font-mono-station); font-size: 10px; letter-spacing: 0.1em"
          >
            <text
              x="40"
              y="262"
            >2024</text>
            <text
              x="304"
              y="262"
            >MAY 2026</text>
            <text
              x="608"
              y="262"
            >2031 →</text>
            <text
              x="40"
              y="14"
            >SHARE OF NETWORK TRAFFIC (LOG)</text>
          </g>
          <!-- human trace: steady -->
          <path
            d="M 40 150 C 160 148, 280 152, 372 150 C 480 148, 600 150, 700 149"
            fill="none"
            stroke="var(--st-light)"
            stroke-width="1.6"
          />
          <text
            x="652"
            y="140"
            fill="var(--st-light)"
            style="font-family: var(--font-mono-station); font-size: 10px; letter-spacing: 0.1em"
          >HUMAN</text>
          <!-- agent trace: recorded rise, then dashed projection -->
          <path
            d="M 40 232 C 140 228, 240 205, 372 150"
            fill="none"
            stroke="var(--st-verm)"
            stroke-width="2"
          />
          <path
            d="M 372 150 C 480 100, 580 60, 700 30"
            fill="none"
            stroke="var(--st-verm)"
            stroke-width="2"
            stroke-dasharray="6 6"
          />
          <text
            x="580"
            y="52"
            fill="var(--st-verm)"
            style="font-family: var(--font-mono-station); font-size: 10px; letter-spacing: 0.1em"
          >AGENT (PROJECTED)</text>
          <!-- crossover mark -->
          <circle
            cx="372"
            cy="150"
            r="5"
            fill="var(--st-verm)"
          />
          <line
            x1="372"
            y1="150"
            x2="372"
            y2="240"
            stroke="var(--st-verm)"
            stroke-width="1"
            stroke-dasharray="3 5"
          />
        </svg>
        <figcaption class="st-mono mt-2">
          FIG. 1 — Recorded left of the mark; projected right, dashed. Source: Cloudflare Q2 2026 earnings call.
        </figcaption>
      </figure>
    </div>
  </section>
</template>
