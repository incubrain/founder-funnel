<script setup lang="ts">
import { useNavigation } from '#navigation'
import { useSearch } from '#search'

const { title, seo } = useAppConfig()
const isDev = import.meta.dev

const { data: site } = useAsyncData('app-config', () =>
  queryCollection('config').where('stem', '=', 'config/site').first(),
)

/* -------------------------------------------------------------------------- */
/*                             LOAD COMPOSABLES                                */
/* -------------------------------------------------------------------------- */

const { navigationHeader, navigationFooter, navigationAll, banner }
  = await useNavigation()

const { searchFiles } = await useSearch()

/* -------------------------------------------------------------------------- */
/*                                   META                                     */
/* -------------------------------------------------------------------------- */

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en', dir: 'ltr' },
})

useSeoMeta({
  titleTemplate: seo.titleTemplate as string | undefined,
  title: seo.title as string | undefined,
  description: seo.description as string | undefined,
  ogSiteName: title as string | undefined,
  twitterCard: 'summary_large_image',
})

/* -------------------------------------------------------------------------- */
/*                              GLOBAL PROVIDES                                */
/* -------------------------------------------------------------------------- */

// ✅ Provide with defensive fallbacks
provide('navigation_all', navigationAll ?? ref([]))
provide('navigation_header', navigationHeader ?? ref({}))
provide('navigation_footer', navigationFooter ?? ref({}))
provide('banner_config', banner ?? ref(undefined))
provide('site_config', site ?? ref(null))
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <AppBanner v-if="$route.meta.banner !== false" />

    <AppHeader v-if="$route.meta.header !== false" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <AppFooter v-if="$route.meta.footer !== false" />

    <ClientOnly>
      <LazyUContentSearch
        :files="searchFiles"
        :navigation="navigationAll"
      />
    </ClientOnly>

    <!-- Dev-only: review comments (global — works on all pages) -->
    <ClientOnly v-if="isDev">
      <CommentPopover />
      <CommentOverlay />
      <CommentPanel />
      <CommentSettings />
    </ClientOnly>
  </UApp>
</template>
