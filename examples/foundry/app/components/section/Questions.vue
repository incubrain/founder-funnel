<script setup lang="ts">
// Native <details> so every answer is in the SSR markup — readable by
// crawlers that run zero JavaScript. Items come from the faq collection.
defineProps<{
  plate: string
  title: string
  types?: string[]
}>()

const { el } = useSectionSignal('questions')

const { data: faqs } = await useAsyncData('station-faq', () => queryCollection('faq').all())

// First open of each answer is a signal row too — which questions get read
// is exactly the kind of demand evidence the instrument exists to collect.
const { trackEvent } = useEvents()
const opened = new Set<string>()
function onToggle(e: Event, label: string) {
  if (!(e.target as HTMLDetailsElement).open || opened.has(label)) return
  opened.add(label)
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  trackEvent({ id: `section_view_faq_${slug}`, type: 'section_view', target: `faq:${slug}` })
}
</script>

<template>
  <section
    ref="el"
    aria-labelledby="questions-title"
    class="relative z-10 border-b st-rule"
  >
    <div class="grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-12 md:py-20">
      <div class="st-plate-tick md:col-span-4">
        <p class="st-mono-label">
          {{ plate }}
        </p>
        <h2
          id="questions-title"
          class="st-display mt-3 text-[clamp(1.9rem,4vw,3.2rem)]"
        >
          {{ title }}
        </h2>
      </div>
      <div class="md:col-span-8">
        <template
          v-for="group in (faqs ?? [])"
          :key="group.label"
        >
          <details
            v-for="item in group.items"
            :key="item.label"
            class="st-details border-t st-rule"
            @toggle="onToggle($event, item.label)"
          >
            <summary class="flex items-baseline justify-between gap-4 px-3 py-4">
              <span class="st-display text-lg">{{ item.label }}</span>
              <span
                class="st-mono st-details-mark !text-[1rem]"
                aria-hidden="true"
              />
            </summary>
            <p
              class="max-w-[70ch] px-3 pb-6 text-sm leading-relaxed"
              style="color: var(--st-dim)"
            >
              {{ item.content }}
            </p>
          </details>
        </template>
      </div>
    </div>
  </section>
</template>
