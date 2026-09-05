<script setup lang="ts">
interface SiteConfig {
  business?: {
    name?: string
    mission?: string
    logo?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

const siteConfig = inject<Ref<SiteConfig | null>>('site_config', ref(null))
const mission = computed(() => siteConfig.value?.business?.mission ?? '')
</script>

<template>
  <div class="flex flex-col gap-4 max-w-sm">
    <NuxtLink
      to="/"
      class="flex items-center gap-2"
      :aria-label="siteConfig?.business?.name || 'Home'"
    >
      <AppLogo :title="siteConfig?.business?.name" />
    </NuxtLink>
    <MDC
      v-if="mission"
      :value="mission"
      class="text-sm text-muted leading-relaxed"
    />
  </div>
</template>
