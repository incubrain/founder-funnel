<script setup lang="ts">
const props = defineProps<{
  title?: string
  description?: string
  samples?: Array<{
    id: string
    label: string
    era: string
    images: string[]
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
      <!-- Document type selector — TOP -->
      <div class="mb-6 flex flex-wrap items-center justify-center gap-2">
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

      <!-- Split panel viewer — FIXED HEIGHT -->
      <div class="grid grid-cols-1 md:grid-cols-2 border border-default rounded-2xl overflow-hidden bg-default shadow-lg">
        <!-- Left: Document images -->
        <div class="flex flex-col h-[480px] md:h-[640px] border-b md:border-b-0 md:border-r border-default">
          <header class="h-14 px-6 flex items-center border-b border-default bg-muted/30 shrink-0">
            <div>
              <h3 class="text-sm font-heading font-semibold text-highlighted leading-tight">
                {{ activeSample?.label }}
              </h3>
              <small class="text-[11px] text-dimmed leading-tight">{{ activeSample?.era }}</small>
            </div>
          </header>
          <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
            <div
              v-for="(img, imgIdx) in activeSample?.images"
              :key="imgIdx"
              class="max-w-[380px] mx-auto rounded-xl overflow-hidden shadow-xl border border-default"
            >
              <NuxtImg
                :src="img"
                :alt="`${activeSample?.label} — page ${imgIdx + 1}`"
                class="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <!-- Right: Output -->
        <div class="flex flex-col h-[480px] md:h-[640px]">
          <header class="h-14 px-6 flex items-center justify-center border-b border-default bg-muted/30 shrink-0">
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
                department: activeSample?.label?.split(' (')[0],
                era: activeSample?.era?.split(' — ')[0],
                type: activeSample?.era?.split(' — ')[1],
                pages: activeSample?.images?.length || 1,
                status: 'verified',
              }, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
