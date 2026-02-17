<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'

const { selection, addComment, author } = useDocComments()
const route = useRoute()
const commentText = ref('')
const isSubmitting = ref(false)

const isOpen = computed(() => !!selection.value)

// Virtual reference element anchored to the selection rect
const reference = computed(() => {
  if (!selection.value) return undefined
  const r = selection.value.rect
  return {
    getBoundingClientRect: () => r,
  }
})

const submit = async () => {
  if (!selection.value || !commentText.value.trim() || !author.value.trim()) return
  isSubmitting.value = true
  try {
    await addComment({
      page: route.path,
      selectedText: selection.value.text,
      anchor: selection.value.anchor,
      comment: commentText.value.trim(),
    })
    commentText.value = ''
  }
  finally {
    isSubmitting.value = false
  }
}

const dismiss = () => {
  selection.value = null
  commentText.value = ''
}

onKeyStroke('Escape', dismiss)
</script>

<template>
  <UPopover
    :open="isOpen"
    :reference="reference"
    :content="{ side: 'top', align: 'center', sideOffset: 8 }"
    :dismissible="false"
    :ui="{ content: 'w-80 p-3' }"
  >
    <!-- invisible trigger — positioning comes from :reference -->
    <span class="hidden" />

    <template #content>
      <div class="space-y-2">
        <p class="text-xs text-muted italic line-clamp-2">
          "{{ selection?.text }}"
        </p>
        <UTextarea
          v-model="commentText"
          placeholder="Leave a comment..."
          :rows="2"
          autofocus
          @keydown.meta.enter="submit"
          @keydown.ctrl.enter="submit"
        />
        <div class="flex items-center gap-2">
          <UInput
            v-model="author"
            placeholder="Your name"
            size="sm"
            class="flex-1"
          />
          <UButton
            label="Add"
            size="sm"
            :loading="isSubmitting"
            :disabled="!commentText.trim() || !author.trim()"
            @click="submit"
          />
          <UButton
            icon="i-lucide-x"
            size="sm"
            color="neutral"
            variant="ghost"
            @click="dismiss"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
