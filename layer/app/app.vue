<script setup lang="ts">
import { useNavigation } from '#navigation'
import { useSearch } from '#search'

const { title, seo } = useAppConfig()

const { data: site } = await useAsyncData('app-config', () =>
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

// Organization JSON-LD (product-validator-m0f.6), mapped from config/site.yml.
useOrganizationSchema(site.value?.business, site.value?.socials)

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
    <!--
      Sticky-footer pattern. Without it, when `<NuxtPage>` is empty or
      pending (SPA routes with `ssr: false`, slow async setups, etc.) the
      footer collapses against the header on first paint and jumps down
      when the page resolves — the "content rendered below footer" symptom.
      The `flex-col` wrapper makes `flex-1` reserve the remaining viewport
      height for the layout/page so the footer stays pinned to the bottom.
    -->
    <div class="min-h-screen flex flex-col">
      <NuxtLoadingIndicator color="var(--ui-primary)" />

      <AppBanner v-if="$route.meta.banner !== false" />

      <AppHeader v-if="$route.meta.header !== false" />

      <div class="flex-1">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>

      <AppFooter v-if="$route.meta.footer !== false" />
    </div>

    <ClientOnly>
      <LazyUContentSearch
        :files="searchFiles"
        :navigation="navigationAll"
      />
    </ClientOnly>
  </UApp>
</template>
