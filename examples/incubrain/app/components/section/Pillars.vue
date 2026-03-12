<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  items?: Array<{
    id: string
    title: string
    description: string
    icon: string
    to: string
  }>
}>()
</script>

<template>
  <SectionWrapper
    section-id="pillars"
    :title="title"
    :description="description"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 sm:mt-16">
      <a
        v-for="item in items"
        :key="item.id"
        :href="item.to"
        target="_blank"
        rel="noopener"
        class="group relative flex flex-col gap-4 p-6 rounded-xl border border-default bg-muted/30 hover:bg-muted/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div class="flex items-center gap-3">
          <div
            class="size-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
          >
            <UIcon
              :name="item.icon"
              class="size-5 text-primary"
            />
          </div>
          <h3 class="text-lg font-heading font-bold text-highlighted">
            {{ item.title }}
          </h3>
        </div>
        <p class="text-sm text-dimmed leading-relaxed">
          {{ item.description }}
        </p>
        <div class="flex items-center gap-1 text-xs text-primary font-medium mt-auto">
          <span>Visit</span>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-3"
          />
        </div>
      </a>
    </div>
  </SectionWrapper>
</template>
