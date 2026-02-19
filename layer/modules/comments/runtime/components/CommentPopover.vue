<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { CATEGORIES, PRIORITIES, isElementAnchor } from '../types'
import type { CommentCategory, CommentPriority } from '../types'
import { captureElementScreenshot } from '../utils/element-select'

const { selection, addComment, globalCategory } = useDocComments()
const route = useRoute()
const commentText = ref('')
const isSubmitting = ref(false)
const category = ref<CommentCategory>(globalCategory.value)
const priority = ref<CommentPriority>('low')

const isOpen = computed(() => !!selection.value)
const isElementMode = computed(() => selection.value && isElementAnchor(selection.value.anchor))

// Reset per-comment fields when a new selection opens
watch(isOpen, (open) => {
  if (open) {
    category.value = globalCategory.value
    priority.value = 'low'
  }
})

// Virtual reference element anchored to the selection rect
const reference = computed(() => {
  if (!selection.value) return undefined
  const r = selection.value.rect
  return {
    getBoundingClientRect: () => r,
  }
})

const truncatedText = computed(() => {
  const text = selection.value?.text ?? ''
  return text.length > 120 ? `${text.slice(0, 120)}...` : text
})

const categoryItems = CATEGORIES.map(c => ({ label: c, value: c }))
const priorityItems = PRIORITIES.map(p => ({ label: p, value: p }))

const submit = async () => {
  if (!selection.value || !commentText.value.trim()) return
  isSubmitting.value = true
  try {
    // Capture screenshot at submit time (not selection time)
    let screenshot: string | undefined
    if (selection.value.element) {
      screenshot = await captureElementScreenshot(selection.value.element)
    }

    await addComment({
      page: route.path,
      selectedText: selection.value.text,
      anchor: selection.value.anchor,
      comment: commentText.value.trim(),
      category: category.value,
      priority: priority.value,
      screenshot,
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
      <div
        class="space-y-2"
        data-comment-popover
      >
        <!-- Element mode: show screenshot + element info -->
        <template v-if="isElementMode">
          <div class="flex items-center gap-1.5 text-xs text-muted">
            <UIcon
              name="i-lucide-box-select"
              class="size-3.5"
            />
            <span class="font-mono">{{ truncatedText }}</span>
          </div>
          <p
            v-if="isElementAnchor(selection!.anchor) && selection!.anchor.filepath"
            class="text-[10px] text-muted/60 font-mono truncate"
          >
            {{ selection!.anchor.filepath }}
          </p>
        </template>

        <!-- Text mode: show quoted text -->
        <p
          v-else
          class="text-xs text-muted italic line-clamp-2"
        >
          "{{ truncatedText }}"
        </p>

        <UTextarea
          v-model="commentText"
          placeholder="Leave a comment..."
          :rows="4"
          class="w-full"
          @keydown.meta.enter="submit"
          @keydown.ctrl.enter="submit"
        />

        <div class="flex items-center gap-2">
          <USelect
            v-model="category"
            :items="categoryItems"
            size="xs"
            class="flex-1"
            placeholder="Category"
          />
          <USelect
            v-model="priority"
            :items="priorityItems"
            size="xs"
            class="flex-1"
            placeholder="Priority"
          />
        </div>

        <div class="flex items-center gap-2">
          <UButton
            label="Add"
            size="sm"
            :loading="isSubmitting"
            :disabled="!commentText.trim()"
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
