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
  <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent -mx-4 sm:mx-0">
    <div class="flex gap-3 min-w-max py-4 px-4">
      <div
        v-for="(m, i) in milestones"
        :key="i"
        class="group relative w-40 md:w-48 shrink-0"
      >
        <div class="overflow-hidden rounded-xl aspect-[3/4] ring ring-default">
          <NuxtImg
            :src="m.image"
            :alt="m.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent rounded-xl" />
          <div class="absolute bottom-0 left-0 right-0 p-3.5">
            <UBadge color="primary" variant="subtle" size="xs">
              {{ m.year }}
            </UBadge>
            <p class="text-xs text-white font-medium leading-tight line-clamp-2 mt-1.5">
              {{ m.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
