<script setup lang="ts">
const site = inject<Ref<Record<string, unknown> | null>>('site_config', ref(null))

const socials = computed(() => (site.value?.socials ?? {}) as Record<string, string>)
const links = useSocialLinks(socials)
</script>

<template>
  <div class="flex items-center gap-2">
    <template v-if="links.length">
      <UButton
        v-for="(link, index) in links"
        :key="index"
        size="sm"
        v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
      />
    </template>

    <UColorModeButton />
  </div>
</template>
