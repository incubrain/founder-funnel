<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import type { ReviewMode } from '../types'

const { isEnabled, reviewMode, isPanelOpen, openComments, isToolbarExpanded, toolbarPosition } = useDocComments()

const modeItems = [
  { label: 'Text', value: 'text' as ReviewMode, icon: 'i-lucide-type' },
  { label: 'Element', value: 'element' as ReviewMode, icon: 'i-lucide-box-select' },
]

const toolbarEl = ref<HTMLElement | null>(null)
const handleEl = ref<HTMLElement | null>(null)

// Compute initial position: use stored position, or default to bottom-right
function getInitialPosition() {
  const stored = toolbarPosition.value
  if (stored.x >= 0 && stored.y >= 0) return stored
  if (typeof window === 'undefined') return { x: 1140, y: 740 }
  return { x: window.innerWidth - 60, y: window.innerHeight - 60 }
}

const { style } = useDraggable(toolbarEl, {
  initialValue: getInitialPosition(),
  handle: handleEl,
  onEnd: (pos) => {
    toolbarPosition.value = { x: pos.x, y: pos.y }
  },
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="isEnabled"
      ref="toolbarEl"
      data-comment-toolbar
      class="fixed z-40 flex items-center gap-1.5 rounded-lg border border-default bg-default shadow-lg select-none"
      :class="isToolbarExpanded ? 'px-2 py-1.5' : 'p-1.5'"
      :style="style"
    >
      <!-- Collapsed: single icon button -->
      <template v-if="!isToolbarExpanded">
        <div
          ref="handleEl"
          class="cursor-grab active:cursor-grabbing"
        >
          <UButton
            icon="i-lucide-message-square-more"
            size="xs"
            color="primary"
            variant="soft"
            title="Expand toolbar (drag to move)"
            @click="isToolbarExpanded = true"
          />
        </div>
      </template>

      <!-- Expanded: full toolbar -->
      <template v-else>
        <div
          ref="handleEl"
          data-drag-handle
          class="cursor-grab active:cursor-grabbing text-muted hover:text-default"
          title="Drag to reposition"
        >
          <UIcon
            name="i-lucide-grip-vertical"
            class="size-4"
          />
        </div>

        <UButtonGroup size="xs">
          <UButton
            v-for="mode in modeItems"
            :key="mode.value"
            :icon="mode.icon"
            :color="reviewMode === mode.value ? 'primary' : 'neutral'"
            :variant="reviewMode === mode.value ? 'solid' : 'ghost'"
            :title="`${mode.label} selection mode`"
            @click="reviewMode = mode.value"
          />
        </UButtonGroup>

        <UButton
          icon="i-lucide-message-square"
          size="xs"
          :color="openComments.length ? 'primary' : 'neutral'"
          variant="soft"
          @click="isPanelOpen = true"
        >
          <template
            v-if="openComments.length"
            #trailing
          >
            <UBadge
              :label="String(openComments.length)"
              size="xs"
              color="error"
              variant="solid"
            />
          </template>
        </UButton>

        <UButton
          icon="i-lucide-minimize-2"
          size="xs"
          color="neutral"
          variant="ghost"
          title="Collapse toolbar"
          @click="isToolbarExpanded = false"
        />
      </template>
    </div>
  </Teleport>
</template>
