<script setup lang="ts">
interface Milestone {
  year: string
  title: string
  description?: string
  image: string
  size?: 'large' | 'wide' | 'small' | 'accent'
}

defineProps<{
  milestones: Milestone[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
    <div
      v-for="(m, i) in milestones"
      :key="i"
      :class="[
        'relative group overflow-hidden rounded-xl',
        m.size === 'large' && 'col-span-2 row-span-2',
        m.size === 'wide' && 'col-span-2',
        m.size === 'accent' && 'bg-primary/10 flex items-center justify-center',
      ]"
    >
      <!-- Accent card (no image) -->
      <template v-if="m.size === 'accent'">
        <div class="p-4 md:p-5 text-center space-y-2">
          <UBadge color="primary" variant="solid">
            {{ m.year }}
          </UBadge>
          <p class="text-sm font-bold text-highlighted">
            {{ m.title }}
          </p>
          <p v-if="m.description" class="text-xs text-muted">
            {{ m.description }}
          </p>
        </div>
      </template>

      <!-- Image card -->
      <template v-else>
        <NuxtImg
          :src="m.image"
          :alt="m.title"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div
          :class="[
            'absolute bottom-0 left-0 right-0',
            m.size === 'large' ? 'p-5 md:p-6' : m.size === 'wide' ? 'p-4 md:p-5' : 'p-3 md:p-4',
          ]"
        >
          <UBadge
            color="primary"
            variant="subtle"
            :size="m.size === 'large' || m.size === 'wide' ? 'sm' : 'xs'"
          >
            {{ m.year }}
          </UBadge>
          <p
            :class="[
              'text-white font-bold mt-1.5',
              m.size === 'large' ? 'text-xl md:text-2xl' : m.size === 'wide' ? 'text-lg md:text-xl' : 'text-sm',
            ]"
          >
            {{ m.title }}
          </p>
          <p
            v-if="m.description && (m.size === 'large' || m.size === 'wide')"
            class="text-white/80 text-sm mt-1 line-clamp-2 md:line-clamp-3"
          >
            {{ m.description }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
