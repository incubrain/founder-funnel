<script setup lang="ts">
import { CATEGORIES } from '../types'
import type { CommentCategory } from '../types'

const { isEnabled, author, globalCategory, showUserPrompt, isPanelOpen, openComments, enableCommenting } = useDocComments()

const pendingAuthor = ref('')
const pendingCategory = ref<CommentCategory>('docs')

const categoryItems = CATEGORIES.map(c => ({ label: c, value: c }))

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
  <div class="flex items-center gap-2">
    <USwitch
      :model-value="isEnabled"
      label="Review"
      size="sm"
      @update:model-value="handleToggle"
    />

    <template v-if="isEnabled">
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

    <!-- User setup modal -->
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
</template>
