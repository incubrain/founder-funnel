<script setup lang="ts">
interface Entry {
  date: string
  entry: string
  status: 'RECORDED' | 'REPORTED' | 'OPEN'
}

defineProps<{
  plate: string
  title: string
  quote: { text: string, source: string }
  entries: Entry[]
  note: string
}>()

const { el } = useSectionSignal('ledger')
</script>

<template>
  <section
    id="ledger"
    ref="el"
    aria-labelledby="ledger-title"
    class="relative z-10 border-b st-rule"
  >
    <div class="grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-12 md:py-20">
      <div class="st-plate-tick md:col-span-5">
        <p class="st-mono-label">
          {{ plate }}
        </p>
        <h2
          id="ledger-title"
          class="st-display mt-3 text-[clamp(1.9rem,4vw,3.2rem)] text-balance"
        >
          {{ title }}
        </h2>
        <blockquote
          class="m-0 mt-6 border-l pl-4"
          style="border-color: var(--st-verm)"
        >
          <p
            class="text-lg leading-relaxed"
            style="color: var(--st-light)"
          >
            “{{ quote.text }}”
          </p>
          <cite class="st-mono mt-2 block not-italic">— {{ quote.source }}</cite>
        </blockquote>
        <p
          class="st-mono mt-6 max-w-[52ch] !text-[0.78rem] leading-relaxed"
          style="letter-spacing: 0.02em"
        >
          {{ note }}
        </p>
      </div>

      <div class="md:col-span-7">
        <table class="st-table-stack w-full border-collapse">
          <caption class="sr-only">
            Station log: what is recorded fact and what remains open
          </caption>
          <tbody>
            <tr
              v-for="e in entries"
              :key="e.entry"
              class="border-t st-rule align-baseline"
            >
              <td
                class="st-mono w-28 py-3.5 pr-4 !text-[0.72rem] whitespace-nowrap"
                style="color: var(--st-grat-label)"
              >
                {{ e.date }}
              </td>
              <td
                class="py-3.5 pr-6 text-sm leading-relaxed"
                style="color: var(--st-light)"
              >
                {{ e.entry }}
              </td>
              <td class="w-28 py-3.5 text-right">
                <span
                  class="st-mono !text-[0.62rem] !tracking-[0.14em]"
                  :style="{ color: e.status === 'OPEN' ? 'var(--st-verm)' : 'var(--st-grat-label)' }"
                >{{ e.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
