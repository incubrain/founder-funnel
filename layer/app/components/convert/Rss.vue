<script setup lang="ts">
import type { SelectMenuProps } from '@nuxt/ui'

interface Props {
  feedPath?: string
  feedUrl?: string
  location: string
  size?: SelectMenuProps['size']
  variant?: SelectMenuProps['variant']
  color?: SelectMenuProps['color']
  showLabel?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  feedPath: 'decisions',
  size: 'lg',
  variant: 'ghost',
  color: 'neutral',
  showLabel: true,
  label: 'RSS',
})

const { actions, handleSelect } = useRssFeed({
  feedPath: props.feedPath,
  feedUrl: props.feedUrl,
  location: props.location,
})

// Compute button classes to avoid dynamic Tailwind class generation
const buttonClasses = computed(() => {
  if (props.showLabel)
    return ''

  // Predefined color variants for proper Tailwind purging
  const colorMap = {
    primary: 'rounded-full flex p-2 bg-primary/10 hover:bg-primary/40',
    secondary: 'rounded-full flex p-2 bg-secondary/10 hover:bg-secondary/40',
    neutral: 'rounded-full flex p-2 bg-neutral/10 hover:bg-neutral/40',
  }

  return colorMap[props.color as keyof typeof colorMap] || colorMap.neutral
})
</script>

<template>
  <div
    class="flex flex-col gap-2"
    data-testid="convert-rss"
  >
    <USelectMenu
      :items="actions"
      :search-input="false"
      :variant="variant"
      :color="color"
      :size="size"
      :trailing-icon="showLabel ? 'i-lucide-chevron-down' : ''"
      :ui="{
        base: buttonClasses,
        content: 'w-full',
        item: 'hover:bg-primary/10',
      }"
      @update:model-value="handleSelect"
    >
      <template #default="{ open }">
        <span
          :aria-label="showLabel ? undefined : 'Subscribe to RSS Feed'"
          :class="{ 'opacity-75': open }"
          class="w-full flex items-center gap-2"
        >
          <UIcon
            name="i-lucide-rss"
            class="text-xl"
          />
          {{ showLabel ? label : undefined }}
        </span>
      </template>

      <template #item="{ item }">
        <UIcon
          :name="item.icon"
          class="w-4 h-4 text-muted"
        />
        <span class="truncate">{{ item.label }}</span>
      </template>
    </USelectMenu>
  </div>
</template>
