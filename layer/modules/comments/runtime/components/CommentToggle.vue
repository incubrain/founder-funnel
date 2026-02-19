<script setup lang="ts">
import { CATEGORIES } from '../types'
import type { CommentCategory } from '../types'

const { isEnabled, enableCommenting, author, showUserPrompt, globalCategory } = useDocComments()

const pendingAuthor = ref('')
const pendingCategory = ref<CommentCategory>('docs')
const categoryItems = CATEGORIES.map(c => ({ label: c, value: c }))

function handleToggle(value: boolean) {
  if (value) enableCommenting()
  else isEnabled.value = false
}

function confirmUser() {
  if (!pendingAuthor.value.trim()) return
  author.value = pendingAuthor.value.trim()
  globalCategory.value = pendingCategory.value
  showUserPrompt.value = false
  isEnabled.value = true
}
</script>

<template>
  <USwitch
    :model-value="isEnabled"
    label="Review"
    size="sm"
    @update:model-value="handleToggle"
  />

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
          <USelect
            v-model="pendingCategory"
            :items="categoryItems"
            size="sm"
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
</template>
