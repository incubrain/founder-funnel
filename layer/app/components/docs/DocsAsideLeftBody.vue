<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const DOCS_COLLECTION = 'docs'

const { data: navigation } = await useAsyncData('docs-navigation', () => {
  return queryCollectionNavigation(DOCS_COLLECTION, ['title', 'label', 'path', 'stem'])
})

const mapNavigation = (
  items: ContentNavigationItem[],
): ContentNavigationItem[] => {
  return items?.map(item => ({
    ...item,
    title: (item as Record<string, unknown>).label as string ?? item.title,
    children: item.children?.length ? mapNavigation(item.children) : undefined,
    path: item.path ?? '',
  })) as ContentNavigationItem[]
}

const nav = computed(() => (navigation.value?.length ? mapNavigation(navigation.value[0]?.children || []) : []))
</script>

<template>
  <div
    v-if="nav"
    class="space-y-8"
  >
    <UContentNavigation
      highlight
      :navigation="nav"
    />
  </div>
</template>
