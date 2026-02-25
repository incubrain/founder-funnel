<script setup lang="ts">
const site = useSiteConfig()

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
    >
      <AppLogo :title="site.name" />
    </NuxtLink>
    <p
      v-if="mission"
      class="text-sm text-muted leading-relaxed"
    >
      {{ mission }}
    </p>
    <div class="flex items-center gap-2 text-xs text-muted">
      <UIcon
        name="i-lucide-handshake"
        class="size-4 shrink-0"
      />
      <span>In partnership with <strong>DarkSky International</strong></span>
    </div>
  </div>
</template>
