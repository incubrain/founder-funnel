<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  label?: string
  size?: ButtonProps['size']
  color?: ButtonProps['color']
  variant?: ButtonProps['variant']
  trailingIcon?: string
  title: string
  description: string
  url?: string
}>(), {
  label: 'Share Page',
  size: 'xl',
  color: 'primary',
  variant: 'subtle',
  trailingIcon: 'i-lucide-share',
})

const { copied, menuItems, share } = useSocialShare(
  computed(() => ({
    title: props.title,
    description: props.description,
    url: props.url,
  })),
)

const buttonLabel = computed(() => copied.value ? 'Copied!' : props.label)
const buttonColor = computed(() => copied.value ? 'success' : props.color)
const buttonIcon = computed(() => copied.value ? 'i-lucide-check' : props.trailingIcon)
</script>

<template>
  <UPopover data-testid="convert-social-share">
    <UButton
      :label="buttonLabel"
      :size="size"
      :color="buttonColor"
      :variant="variant"
      :trailing-icon="buttonIcon"
      class="min-w-48"
    />

    <template #content>
      <div class="flex flex-col gap-1 p-2 min-w-48">
        <template
          v-for="item in menuItems"
          :key="item.value || item.type"
        >
          <div
            v-if="item.type === 'separator'"
            class="my-1 h-px bg-border"
          />

          <UButton
            v-else
            variant="ghost"
            color="neutral"
            class="justify-start"
            :leading-icon="item.icon"
            @click="share(item.value ?? '')"
          >
            <span class="flex items-center gap-2">
              {{ item.label }}
              <UBadge
                v-if="item.chip"
                size="xs"
                :color="item.chip.color"
              />
            </span>
          </UButton>
        </template>
      </div>
    </template>
  </UPopover>
</template>
