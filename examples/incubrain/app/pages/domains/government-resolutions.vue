<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Government Resolutions — Incubrain',
  meta: [{ name: 'description', content: 'Digitizing Maharashtra\'s 200,000+ Government Resolutions through AI-powered OCR with human-verified quality control.' }],
})

useScrollReveal()

const { y: scrollY } = useWindowScroll()

const activeDocIndex = ref(0)
const activeTab = ref<'ocr' | 'structured'>('ocr')

const documents = [
  {
    id: 'agriculture-2024',
    label: 'Agriculture (2024)',
    era: 'Post-2015 — Native Unicode',
    images: [
      'https://placehold.co/400x560/f5f5f4/78716c?text=कृषी+विभाग+Page+1',
      'https://placehold.co/400x560/f5f5f4/78716c?text=कृषी+विभाग+Page+2',
    ],
    text: 'महाराष्ट्र शासन निर्णय\nकृषी, पशुसंवर्धन, दुग्ध व्यवसाय विकास व मत्स्यव्यवसाय विभाग\n\nक्रमांक: संकीर्ण-२०२४/प्र.क्र.१२३/२४\nदिनांक: १५ मार्च २०२४\n\nविषय: कृषी विभागाच्या योजनांचे अंमलबजावणी\nमार्गदर्शक तत्त्वे सुधारित करण्याबाबत.',
  },
  {
    id: 'revenue-2010',
    label: 'Revenue (2010)',
    era: '2005-2015 — Legacy font (Shree Dev)',
    images: [
      'https://placehold.co/400x560/f5f5f4/78716c?text=महसूल+विभाग+Page+1',
      'https://placehold.co/400x560/f5f5f4/78716c?text=महसूल+विभाग+Page+2',
      'https://placehold.co/400x560/f5f5f4/78716c?text=महसूल+विभाग+Page+3',
    ],
    text: 'महाराष्ट्र शासन\nमहसूल व वन विभाग\n\nशासन निर्णय क्रमांक: जमीन-२०१०/प्र.क्र.४५/ज-१\nदिनांक: २२ जुलै २०१०\n\nविषय: जमीन महसूल अधिनियमांतर्गत\nसुधारणा करण्याबाबत.',
  },
  {
    id: 'education-1998',
    label: 'Education (1998)',
    era: 'Pre-2010 — Scanned paper',
    images: ['https://placehold.co/400x560/f5f5f4/78716c?text=शिक्षण+विभाग+Page+1'],
    text: 'महाराष्ट्र शासन\nशालेय शिक्षण व क्रीडा विभाग\n\nशासन निर्णय क्रमांक: शिक्षण-९८/प्र.क्र.७८/९८\nदिनांक: ०५ ऑगस्ट १९९८\n\nविषय: प्राथमिक शिक्षणाच्या सार्वत्रिकीकरणाबाबत\nराज्यस्तरीय धोरण निश्चित करणे.',
  },
  {
    id: 'urban-2012',
    label: 'Urban Dev (2012)',
    era: 'Mixed — Unicode headers, legacy body',
    images: [
      'https://placehold.co/400x560/f5f5f4/78716c?text=नगर+विकास+Page+1',
      'https://placehold.co/400x560/f5f5f4/78716c?text=नगर+विकास+Page+2',
    ],
    text: 'महाराष्ट्र शासन\nनगर विकास विभाग\n\nशासन निर्णय क्रमांक: नवि-२०१२/प्र.क्र.२३४/नवि-३३\nदिनांक: १८ नोव्हेंबर २०१२\n\nविषय: महानगरपालिका क्षेत्रातील\nविकास नियंत्रण नियमावलीत सुधारणा.',
  },
]

const activeDoc = computed(() => documents[activeDocIndex.value])

const problems = [
  { title: 'Pre-2010: Scanned paper', text: 'The bulk of the historical archive exists only as scanned images. Full OCR required. Generic tools produce 8-17% error rates on Marathi.' },
  { title: '2005-2015: Legacy font trap', text: 'PDFs look like Devanagari but use proprietary ASCII mappings — Shree Dev, Kruti Dev, Shusha. Text extraction produces garbled output.' },
  { title: 'Post-2015: Digital but inaccessible', text: 'Natively typed in Unicode, text is extractable — but no GR is searchable, indexed, or cross-referenced.' },
  { title: 'Mixed encoding everywhere', text: 'Single PDFs contain Unicode headers, legacy-font bodies, and image-based tables. No clean cutoff exists.' },
]

const pipeline = [
  { step: '01', title: 'Ingest', text: 'GR documents retrieved from state repositories. Pipeline identifies document type and routes to the appropriate processing path.' },
  { step: '02', title: 'Recognise', text: 'Custom OCR model processes scanned and legacy-encoded documents. Native Unicode extracted directly. All output normalised to standard Devanagari.' },
  { step: '03', title: 'Review', text: 'Four-model consensus committee pre-verifies. Where three agree, text is auto-promoted. The rest goes to trained Marathi-fluent reviewers.' },
  { step: '04', title: 'Publish', text: 'Verified text structured with entity extraction, department tagging, date indexing. Complete corpus becomes a searchable database.' },
]
</script>

<template>
  <div class="bg-default min-h-screen">
    <!-- ══ HERO — Compact, matching homepage style ══ -->
    <section class="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-primary-100/50 to-default dark:from-primary-950/20 dark:to-default" />
      <BgPattern
        name="paithani-classic"
        :opacity="0.5"
        absolute
      />

      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="inline-flex items-center gap-2 rounded-full border border-default bg-muted/50 backdrop-blur-sm px-4 py-1.5 mb-6">
          <span class="size-1.5 rounded-full bg-primary animate-pulse" />
          <span class="text-xs tracking-widest uppercase text-dimmed font-medium">Active Domain</span>
        </div>

        <h1 class="text-3xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tighter leading-[1.05] max-w-4xl">
          200,000 Government Resolutions.
          <span class="text-primary">One unified pipeline.</span>
        </h1>

        <p class="text-base md:text-lg text-muted leading-relaxed max-w-[55ch] mt-6 text-pretty">
          Whether scanned on paper, trapped in legacy font encodings, or natively
          digital — all of Maharashtra's GRs currently sit inaccessible.
        </p>

        <div class="flex flex-wrap gap-4 mt-8">
          <UButton
            to="/products/document-review-pipeline"
            label="Review Pipeline"
            icon="i-lucide-workflow"
            trailing
            size="xl"
            color="primary"
          />
          <UButton
            to="/#domains"
            label="All Domains"
            size="xl"
            color="neutral"
            variant="outline"
          />
        </div>
      </div>
    </section>

    <!-- ══ PROBLEM — 2x2 grid matching homepage ══ -->
    <section class="py-24 md:py-32 border-t border-default">
      <div class="max-w-6xl mx-auto px-6">
        <div class="reveal mb-16">
          <p class="text-xs uppercase tracking-widest text-primary font-medium mb-6">
            The challenge
          </p>
          <h2 class="text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-[1.1] max-w-4xl">
            Three eras of documents.
            <span class="text-muted">One pipeline handles them all.</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div
            v-for="(item, i) in problems"
            :key="i"
            class="reveal p-8 md:p-10 border-t border-default"
            :class="i % 2 === 0 ? 'md:border-r' : ''"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <h3 class="text-lg font-heading font-semibold text-highlighted mb-3">
              {{ item.title }}
            </h3>
            <p class="text-sm text-muted leading-relaxed max-w-[50ch]">
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ DOCUMENT SHOWCASE — Full width ══ -->
    <section class="py-24 md:py-32 bg-muted/30 border-t border-default">
      <div class="max-w-7xl mx-auto px-6">
        <div class="reveal mb-8">
          <p class="text-xs uppercase tracking-widest text-primary font-medium mb-6">
            See it in action
          </p>
          <h2 class="text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-tight max-w-3xl">
            Documents in. <span class="text-muted">Verified text out.</span>
          </h2>
        </div>

        <!-- Selector at top -->
        <div class="reveal flex flex-wrap gap-2 mb-6">
          <button
            v-for="(doc, i) in documents"
            :key="doc.id"
            class="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="activeDocIndex === i ? 'bg-primary text-inverted' : 'bg-muted/50 text-dimmed hover:text-highlighted hover:bg-muted'"
            @click="activeDocIndex = i"
          >
            {{ doc.label }}
          </button>
        </div>

        <!-- Split panel — full width -->
        <div class="reveal grid grid-cols-1 md:grid-cols-2 border border-default rounded-2xl overflow-hidden bg-default shadow-lg">
          <!-- Left: Document images -->
          <div class="flex flex-col h-[480px] md:h-[680px] border-b md:border-b-0 md:border-r border-default">
            <header class="h-14 px-6 flex items-center border-b border-default bg-muted/30 shrink-0">
              <div>
                <h3 class="text-sm font-heading font-semibold text-highlighted leading-tight">
                  {{ activeDoc.label }}
                </h3>
                <small class="text-[11px] text-dimmed">{{ activeDoc.era }}</small>
              </div>
            </header>
            <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
              <div
                v-for="(img, idx) in activeDoc.images"
                :key="idx"
                class="max-w-[420px] mx-auto rounded-xl overflow-hidden shadow-xl border border-default"
              >
                <NuxtImg
                  :src="img"
                  :alt="`${activeDoc.label} page ${idx + 1}`"
                  class="w-full h-auto"
                />
              </div>
            </div>
          </div>

          <!-- Right: Output -->
          <div class="flex flex-col h-[480px] md:h-[680px]">
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
                {{ activeDoc.text }}
              </div>
              <div
                v-else
                class="font-mono text-xs leading-relaxed text-dimmed"
              >
                <pre class="whitespace-pre-wrap">{{ JSON.stringify({
                  department: activeDoc.label.split(' (')[0],
                  era: activeDoc.era.split(' — ')[0],
                  encoding: activeDoc.era.split(' — ')[1],
                  pages: activeDoc.images.length,
                  status: 'verified',
                }, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ PIPELINE — Horizontal rows matching homepage ══ -->
    <section class="py-24 md:py-32 border-t border-default">
      <div class="max-w-6xl mx-auto px-6">
        <div class="reveal mb-16">
          <p class="text-xs uppercase tracking-widest text-primary font-medium mb-6">
            The GR pipeline
          </p>
          <h2 class="text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-tight max-w-3xl">
            Four stages to a searchable database.
          </h2>
        </div>

        <div class="space-y-0">
          <div
            v-for="(step, i) in pipeline"
            :key="step.step"
            class="reveal grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 py-10 border-t border-default"
            :style="{ animationDelay: `${i * 120}ms` }"
          >
            <div class="md:col-span-1">
              <span class="text-xs font-heading font-medium text-dimmed tabular-nums">{{ step.step }}</span>
            </div>
            <div class="md:col-span-3">
              <h3 class="text-xl font-heading font-bold text-highlighted">
                {{ step.title }}
              </h3>
            </div>
            <div class="md:col-span-8">
              <p class="text-muted leading-relaxed max-w-[60ch]">
                {{ step.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ METRICS + CTA — Combined final section with pattern ══ -->
    <section class="relative py-24 md:py-32 border-t border-default overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-t from-primary-100 via-primary-50/50 to-default dark:from-primary-950/30 dark:via-primary-950/10 dark:to-default" />
      <BgPattern
        name="paithani-lotus"
        :opacity="0.5"
        absolute
      />
      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="reveal mb-12">
          <p class="text-xs uppercase tracking-widest text-primary font-medium mb-6">
            GR pipeline results
          </p>
          <h2 class="text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-tight max-w-3xl">
            Purpose-built beats general-purpose.
          </h2>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(m, i) in [
              { value: '6.23%', label: 'CER', detail: 'vs 8.34% PaddleOCR' },
              { value: '35.8%', label: 'Exact Match', detail: '5x the nearest competitor' },
              { value: '124.5', label: 'Lines/sec', detail: '13-20x faster' },
              { value: '100', label: 'Jobs Created', detail: 'Marathi-fluent labellers' },
            ]"
            :key="i"
            class="reveal p-6 rounded-2xl border border-default bg-default text-center"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <div class="text-3xl md:text-4xl font-heading font-bold text-primary tabular-nums">
              {{ m.value }}
            </div>
            <div class="text-sm font-heading font-semibold text-highlighted mt-2">
              {{ m.label }}
            </div>
            <p class="text-xs text-muted mt-1">
              {{ m.detail }}
            </p>
          </div>
        </div>

        <!-- CTA integrated into metrics section -->
        <div class="mt-20 text-center">
          <h2 class="reveal text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-[1.1]">
            Maharashtra's GR archive
            <span class="text-primary">searchable for the first time.</span>
          </h2>
          <div
            class="reveal mt-10 flex flex-wrap justify-center gap-4"
            style="animation-delay: 150ms"
          >
            <UButton
              to="/products/document-review-pipeline"
              label="Explore the Review Pipeline"
              icon="i-lucide-arrow-right"
              trailing
              size="xl"
              color="primary"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
