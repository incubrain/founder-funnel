<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

interface Props {
  location: string
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
  color?: ButtonProps['color']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'xl',
  variant: 'subtle',
  color: 'secondary',
})

const { feedsPageUrl, trackClick } = useRssFeed()
</script>

<template>
  <UButton
    icon="i-lucide-rss"
    :to="feedsPageUrl"
    :size="props.size"
    :variant="props.variant"
    :color="props.color"
    class="rounded-full text-default p-3"
    aria-label="RSS Feeds"
    data-testid="convert-rss"
    @click="trackClick(props.location)"
  />
</template>
