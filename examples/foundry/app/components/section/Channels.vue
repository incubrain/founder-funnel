<script setup lang="ts">
interface Channel {
  ch: string
  name: string
  detail: string
}

defineProps<{
  plate: string
  title: string
  body: string
  channels: Channel[]
  endpoints: { path: string, note: string }[]
}>()

const { el } = useSectionSignal('channels')
</script>

<template>
  <section
    ref="el"
    aria-labelledby="channels-title"
    class="relative z-10 border-b st-rule"
  >
    <div class="grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-12 md:py-20">
      <div class="st-plate-tick md:col-span-4">
        <p class="st-mono-label">
          {{ plate }}
        </p>
        <h2
          id="channels-title"
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

      <div class="md:col-span-8">
        <table class="st-table-stack w-full border-collapse">
          <caption class="sr-only">
            Signal channels recorded by the instrument
          </caption>
          <tbody>
            <tr
              v-for="c in channels"
              :key="c.ch"
              class="border-t st-rule align-top"
            >
              <th
                scope="row"
                class="st-mono w-20 py-4 pr-4 text-left !text-[0.8rem]"
                style="color: var(--st-verm)"
              >
                {{ c.ch }}
              </th>
              <td class="st-display py-4 pr-6 text-xl whitespace-nowrap">
                {{ c.name }}
              </td>
              <td
                class="py-4 text-sm leading-relaxed"
                style="color: var(--st-dim)"
              >
                {{ c.detail }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-8 border st-rule p-5">
          <p class="st-mono-label">
            exposed surfaces — every one machine-readable
          </p>
          <ul class="m-0 mt-3 grid list-none gap-x-8 gap-y-2 p-0 sm:grid-cols-2">
            <li
              v-for="e in endpoints"
              :key="e.path"
              class="flex items-baseline gap-3"
            >
              <code
                class="st-mono !text-[0.78rem]"
                style="color: var(--st-light); letter-spacing: 0"
              >{{ e.path }}</code>
              <span class="st-mono !text-[0.68rem]">{{ e.note }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
