<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import type { Collections } from '@nuxt/content'

// Derived from `Collections['team']` rather than importing the generated
// `TeamCollectionItem` interface directly — the named export depends on
// `@nuxt/content`'s per-consumer type generation lining up exactly, which
// caused TS2614 ("not exported by '@nuxt/content'") for downstream
// consumers (product-validator-ebi.2). `Collections` is the package's own
// stable generic map and matches the pattern used elsewhere in the layer
// (useContentConfig, useSearch, useNavigation).
//
// Guarded behind a conditional because the layer is typechecked against the
// CONSUMER's `Collections` map, and a consumer is free to define no `team`
// collection — an unguarded `Collections['team']` is then TS2339 ("Property
// 'team' does not exist on type 'Collections'") reported from inside
// node_modules/@incubrain/foundry (product-validator-918). The fallback is
// the shape this component actually reads, so the template stays typed
// either way.
interface FounderLike {
  email?: string
  givenName?: string
  links?: Array<{ label: string, url: string, icon?: string }>
}

// `infer` rather than `'team' extends keyof Collections ? Collections['team']`:
// the indexed access in the true branch is still checked eagerly, so it is
// TS2538 ("'team' cannot be used as an index type") wherever the key is
// absent — including the layer's own typecheck.
type TeamCollectionItem = Collections extends { team: infer T }
  ? T
  : FounderLike

interface Props {
  location: string
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
  color?: ButtonProps['color']
  rounded?: boolean
  gap?: 'tight' | 'normal' | 'relaxed'
  showEmail?: boolean // NEW: Show email button
}

const props = withDefaults(defineProps<Props>(), {
  size: 'xl',
  variant: 'subtle',
  color: 'secondary',
  rounded: true,
  gap: 'normal',
  showEmail: false, // Default: don't show email
})

const { data: founder } = await useAsyncData('app-founder', () =>
  queryCollection('team').where('isFounder', '=', true).first() as unknown as Promise<TeamCollectionItem | null>,
)
const { trackEvent } = useEvents()

const gapClasses = {
  tight: 'gap-1',
  normal: 'gap-3',
  relaxed: 'gap-4',
}

const handleClick = (platform: string, _url: string) => {
  trackEvent({
    id: `offer_click_${props.location}_${platform.toLowerCase()}`,
    type: 'offer_click',
    target: 'social_external',
  })
}

// Email link (if showEmail is true)
const emailLink = computed(() => {
  if (!props.showEmail || !founder.value?.email) return null

  return {
    label: 'Email',
    url: `mailto:${founder.value.email}`,
    icon: 'i-lucide-mail',
  }
})

// Combine email + social links
const allLinks = computed(() => {
  const links = [...(founder.value?.links || [])]

  // Prepend email link if enabled
  if (emailLink.value) {
    links.unshift(emailLink.value)
  }

  return links
})
</script>

<template>
  <div
    v-if="allLinks.length"
    :class="['flex flex-wrap', gapClasses[gap]]"
    data-testid="convert-social"
  >
    <UButton
      v-for="link in allLinks"
      :key="link.url"
      :icon="link.icon"
      :to="link.url"
      :external="!link.url.startsWith('mailto:')"
      :target="link.url.startsWith('mailto:') ? undefined : '_blank'"
      :size="size"
      :variant="variant"
      :color="color"
      :class="[
        rounded ? 'rounded-full text-default' : '',
        size === 'xl' && rounded ? 'p-3' : '',
      ]"
      :aria-label="`${link.label === 'Email' ? 'Email' : 'Visit'} ${founder?.givenName ?? ''}${link.label === 'Email' ? '' : `'s ${link.label}`}`"
      @click="handleClick(link.label, link.url)"
    />
  </div>
</template>
