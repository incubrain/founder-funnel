<script setup lang="ts">
// See default.vue for why the layout fetches its own page data
// (useAsyncData dedupes — this is a cache hit, not a second request).
const route = useRoute()
const appConfig = useAppConfig()
const pagesBackLabel = (appConfig.content?.pagesBackLabel as string) || 'Back'
const pagesPrefix = (appConfig.content?.pagesPrefix as string) || '/'

const { collection, getPage } = useContentPage()
const { data: article } = await getPage()

// Surround query: useFetch dedupes by key, so if the catch-all already
// fetched the same surround, this is also a cache hit.
const { data: surround } = await useFetch('/api/_foundry/content/surround', {
  key: `surround-${collection.value}-${route.path}`,
  query: {
    collection: collection as any,
    path: () => route.path,
    fields: 'title,description,label',
  },
  default: () => [],
  watch: [() => route.path, collection],
})

watchEffect(() => {
  if (!article.value) return
  useHead({
    title: (article.value as any).title,
    meta: [{ name: 'description', content: (article.value as any).description }],
  })
})
</script>

<template>
  <UMain>
    <UPage>
      <UContainer>
        <UPageHeader>
          <template #headline>
            <UButton
              :to="pagesPrefix"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
              size="sm"
              :label="pagesBackLabel"
            />
          </template>

          <template #title>
            {{ (article as any)?.title }}
          </template>

          <template #description>
            <div class="flex flex-wrap items-center gap-4 mb-4">
              <div
                v-if="(article as any)?.label"
                class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20"
              >
                <UIcon
                  name="i-lucide-tag"
                  class="size-4 text-primary"
                />
                <span class="font-mono font-semibold text-primary text-sm">
                  {{ (article as any).label }}
                </span>
              </div>

              <div
                v-if="(article as any)?.date"
                class="flex items-center gap-2 text-muted"
              >
                <UIcon
                  name="i-lucide-calendar"
                  class="size-4"
                />
                <NuxtTime
                  :datetime="(article as any).date"
                  year="numeric"
                  month="long"
                  day="numeric"
                  class="text-sm font-medium"
                />
              </div>
            </div>

            <p
              v-if="(article as any)?.description"
              class="text-lg text-muted leading-relaxed"
            >
              {{ (article as any).description }}
            </p>
          </template>

          <template
            v-if="(article as any)?.image"
            #default
          >
            <NuxtImg
              :src="(article as any).image"
              :alt="(article as any).title"
              class="w-full rounded-lg border border-default shadow-lg mt-8"
              loading="lazy"
            />
          </template>
        </UPageHeader>
      </UContainer>

      <UPageBody class="max-w-3xl mx-auto">
        <article class="prose prose-lg max-w-none">
          <slot />
        </article>

        <template v-if="(surround as any[])?.filter(Boolean).length">
          <USeparator class="my-12" />
          <UContentSurround :surround="surround" />
        </template>
      </UPageBody>
    </UPage>
  </UMain>
</template>
