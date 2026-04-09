<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  input?: {
    src: string
    alt: string
    caption?: string
  }
  output?: {
    text: string
    caption?: string
  }
  reviewApp?: {
    src: string
    alt: string
    caption?: string
  }
}>()
</script>

<template>
  <SectionWrapper
    section-id="demo"
    :title="title"
    :description="description"
  >
    <div class="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      <div
        v-if="input"
        class="rounded-lg border border-default overflow-hidden"
      >
        <div class="px-3 py-2 bg-muted/50 border-b border-default text-xs font-medium text-dimmed uppercase tracking-wide">
          Scanned Document
        </div>
        <NuxtImg
          :src="input.src"
          :alt="input.alt"
          class="w-full"
        />
        <p
          v-if="input.caption"
          class="px-3 py-2 text-xs text-dimmed"
        >
          {{ input.caption }}
        </p>
      </div>

      <div
        v-if="output"
        class="rounded-lg border border-default overflow-hidden"
      >
        <div class="px-3 py-2 bg-muted/50 border-b border-default text-xs font-medium text-dimmed uppercase tracking-wide">
          Extracted Text
        </div>
        <div class="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-highlighted">
          {{ output.text }}
        </div>
        <p
          v-if="output.caption"
          class="px-3 py-2 text-xs text-dimmed border-t border-default"
        >
          {{ output.caption }}
        </p>
      </div>
    </div>

    <div
      v-if="reviewApp"
      class="mt-8 max-w-4xl mx-auto rounded-lg border border-default overflow-hidden"
    >
      <div class="px-3 py-2 bg-muted/50 border-b border-default text-xs font-medium text-dimmed uppercase tracking-wide">
        AI-Assisted Review Platform
      </div>
      <NuxtImg
        :src="reviewApp.src"
        :alt="reviewApp.alt"
        class="w-full"
      />
      <p
        v-if="reviewApp.caption"
        class="px-3 py-2 text-xs text-dimmed"
      >
        {{ reviewApp.caption }}
      </p>
    </div>
  </SectionWrapper>
</template>
