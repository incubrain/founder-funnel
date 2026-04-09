<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  stages?: Array<{
    step: number
    title: string
    description: string
    icon: string
    detail?: string
    visual?: {
      src: string
      alt: string
    }
  }>
}>()
</script>

<template>
  <SectionWrapper
    section-id="pipeline-detail"
    :title="title"
    :description="description"
  >
    <div class="mt-10 sm:mt-14 max-w-4xl mx-auto space-y-6">
      <div
        v-for="stage in stages"
        :key="stage.step"
        class="rounded-lg border border-default overflow-hidden"
      >
        <div class="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b border-default">
          <div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-inverted font-bold text-xs">
            {{ stage.step }}
          </div>
          <UIcon
            :name="stage.icon"
            class="size-4 text-primary"
          />
          <h3 class="text-sm font-heading font-bold text-highlighted">
            {{ stage.title }}
          </h3>
        </div>
        <div class="p-5">
          <p class="text-sm text-dimmed leading-relaxed">
            {{ stage.description }}
          </p>
          <p
            v-if="stage.detail"
            class="mt-3 text-xs text-dimmed/80 leading-relaxed border-l-2 border-primary/20 pl-3"
          >
            {{ stage.detail }}
          </p>
          <div
            v-if="stage.visual"
            class="mt-4 rounded border border-default overflow-hidden"
          >
            <NuxtImg
              :src="stage.visual.src"
              :alt="stage.visual.alt"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
