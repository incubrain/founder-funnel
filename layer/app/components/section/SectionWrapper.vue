<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { PageSectionProps, PageSectionSlots } from '@nuxt/ui'

const props = defineProps<PageSectionProps & {
  sectionId?: string
}>()

const sectionRef = ref<HTMLElement | null>(null)
const { trackEvent } = useEvents()
const hasTriggered = ref(false)

const headingId = computed(() => props.sectionId ? `heading-${props.sectionId}` : undefined)

const { stop } = useIntersectionObserver(
  sectionRef,
  ([entry]) => {
    if (!entry?.isIntersecting || hasTriggered.value) return
    hasTriggered.value = true
    if (props.sectionId) {
      trackEvent({ id: `section_view_${props.sectionId}`, type: 'section_view', target: props.sectionId })
    }
    stop()
  },
  { threshold: 0.2 },
)

defineSlots<PageSectionSlots>()
</script>

<template>
  <div ref="sectionRef">
    <UPageSection
      v-bind="$props"
      :id="sectionId"
      :aria-labelledby="headingId"
      :data-testid="sectionId ? `section-${sectionId}` : undefined"
    >
      <!-- Inject heading ID for aria-labelledby when title comes from prop -->
      <template
        v-if="headingId && !$slots.title && $props.title"
        #title
      >
        <span :id="headingId">{{ $props.title }}</span>
      </template>
      <!-- Pass through all parent slots, wrapping title slot with heading ID -->
      <template
        v-for="(_, slot) in $slots"
        :key="slot"
        #[slot]="scope"
      >
        <span
          v-if="slot === 'title' && headingId"
          :id="headingId"
        >
          <slot
            name="title"
            v-bind="scope || {}"
          />
        </span>
        <slot
          v-else
          :name="(slot as keyof PageSectionSlots)"
          v-bind="scope || {}"
        />
      </template>
    </UPageSection>
  </div>
</template>
