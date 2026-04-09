<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Document Review Pipeline — Incubrain',
  meta: [{ name: 'description', content: 'AI-assisted quality control pipeline for Marathi documents. From raw scans to verified, AI-ready text.' }],
})

useScrollReveal()

const stages = [
  {
    step: '01',
    title: 'Document Ingestion',
    description: 'Raw documents retrieved and prepared for processing. Each page catalogued with source metadata for full traceability.',
    detail: 'Scanned PDFs, archival images, and government repository pages — automatically downloaded and queued.',
    image: 'https://picsum.photos/seed/pipeline-ingest/600/400',
    icon: 'i-lucide-download',
  },
  {
    step: '02',
    title: 'Line Extraction',
    description: 'Pages segmented into individual text lines using shirorekha-aware detection built specifically for Devanagari script.',
    detail: '744,000 word images extracted from 10 books in 25 minutes. Line-level extraction preserves word order and spacing.',
    image: 'https://picsum.photos/seed/pipeline-segment/600/400',
    icon: 'i-lucide-scan-line',
  },
  {
    step: '03',
    title: 'Multi-Model OCR',
    description: 'Each line processed by four independent models simultaneously — creating a committee of predictions for every line of text.',
    detail: 'Our model leads the committee at 6.23% CER. When three or more agree, text is automatically promoted.',
    image: 'https://picsum.photos/seed/pipeline-ocr/600/400',
    icon: 'i-lucide-languages',
  },
  {
    step: '04',
    title: 'Consensus & Human Review',
    description: 'Lines where models disagree are routed to trained, Marathi-fluent reviewers via a purpose-built mobile application.',
    detail: 'Reviewers can accept, correct, skip, or flag. Devanagari virtual keyboard for precise corrections. Target: 1,000 images per reviewer per day.',
    image: 'https://picsum.photos/seed/pipeline-review/600/400',
    icon: 'i-lucide-check-circle-2',
  },
  {
    step: '05',
    title: 'Feedback Loop',
    description: 'Every correction feeds back into the training pipeline. More data produces a better model, which reduces the volume of human review needed.',
    detail: 'Adding 11,000 consensus-labeled samples improved CER from 9.72% to 6.28% — a 35% error reduction from data quality alone.',
    image: 'https://picsum.photos/seed/pipeline-feedback/600/400',
    icon: 'i-lucide-refresh-cw',
  },
]

const metrics = [
  { value: '22%', label: 'Auto-Promoted', detail: 'Lines where 3/4 models agree' },
  { value: '1,000', label: 'Reviews/Day', detail: 'Per trained reviewer' },
  { value: '35%', label: 'Error Reduction', detail: 'From verified data alone' },
  { value: '100', label: 'Positions', detail: 'Marathi-fluent labellers' },
]
</script>

<template>
  <div class="bg-default min-h-screen">
    <!-- ══ HERO — Compact ══ -->
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
          <span class="text-xs tracking-widest uppercase text-dimmed font-medium">Product</span>
        </div>

        <h1 class="text-3xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tighter leading-[1.05] max-w-4xl">
          From raw scan
          <span class="text-primary">to AI-ready text.</span>
        </h1>

        <p class="text-base md:text-lg text-muted leading-relaxed max-w-[55ch] mt-6 text-pretty">
          Five-stage pipeline with AI-assisted quality control.
          No shortcuts. No unverified data.
        </p>

        <div class="flex flex-wrap gap-4 mt-8">
          <UButton
            to="/domains/government-resolutions"
            label="Government Resolutions"
            icon="i-lucide-landmark"
            trailing
            size="xl"
            color="primary"
          />
        </div>
      </div>
    </section>

    <!-- ══ STAGES — Alternating left/right ══ -->
    <section class="border-t border-default">
      <div
        v-for="(stage, i) in stages"
        :key="stage.step"
        class="py-20 md:py-28 border-b border-default relative overflow-hidden"
        :class="i % 2 === 0 ? '' : 'bg-muted/30'"
      >
        <div class="relative z-10 max-w-6xl mx-auto px-6">
          <div
            class="reveal grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center"
            :style="{ animationDelay: '100ms' }"
          >
            <!-- Text side -->
            <div
              class="md:col-span-5"
              :class="i % 2 === 0 ? 'md:order-1' : 'md:order-2'"
            >
              <span class="text-xs font-heading font-medium text-primary tabular-nums">{{ stage.step }}</span>
              <h2 class="text-2xl md:text-3xl font-heading font-bold text-highlighted mt-2 mb-4">
                {{ stage.title }}
              </h2>
              <p class="text-muted leading-relaxed mb-4">
                {{ stage.description }}
              </p>
              <p class="text-sm text-dimmed leading-relaxed border-l-2 border-primary/20 pl-4">
                {{ stage.detail }}
              </p>
            </div>

            <!-- Image side -->
            <div
              class="md:col-span-7 rounded-2xl overflow-hidden border border-default shadow-lg"
              :class="i % 2 === 0 ? 'md:order-2' : 'md:order-1'"
            >
              <NuxtImg
                :src="stage.image"
                :alt="stage.title"
                class="w-full h-auto aspect-[3/2] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ METRICS ══ -->
    <section class="py-24 md:py-32 relative overflow-hidden">
      <BgPattern
        name="paithani-lotus"
        :opacity="0.5"
        absolute
      />
      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="reveal mb-12">
          <p class="text-xs uppercase tracking-widest text-primary font-medium mb-6">
            Pipeline performance
          </p>
          <h2 class="text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-tight max-w-3xl">
            Quality at scale.
          </h2>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(m, i) in metrics"
            :key="i"
            class="reveal p-6 rounded-2xl border border-default text-center"
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
      </div>
    </section>

    <!-- ══ CTA ══ -->
    <section class="relative py-24 md:py-32 border-t border-default overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-t from-primary-100 via-primary-50 to-default dark:from-primary-950/30 dark:via-default dark:to-default" />
      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 class="reveal text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-[1.1]">
          Data quality is the single biggest lever.
          <span class="text-primary">This pipeline delivers it.</span>
        </h2>
        <p
          class="reveal text-muted text-lg mt-6 max-w-xl mx-auto text-pretty"
          style="animation-delay: 100ms"
        >
          Verified, human-reviewed training data reduced our error rate by 35%.
          The same principle applies to every downstream AI application.
        </p>
        <div
          class="reveal mt-10"
          style="animation-delay: 200ms"
        >
          <UButton
            to="/domains/government-resolutions"
            label="See It In Action"
            icon="i-lucide-arrow-right"
            trailing
            size="xl"
            color="primary"
          />
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
