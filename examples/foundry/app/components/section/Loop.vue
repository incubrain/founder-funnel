<script setup lang="ts">
interface Step {
  n: string
  name: string
  detail: string
  code?: string
}

defineProps<{
  plate: string
  title: string
  steps: Step[]
}>()

const { el } = useSectionSignal('loop')
</script>

<template>
  <section
    id="loop"
    ref="el"
    aria-labelledby="loop-title"
    class="relative z-10 border-b st-rule"
  >
    <div class="px-5 py-14 sm:px-8 md:py-20">
      <div class="st-plate-tick">
        <p class="st-mono-label">
          {{ plate }}
        </p>
        <h2
          id="loop-title"
          class="st-display mt-3 text-[clamp(1.9rem,4vw,3.2rem)]"
        >
          {{ title }}
        </h2>
      </div>

      <ol
        class="m-0 mt-10 grid list-none gap-px border st-rule p-0 md:grid-cols-3"
        style="background: var(--st-grat)"
      >
        <li
          v-for="step in steps"
          :key="step.n"
          class="relative flex min-h-64 flex-col justify-between p-6"
          style="background: var(--st-soot)"
        >
          <div class="flex items-start justify-between gap-4">
            <span
              class="st-display text-[clamp(3.4rem,6vw,5rem)]"
              style="color: var(--st-verm)"
              aria-hidden="true"
            >{{ step.n }}</span>
            <!-- step diagrams, drawn in the station's line grammar -->
            <svg
              viewBox="0 0 96 96"
              class="h-20 w-20 shrink-0"
              aria-hidden="true"
              fill="none"
              stroke-width="1.6"
            >
              <g
                v-if="step.n === '01'"
                stroke="var(--st-light)"
              >
                <rect
                  x="26"
                  y="30"
                  width="44"
                  height="36"
                  stroke="var(--st-dim)"
                />
                <path
                  d="M 18 22 L 8 22 L 8 74 L 18 74"
                  stroke="var(--st-verm)"
                  stroke-width="2.2"
                />
                <path
                  d="M 78 22 L 88 22 L 88 74 L 78 74"
                  stroke="var(--st-verm)"
                  stroke-width="2.2"
                />
                <line
                  x1="32"
                  y1="42"
                  x2="64"
                  y2="42"
                />
                <line
                  x1="32"
                  y1="50"
                  x2="56"
                  y2="50"
                  stroke="var(--st-dim)"
                />
                <line
                  x1="32"
                  y1="58"
                  x2="60"
                  y2="58"
                  stroke="var(--st-dim)"
                />
              </g>
              <g
                v-else-if="step.n === '02'"
                stroke="var(--st-light)"
              >
                <path
                  d="M 10 48 L 26 48 L 32 34 L 40 62 L 48 30 L 56 60 L 62 48 L 86 48"
                  stroke="var(--st-light)"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="34"
                  stroke="var(--st-grat-label)"
                  stroke-dasharray="4 6"
                />
                <circle
                  cx="86"
                  cy="48"
                  r="3"
                  fill="var(--st-verm)"
                  stroke="none"
                />
              </g>
              <g
                v-else
                stroke="var(--st-light)"
              >
                <path
                  d="M 20 66 L 44 66 L 44 30"
                  stroke="var(--st-dim)"
                />
                <path
                  d="M 36 40 L 44 28 L 52 40"
                  stroke="var(--st-verm)"
                  stroke-width="2.2"
                />
                <path
                  d="M 60 54 L 76 70 M 76 54 L 60 70"
                  stroke="var(--st-verm)"
                  stroke-width="2.2"
                />
              </g>
            </svg>
          </div>
          <div class="mt-6">
            <h3 class="st-display text-2xl">
              {{ step.name }}
            </h3>
            <p
              class="mt-2 max-w-[46ch] text-sm leading-relaxed"
              style="color: var(--st-dim)"
            >
              {{ step.detail }}
            </p>
            <code
              v-if="step.code"
              class="st-mono mt-3 block !text-[0.72rem]"
              style="color: var(--st-grat-label); letter-spacing: 0"
            >{{ step.code }}</code>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
