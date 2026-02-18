<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { CATEGORIES } from '../types'
import type { CommentCategory, ReviewMode } from '../types'

const { isEnabled, author, globalCategory, reviewMode, showUserPrompt, isPanelOpen, openComments, enableCommenting, toolbarPosition } = useDocComments()

const pendingAuthor = ref('')
const pendingCategory = ref<CommentCategory>('docs')

const categoryItems = CATEGORIES.map(c => ({ label: c, value: c }))

const modeItems = [
  { label: 'Text', value: 'text' as ReviewMode, icon: 'i-lucide-type' },
  { label: 'Element', value: 'element' as ReviewMode, icon: 'i-lucide-box-select' },
]

const toolbarEl = ref<HTMLElement | null>(null)
const handleEl = ref<HTMLElement | null>(null)

const { style } = useDraggable(toolbarEl, {
  initialValue: toolbarPosition.value,
  handle: handleEl,
  onEnd: (pos) => {
    toolbarPosition.value = { x: pos.x, y: pos.y }
  },
})

function confirmUser() {
  if (!pendingAuthor.value.trim()) return
  author.value = pendingAuthor.value.trim()
  globalCategory.value = pendingCategory.value
  showUserPrompt.value = false
  isEnabled.value = true
}

function handleToggle(value: boolean) {
  if (value) {
    enableCommenting()
  }
  else {
    isEnabled.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      ref="toolbarEl"
      data-comment-toolbar
      class="fixed z-40 flex items-center gap-1.5 rounded-lg border border-default bg-default shadow-lg px-2 py-1.5 select-none"
      :style="style"
    >
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

      <USwitch
        :model-value="isEnabled"
        label="Review"
        size="sm"
        @update:model-value="handleToggle"
      />

      <template v-if="isEnabled">
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
      </template>

      <UModal
        v-model:open="showUserPrompt"
        title="Set up reviewer identity"
        description="Your name is attached to every comment you leave."
      >
        <span class="hidden" />

        <template #body>
          <div class="space-y-4">
            <UFormField
              label="Your name"
              required
            >
              <UInput
                v-model="pendingAuthor"
                placeholder="e.g. drew"
                icon="i-lucide-user"
                @keydown.enter="confirmUser"
              />
            </UFormField>

            <UFormField label="Default category">
              <URadioGroup
                v-model="pendingCategory"
                :items="categoryItems"
                orientation="horizontal"
              />
            </UFormField>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="showUserPrompt = false"
            />
            <UButton
              label="Start reviewing"
              :disabled="!pendingAuthor.trim()"
              @click="confirmUser"
            />
          </div>
        </template>
      </UModal>
    </div>
  </Teleport>
</template>
