<script setup lang="ts">
interface Milestone {
  year: string
  title: string
  image: string
}

defineProps<{
  milestones: Milestone[]
}>()
</script>

<template>
  <UScrollArea
    v-slot="{ item, index }"
    :items="milestones"
    orientation="horizontal"
    :ui="{
      item: 'min-h-80 w-full size-full aspect-3/2',
      viewport: 'gap-4 p-4',
    }"
  >
    <div class="overflow-hidden relative rounded-xl shadow-xl">
      <NuxtImg
        :src="item.image"
        :alt="item.title"
        class="min-w-full h-full min-h-80 size-full object-cover shrink-0"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
      />
      <div class="absolute bottom-0 left-0 right-0 p-3.5">
        <UBadge color="primary" variant="subtle" size="xs">
          {{ item.year }}
        </UBadge>
        <p
          class="text-xs text-white font-medium leading-tight line-clamp-2 mt-1.5"
        >
          {{ item.title }}
        </p>
      </div>
    </div>
  </UScrollArea>
</template>
