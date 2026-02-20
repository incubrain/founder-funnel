<script setup lang="ts">
/**
 * Cta - Call-to-action component with decorative brackets
 *
 * Simplified API: All content passed via single `cta` object.
 * For custom layouts, use slots instead of props.
 */
interface Props {
  cta?: {
    headline?: string
    message?: string
    primary?: boolean
    button: {
      label: string
      to: string
      icon: string
    }
  }
  variant?: 'outline' | 'solid' | 'soft' | 'subtle' | 'naked'
  orientation?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), {
  cta: undefined,
  variant: 'outline',
  orientation: 'vertical',
})

// Generate button links for secondary CTAs (primary CTAs use form in footer slot)
const defaultLinks = computed(() => {
  if (props.cta && !props.cta.primary) {
    return [
      {
        label: props.cta.button.label,
        to: props.cta.button.to,
        trailingIcon: props.cta.button.icon,
        color: 'secondary' as const,
        variant: 'subtle' as const,
        size: 'lg' as const,
      },
    ]
  }
  return []
})
</script>

<template>
  <div class="relative">
    <!-- Corner brackets -->
    <div class="absolute inset-0 pointer-events-none z-10">
      <div
        class="absolute -top-px -left-px w-12 h-12 border-t-2 border-l-2 rounded-tl-lg border-secondary/30"
      />
      <div
        class="absolute -top-px -right-px w-12 h-12 border-t-2 border-r-2 rounded-tr-lg border-secondary/30"
      />
      <div
        class="absolute -bottom-px -left-px w-12 h-12 border-b-2 border-l-2 rounded-bl-lg border-secondary/30"
      />
      <div
        class="absolute -bottom-px -right-px w-12 h-12 border-b-2 border-r-2 rounded-br-lg border-secondary/30"
      />
    </div>

    <UPageCTA
      :title="cta?.headline"
      :description="cta?.message"
      :orientation="orientation"
      :variant="variant"
      :links="defaultLinks"
      :ui="{
        container: 'py-16 sm:py-20',
        title: 'text-xl font-bold text-secondary',
        description: 'text-sm sm:text-base',
      }"
    >
      <!-- Expose slots -->
      <template #links>
        <slot name="links" />
      </template>

      <template
        v-if="cta?.primary"
        #footer
      >
        <div class="max-w-2xl mx-auto pt-4">
          <ConvertForm
            location="section-cta"
            submit-label="Get Access"
            layout="horizontal"
          />
        </div>
      </template>
    </UPageCTA>
  </div>
</template>
