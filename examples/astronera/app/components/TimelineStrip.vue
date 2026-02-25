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
  <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
    <div class="flex gap-1 min-w-max py-4 px-4">
      <div
        v-for="(m, i) in milestones"
        :key="i"
        class="group relative w-36 md:w-44 shrink-0 cursor-default"
      >
        <div class="overflow-hidden rounded-lg aspect-[3/4]">
          <NuxtImg
            :src="m.image"
            :alt="m.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-lg" />
          <div class="absolute bottom-0 left-0 right-0 p-3">
            <span class="text-xs font-bold text-primary-300 block">{{ m.year }}</span>
            <span class="text-xs text-white font-medium leading-tight line-clamp-2">{{ m.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
