<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /**
   * Maximum width for the split container
   * @default "7xl"
   */
  maxWidth?: 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  /**
   * Gap between columns
   * @default "8"
   */
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: '7xl',
  gap: 8,
})

const maxWidthClass = computed(() => {
  const widthMap = {
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full',
  }
  return widthMap[props.maxWidth]
})

const gapClass = computed(() => {
  const gapMap: Record<number, string> = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
    16: 'gap-16',
  }
  return gapMap[props.gap] || 'gap-8'
})
</script>

<template>
  <div :class="[maxWidthClass, 'mx-auto w-full']">
    <div :class="['grid lg:grid-cols-2 items-start', gapClass]">
      <!-- Left slot -->
      <div
        v-if="$slots.left"
        class="w-full h-full"
      >
        <slot name="left" />
      </div>

      <!-- Right slot -->
      <div
        v-if="$slots.right"
        class="w-full h-full"
      >
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
