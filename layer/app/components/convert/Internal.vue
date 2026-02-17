<!-- app/components/convert/Internal.vue -->
<script setup lang="ts">
import type { ButtonProps, PageCardProps } from '@nuxt/ui'
import type { OfferId } from '~~/modules/events/runtime/types/events'

interface Props {
  // Option 1: Query by slug
  offerSlug?: OfferId

  // Option 2: Explicit props (overrides query)
  to?: string
  label?: string
  icon?: string

  // Display variant
  variant?: 'button' | 'card'

  // Button styling
  size?: ButtonProps['size']
  block?: boolean
  color?: ButtonProps['color']
  buttonVariant?: ButtonProps['variant']

  // Card content (only used when variant="card")
  description?: string
  cardVariant?: PageCardProps['variant']
  spotlight?: PageCardProps['spotlight']

  // Required
  location: string
}

const { collections, routing } = useContentConfig()

const props = withDefaults(defineProps<Props>(), {
  variant: 'button',
  color: 'primary',
  buttonVariant: 'solid',
  size: 'md',
})

// 🎯 Use composable
const { data: offer } = useAsyncData(
  `offer-${props.offerSlug}`,
  () =>
    queryCollection(collections.pages)
      .path(`${routing.offers}/${props.offerSlug}`)
      .first(),
  {
    lazy: true,
    server: false,
  },
)

// Compute final values
const offerPage = computed(() => offer.value as Record<string, unknown> | null)
const cta = computed(() => ({
  to: props.to || (props.offerSlug ? `/offers/${props.offerSlug}` : '#'),
  label:
    props.label || (offerPage.value?.ctaLabel as string) || (offerPage.value?.title as string) || 'Learn More',
  icon: props.icon || (offerPage.value?.icon as string) || 'i-lucide-arrow-right',
  description: props.description || (offerPage.value?.description as string),
}))

const { trackEvent } = useEvents()

const handleClick = async () => {
  await trackEvent({
    id: `offer_click_${props.offerSlug}_${props.location}`,
    type: 'offer_click',
    target: `${props.offerSlug}_internal`,
  })
}
</script>

<template>
  <div
    class="w-full"
    data-testid="convert-internal"
  >
    <!-- Button Variant -->
    <UButton
      v-if="variant === 'button'"
      :label="cta.label"
      :trailing-icon="cta.icon"
      :color="color"
      :variant="buttonVariant"
      :size="size"
      :block="block"
      :to="cta.to"
      @click="handleClick"
    />

    <!-- Card Variant -->
    <UPageCard
      v-else-if="variant === 'card'"
      :title="cta.label"
      :description="cta.description"
      :to="cta.to"
      :variant="cardVariant"
      :spotlight="spotlight"
      :spotlight-color="color"
      @click="handleClick"
    >
      <template
        v-if="cta.icon"
        #trailing
      >
        <UIcon
          :name="cta.icon"
          class="size-5 text-secondary"
        />
      </template>
    </UPageCard>
  </div>
</template>
