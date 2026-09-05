<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

// See default.vue for why the layout fetches its own page data
// (useAsyncData dedupes — this is a cache hit, not a second request).
const route = useRoute()
const appConfig = useAppConfig()
const pagesBackLabel = (appConfig.content?.pagesBackLabel as string) || 'Back'
const pagesPrefix = (appConfig.content?.pagesPrefix as string) || '/'

const { collection, getPage } = useContentPage()
const { data: article } = await getPage()

// Surround query: useFetch dedupes by key, so if the catch-all already
// fetched the same surround, this is also a cache hit. Literal query
// values, not getters — see useContentPage.getPage() for why.
const { data: surround } = await useFetch<Array<ContentNavigationItem | null>>(
  '/api/_foundry/content/surround',
  {
    key: `surround-${collection.value}-${route.path}`,
    query: {
      collection: collection.value,
      path: route.path,
      fields: 'title,description,label',
    },
    default: () => [],
    watch: [() => route.path, collection],
  },
)

watchEffect(() => {
  if (!article.value) return
  useHead({
    title: article.value.title,
    meta: [{ name: 'description', content: article.value.description }],
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
            {{ article?.title }}
          </template>

          <template #description>
            <div class="flex flex-wrap items-center gap-4 mb-4">
              <div
                v-if="article?.label"
                class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20"
              >
                <UIcon
                  name="i-lucide-tag"
                  class="size-4 text-primary"
                />
                <span class="font-mono font-semibold text-primary text-sm">
                  {{ article.label }}
                </span>
              </div>

              <div
                v-if="article?.date"
                class="flex items-center gap-2 text-muted"
              >
                <UIcon
                  name="i-lucide-calendar"
                  class="size-4"
                />
                <NuxtTime
                  :datetime="article.date"
                  year="numeric"
                  month="long"
                  day="numeric"
                  class="text-sm font-medium"
                />
              </div>
            </div>

            <p
              v-if="article?.description"
              class="text-lg text-muted leading-relaxed"
            >
              {{ article.description }}
            </p>
          </template>

          <template
            v-if="article?.image"
            #default
          >
            <NuxtImg
              :src="article.image"
              :alt="article.title"
              class="w-full rounded-lg border border-default shadow-lg mt-8"
              loading="lazy"
            />
          </template>
        </UPageHeader>
      </UContainer>

      <UPageBody class="max-w-3xl mx-auto">
        <!-- Answer-first (product-validator-m0f.7): a frontmatter `answer`
             renders before the prose body — no per-article component
             placement required. -->
        <AnswerBlock
          v-if="article?.answer"
          :answer="article.answer"
        />

        <article class="prose prose-lg max-w-none">
          <slot />
        </article>

        <!-- Visible source citations (product-validator-m0f.7), from
             frontmatter `sources`. -->
        <section
          v-if="article?.sources?.length"
          aria-label="Sources"
          class="mt-12 pt-6 border-t border-default"
        >
          <h2 class="text-sm font-semibold text-highlighted mb-3">
            Sources
          </h2>
          <ol class="space-y-1 text-sm text-muted">
            <li
              v-for="source in article.sources"
              :key="source.href"
            >
              <a
                :href="source.href"
                target="_blank"
                rel="noopener noreferrer"
                class="underline hover:text-primary"
              ><cite>{{ source.label }}</cite></a>
            </li>
          </ol>
        </section>

        <template v-if="surround?.filter(Boolean).length">
          <USeparator class="my-12" />
          <!-- @vue-ignore — UContentSurround expects ContentSurroundLink[] but
               our useFetch widens the response to (ContentNavigationItem|null)[].
               Runtime data matches the prev/next shape. -->
          <UContentSurround :surround="surround" />
        </template>
      </UPageBody>
    </UPage>
  </UMain>
</template>
