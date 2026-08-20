<!-- Custom Offer section. Use in content as: ::section-offer -->
<script setup lang="ts">
import { STATUS_ICONS } from '#constants'

const props = defineProps<{
  title?: string
  description?: string
  price?: string
  cta?: { label?: string, to?: string }
  features?: Array<{ title: string, icon: string }>
}>()

const { data: founder } = await useAsyncData('app-founder', () =>
  queryCollection('team').where('isFounder', '=', true).first(),
)

const displayFeatures = computed(() =>
  (props.features || []).map(feature => ({
    title: feature.title,
    icon: STATUS_ICONS[feature.icon as keyof typeof STATUS_ICONS]?.name || feature.icon,
  })),
)
</script>

<template>
  <SectionWrapper
    section-id="offer"
    has-bottom
    :title="title"
    :description="description"
    class="bg-neutral-950 text-white"
  >
    <div
      class="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-12 items-start max-w-5xl mx-auto"
    >
      <!-- Founder column -->
      <div
        v-if="founder"
        class="flex flex-col items-center lg:items-start gap-4 lg:sticky lg:top-24"
      >
        <NuxtImg
          :src="founder.avatar.src"
          :alt="founder.avatar.alt"
          class="w-28 h-28 rounded-full object-cover border border-neutral-800"
        />
        <div class="text-center lg:text-left">
          <h3 class="text-lg font-bold">
            {{ founder.givenName }} {{ founder.surname }}
          </h3>
          <p class="text-xs uppercase tracking-wider text-neutral-400">
            {{ founder.role }}
          </p>
        </div>
        <p class="text-sm text-neutral-400 italic text-center lg:text-left leading-relaxed">
          {{ founder.bio }}
        </p>
      </div>

      <!-- Offer card -->
      <div class="w-full max-w-md mx-auto lg:max-w-none">
        <UPricingPlan
          :title="title"
          :description="description"
          :price="price"
          :features="displayFeatures"
          variant="soft"
        >
          <template #button>
            <ConvertInternal
              v-if="cta?.label"
              :label="cta.label"
              :to="cta.to"
              location="offer"
              size="xl"
              block
            />
          </template>
        </UPricingPlan>
      </div>
    </div>
  </SectionWrapper>
</template>
