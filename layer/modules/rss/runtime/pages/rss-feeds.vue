<script setup lang="ts">
const { feeds } = useRssFeed()
const { copy } = useClipboard()
const toast = useToast()
const { trackEvent } = useEvents()

const copyUrl = async (feedName: string, url: string) => {
  await copy(url)
  trackEvent({
    id: `rss_copy_${feedName}`,
    type: 'offer_click',
    target: 'rss_copy_url',
  })
  toast.add({
    title: 'Feed URL Copied',
    description: 'Paste into your RSS reader',
    icon: 'i-lucide-check',
    color: 'success',
  })
}

useHead({
  title: 'RSS Feeds',
})

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <UMain>
    <UPage class="pb-12 lg:pb-16">
      <UPageHero
        title="RSS Feeds"
        description="Subscribe to our content feeds in your favourite RSS reader."
      />
      <UContainer>
        <div
          v-if="feeds.length"
          class="flex flex-col gap-6 max-w-xl"
        >
          <div
            v-for="feed in feeds"
            :key="feed.name"
            class="flex flex-col gap-2 p-4 rounded-lg border border-default"
          >
            <h2 class="text-lg font-semibold">
              {{ feed.title }}
            </h2>
            <p
              v-if="feed.description"
              class="text-sm text-muted"
            >
              {{ feed.description }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <UButton
                icon="i-lucide-copy"
                label="Copy URL"
                size="sm"
                variant="soft"
                color="primary"
                @click="copyUrl(feed.name, feed.url)"
              />
              <UButton
                icon="i-lucide-external-link"
                label="View XML"
                size="sm"
                variant="ghost"
                color="neutral"
                :to="feed.url"
                external
                target="_blank"
              />
            </div>
          </div>
        </div>
        <p
          v-else
          class="text-muted"
        >
          No RSS feeds are configured.
        </p>
      </UContainer>
    </UPage>
  </UMain>
</template>
