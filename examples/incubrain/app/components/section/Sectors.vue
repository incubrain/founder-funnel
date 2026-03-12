<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  items?: Array<{
    id: string
    title: string
    icon: string
  }>
}>()
</script>

<template>
  <SectionWrapper
    section-id="sectors"
    :title="title"
    :description="description"
  >
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-12 sm:mt-16">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        to="/sectors"
        class="group flex flex-col items-center gap-3 p-5 rounded-xl border border-default bg-muted/20 hover:bg-muted/50 transition-all duration-300 hover:shadow-md hover:border-primary/30 text-center"
      >
        <div
          class="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
        >
          <UIcon
            :name="item.icon"
            class="size-6 text-primary"
          />
        </div>
        <span class="text-xs sm:text-sm font-medium text-muted leading-tight">
          {{ item.title }}
        </span>
      </NuxtLink>
    </div>

    <div class="mt-8 text-center">
      <UButton
        to="/sectors"
        label="Explore All Sectors"
        icon="i-lucide-arrow-right"
        color="primary"
        variant="link"
        size="lg"
        trailing
      />
    </div>
  </SectionWrapper>
</template>
