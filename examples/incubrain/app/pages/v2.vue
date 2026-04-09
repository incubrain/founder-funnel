<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Incubrain — Marathi AI Infrastructure',
  meta: [
    { name: 'description', content: 'Purpose-built OCR pipeline for digitizing Maharashtra\'s 200,000+ Government Resolutions.' },
  ],
})

useScrollReveal()

const features = [
  {
    title: 'Domain-adapted OCR',
    description: 'Purpose-built for Devanagari script — shirorekha, matras, conjuncts. Fine-tuned per domain for accuracy that generalist models cannot match. 6.23% CER vs 16.72% for Tesseract.',
    icon: 'i-lucide-target',
  },
  {
    title: 'AI-assisted quality control',
    description: 'A four-model consensus committee pre-verifies output. Where models agree, text is auto-promoted. The rest goes to trained Marathi-fluent reviewers via a purpose-built application.',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'Structured data output',
    description: 'Raw documents become searchable databases with entity extraction, metadata tagging, and cross-referencing. Open source, state-owned, no vendor lock-in.',
    icon: 'i-lucide-database',
  },
]

const metrics = [
  { value: '6.23%', label: 'Character Error Rate', detail: 'Vs 8.34% PaddleOCR, 16.72% Tesseract on MarathiLine benchmark', hero: true },
  { value: '5x', label: 'Better Exact Match', detail: '35.8% vs 7.4% for the nearest competitor' },
  { value: '20x', label: 'Faster Processing', detail: '124.5 lines/sec vs 6-10 for alternatives' },
]
</script>

<template>
  <div class="bg-default min-h-screen">
    <!-- ══ HERO — Parallax image background (Mistral-inspired) ══ -->
    <section class="relative min-h-[100dvh] flex items-end overflow-hidden hero-parallax">
      <!-- Background image with parallax -->
      <div class="absolute inset-0">
        <div
          class="w-full h-[120%] -mt-[10%] bg-cover bg-center bg-fixed"
          style="background-image: url('https://picsum.photos/seed/maharashtra-skyline/1920/1080')"
          role="img"
          aria-label="Maharashtra landscape"
        />
      </div>
      <!-- Warm gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-primary-600/90 via-primary-500/60 to-primary-400/30 dark:from-primary-950 dark:via-primary-900/80 dark:to-primary-800/40" />
      <BgPattern
        name="paithani-classic"
        :opacity="0.1"
        absolute
      />

      <div class="relative z-10 max-w-6xl mx-auto px-6 w-full pt-32 pb-20 md:pb-28">
        <div class="max-w-3xl space-y-8">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5">
            <span class="size-1.5 rounded-full bg-white animate-pulse" />
            <span class="text-xs tracking-widest uppercase text-white/80 font-medium">Domain-Specific AI for Maharashtra</span>
          </div>

          <h1
            class="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter leading-[1.05] text-white"
            style="text-wrap: balance"
          >
            Domain-specific AI.
            <br>
            Built for Marathi.
          </h1>

          <p class="text-base md:text-lg text-white/80 leading-relaxed max-w-[50ch] text-pretty">
            Instead of building generalist models, we fine-tune for high-value domains —
            starting with 200,000+ Government Resolutions. Purpose-built tools that
            outperform general-purpose AI on the problems that matter most.
          </p>

          <div class="flex flex-wrap gap-4 pt-2">
            <a
              href="/benchmarks"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary-700 font-semibold text-sm hover:bg-white/90 transition-all duration-200 active:scale-[0.98]"
            >
              View Benchmarks
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4"
              />
            </a>
            <a
              href="#domains"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-all duration-200"
            >
              Explore Domains
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ LOGO MARQUEE — Infinite scroll ══ -->
    <section class="py-10 md:py-14 border-b border-default bg-muted/30 overflow-hidden">
      <div class="max-w-6xl mx-auto px-6 mb-6">
        <p class="text-xs uppercase tracking-widest text-dimmed font-medium text-center">
          Enhancing India's AI ecosystem with quality Marathi data
        </p>
      </div>
      <div class="relative">
        <div class="flex items-center gap-16 md:gap-20 animate-marquee whitespace-nowrap">
          <span
            v-for="(name, i) in [
              'Sarvam AI', 'Bhashini', 'AI4Bharat', 'OpenAI', 'Google DeepMind', 'Meta AI', 'Microsoft', 'Mistral',
              'Sarvam AI', 'Bhashini', 'AI4Bharat', 'OpenAI', 'Google DeepMind', 'Meta AI', 'Microsoft', 'Mistral',
            ]"
            :key="i"
            class="text-2xl md:text-3xl font-heading font-bold text-dimmed/40 shrink-0 grayscale"
          >
            {{ name }}
          </span>
        </div>
      </div>
    </section>

    <!-- ══ PROBLEM — Large statement + grid ══ -->
    <section class="py-24 md:py-32 border-t border-default relative overflow-hidden">
      <BgPattern
        name="asawali-dots"
        :opacity="0.1"
        absolute
      />
      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="reveal mb-16 md:mb-24">
          <p class="text-xs uppercase tracking-widest text-primary font-medium mb-6">
            The problem
          </p>
          <h2 class="text-3xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tighter leading-[1.1] max-w-4xl">
            Maharashtra's data is locked
            <span class="text-muted">in formats AI cannot read.</span>
          </h2>
          <p class="text-muted text-lg mt-6 max-w-3xl leading-relaxed text-pretty">
            Millions of documents across government, judiciary, agriculture, and education
            sit inaccessible — scanned on paper, trapped in legacy font encodings, or digital
            but unstructured. General-purpose AI tools fail on Marathi. Quality Indic data
            is the acknowledged global bottleneck.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div
            v-for="(item, i) in [
              { title: 'Scanned archives', text: 'Decades of government records, court documents, and manuscripts exist only as scanned images. Full OCR is required. Generic tools produce 8-17% error rates on Devanagari.' },
              { title: 'Legacy font encodings', text: 'Documents look like Devanagari but use proprietary ASCII mappings — Shree Dev, Kruti Dev, Shusha. Text extraction produces garbled output. Each font family has its own mapping.' },
              { title: 'Digital but unstructured', text: 'Even natively digital documents are not searchable, indexed, or cross-referenced. Without entity extraction and metadata, they are invisible to analysis.' },
              { title: 'Quality data is the bottleneck', text: 'At the Delhi AI Summit, OpenAI, Google, and Sarvam identified quality Indic training data as the single biggest barrier to multilingual AI performance.' },
            ]"
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

    <!-- ══ DOMAINS — Horizontal scroll carousel ══ -->
    <section
      id="domains"
      class="py-24 md:py-32 border-t border-default"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="reveal mb-12">
          <p class="text-xs uppercase tracking-widest text-primary font-medium mb-6">
            Domain-specific AI
          </p>
          <h2 class="text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-tight max-w-4xl">
            Fine-tuned for high-value domains.
            <span class="text-muted">Not another generalist model.</span>
          </h2>
          <p class="text-muted text-lg mt-6 max-w-3xl leading-relaxed text-pretty">
            Instead of building one model for every language, we target specific domains
            where precision matters most — then fine-tune until we outperform every
            general-purpose alternative.
          </p>
        </div>
      </div>

      <!-- Horizontal scroll carousel — large cards with image backgrounds -->
      <div class="overflow-x-auto scrollbar-hide pl-6 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
        <div class="flex gap-6 pb-6 pr-6">
          <div
            v-for="(domain, i) in [
              { title: 'Government Resolutions', status: 'Active', stat: '200K+ documents', img: 'https://picsum.photos/seed/gov-docs/800/500' },
              { title: 'Court & Legal Records', status: 'Next', stat: 'Revenue & judiciary', img: 'https://picsum.photos/seed/legal-docs/800/500' },
              { title: 'Historical Manuscripts', status: 'Planned', stat: '800+ years of heritage', img: 'https://picsum.photos/seed/manuscripts/800/500' },
              { title: 'Agricultural Records', status: 'Planned', stat: 'MahaAgri-AI aligned', img: 'https://picsum.photos/seed/agriculture/800/500' },
              { title: 'Newspapers & Periodicals', status: 'Planned', stat: 'Training data source', img: 'https://picsum.photos/seed/newspapers/800/500' },
              { title: 'Educational Materials', status: 'Planned', stat: 'Student accessible', img: 'https://picsum.photos/seed/education/800/500' },
            ]"
            :key="i"
            class="reveal shrink-0 w-[520px] md:w-[640px] lg:w-[720px] h-[340px] md:h-[420px] rounded-2xl overflow-hidden relative group"
            :style="{ animationDelay: `${i * 80}ms` }"
          >
            <!-- Card background image -->
            <div
              class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              :style="{ backgroundImage: `url('${domain.img}')` }"
            />
            <!-- Dark gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <!-- Content pinned to bottom -->
            <div class="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
              <span
                class="self-start text-[10px] uppercase tracking-widest font-medium px-2.5 py-1 rounded-full mb-4"
                :class="domain.status === 'Active'
                  ? 'bg-primary/80 text-white'
                  : 'bg-white/15 text-white/80'"
              >
                {{ domain.status }}
              </span>
              <h3 class="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                {{ domain.title }}
              </h3>
              <span class="text-sm text-white/60">{{ domain.stat }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ WHY INCUBRAIN — Zig-zag (Mistral "What can do" style) ══ -->
    <section class="py-24 md:py-32 bg-muted/30 border-t border-default relative overflow-hidden">
      <BgPattern
        name="asawali-lotus"
        :opacity="0.1"
        absolute
      />
      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="reveal mb-16 md:mb-20">
          <p class="text-xs uppercase tracking-widest text-primary font-medium mb-6">
            The platform
          </p>
          <h2 class="text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-tight max-w-3xl">
            Three systems working together.
            <span class="text-muted">OCR, quality control, and structured output.</span>
          </h2>
        </div>

        <div class="space-y-16 md:space-y-24">
          <div
            v-for="(feat, i) in features"
            :key="i"
            class="reveal grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start"
            :class="i % 2 !== 0 ? 'md:direction-rtl' : ''"
            :style="{ animationDelay: `${i * 120}ms` }"
          >
            <div
              class="md:col-span-5"
              :class="i % 2 !== 0 ? 'md:col-start-8' : ''"
            >
              <div class="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <UIcon
                  :name="feat.icon"
                  class="size-6 text-primary"
                />
              </div>
              <h3 class="text-2xl font-heading font-bold text-highlighted mb-4">
                {{ feat.title }}
              </h3>
              <p class="text-muted leading-relaxed max-w-[50ch]">
                {{ feat.description }}
              </p>
            </div>
            <div
              class="md:col-span-6 rounded-2xl border border-default bg-default overflow-hidden min-h-[200px] flex items-center justify-center"
              :class="i % 2 !== 0 ? 'md:col-start-1 md:row-start-1' : 'md:col-start-7'"
            >
              <NuxtImg
                :src="`https://placehold.co/600x360/f5f5f4/a8a29e?text=Visual+${i + 1}`"
                :alt="feat.title"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ METRICS — Bento grid ══ -->
    <section class="py-24 md:py-32 border-t border-default relative overflow-hidden">
      <BgPattern
        name="asawali-lotus"
        :opacity="0.1"
        absolute
      />
      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="reveal mb-16">
          <p class="text-xs uppercase tracking-widest text-primary font-medium mb-6">
            OCR performance
          </p>
          <h2 class="text-3xl md:text-5xl font-heading font-bold tracking-tighter leading-tight max-w-3xl">
            Purpose-built beats general-purpose.
            <span class="text-muted">Every time.</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(m, i) in metrics"
            :key="i"
            class="reveal rounded-2xl border border-default bg-muted/30 p-8 md:p-10"
            :class="m.hero ? 'md:col-span-2 md:row-span-2 flex flex-col justify-center' : ''"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <div
              class="font-heading font-bold tabular-nums"
              :class="[
                m.hero ? 'text-6xl md:text-8xl text-primary' : 'text-3xl md:text-4xl text-highlighted',
              ]"
            >
              {{ m.value }}
            </div>
            <div
              class="font-heading font-semibold mt-3"
              :class="m.hero ? 'text-xl text-highlighted' : 'text-sm text-highlighted'"
            >
              {{ m.label }}
            </div>
            <p
              class="text-muted mt-2"
              :class="m.hero ? 'text-base max-w-[45ch]' : 'text-xs'"
            >
              {{ m.detail }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CTA — Bold close with gradient ══ -->
    <section class="relative py-24 md:py-40 border-t border-default overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-t from-primary-100 via-primary-50 to-default dark:from-primary-950/30 dark:via-default dark:to-default" />
      <BgPattern
        name="paithani-classic"
        :opacity="0.08"
        absolute
      />

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 class="reveal text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter leading-[1.05]">
          Build Maharashtra's AI future
          <span class="text-primary">with sovereign data.</span>
        </h2>

        <p
          class="reveal text-muted text-lg mt-8 max-w-xl mx-auto text-pretty"
          style="animation-delay: 100ms"
        >
          The next generation of Marathi AI starts with data that's accurate,
          verified, and owned by the state.
        </p>

        <div
          class="reveal mt-10 flex flex-wrap justify-center gap-4"
          style="animation-delay: 200ms"
        >
          <UButton
            to="/benchmarks"
            label="View Benchmark Results"
            icon="i-lucide-arrow-right"
            trailing
            size="xl"
            color="primary"
          />
          <UButton
            to="/products/document-review-pipeline"
            label="Explore the Pipeline"
            size="xl"
            color="neutral"
            variant="outline"
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
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Infinite marquee scroll */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

/* Hide scrollbar on domain carousel */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
