<script setup lang="ts">
const props = defineProps<{
  title?: string
  description?: string
  samples?: Array<{
    id: string
    label: string
    era: string
    image: string
    text: string
  }>
}>()

const activeIndex = ref(0)
const activeTab = ref<'ocr' | 'structured'>('ocr')
const activeSample = computed(() => props.samples?.[activeIndex.value])
</script>

<template>
  <SectionWrapper
    section-id="document-showcase"
    :title="title"
    :description="description"
  >
    <div class="mt-10 sm:mt-14 max-w-5xl mx-auto">
      <!-- Split panel viewer -->
      <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-default border border-default rounded-2xl overflow-hidden bg-default shadow-lg">
        <!-- Left: Document image -->
        <div class="flex flex-col h-[500px] md:h-[680px]">
          <header class="px-6 py-4 border-b border-default bg-muted/30">
            <h3 class="text-sm font-heading font-semibold text-highlighted">
              {{ activeSample?.label }}
            </h3>
            <small class="text-xs text-dimmed">{{ activeSample?.era }}</small>
          </header>
          <div class="flex-1 overflow-y-auto p-6 flex items-start justify-center bg-muted/10">
            <div class="max-w-[380px] rounded-xl overflow-hidden shadow-xl border border-default">
              <NuxtImg
                v-if="activeSample?.image"
                :src="activeSample.image"
                :alt="activeSample.label"
                class="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <!-- Right: Output -->
        <div class="flex flex-col h-[500px] md:h-[680px]">
          <header class="px-6 py-4 border-b border-default bg-muted/30 flex items-center justify-center">
            <nav class="flex gap-1 bg-muted rounded-lg p-1">
              <button
                class="px-4 py-1.5 text-xs font-medium rounded-md transition-colors"
                :class="activeTab === 'ocr' ? 'bg-primary text-inverted' : 'text-dimmed hover:text-highlighted'"
                @click="activeTab = 'ocr'"
              >
                OCR Output
              </button>
              <button
                class="px-4 py-1.5 text-xs font-medium rounded-md transition-colors"
                :class="activeTab === 'structured' ? 'bg-primary text-inverted' : 'text-dimmed hover:text-highlighted'"
                @click="activeTab = 'structured'"
              >
                Structured
              </button>
            </nav>
          </header>
          <div class="flex-1 overflow-y-auto p-6">
            <div
              v-if="activeTab === 'ocr'"
              class="font-mono text-sm leading-loose text-highlighted whitespace-pre-wrap"
            >
              {{ activeSample?.text }}
            </div>
            <div
              v-else
              class="font-mono text-xs leading-relaxed text-dimmed"
            >
              <pre class="whitespace-pre-wrap">{{ JSON.stringify({
                department: 'कृषी विभाग',
                date: '१५/०३/२०२४',
                reference: 'संकीर्ण-२०२४/प्र.क्र.१२३',
                subject: activeSample?.label,
                type: activeSample?.era,
                pages: 1,
                status: 'verified',
              }, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Document type selector tabs -->
      <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          v-for="(sample, i) in samples"
          :key="sample.id"
          class="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors"
          :class="activeIndex === i
            ? 'bg-primary text-inverted'
            : 'bg-muted/50 text-dimmed hover:text-highlighted hover:bg-muted'"
          @click="activeIndex = i"
        >
          {{ sample.label }}
        </button>
      </div>
    </div>
  </SectionWrapper>
</template>
