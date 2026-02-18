<script setup lang="ts">
import { highlightComment, clearHighlights } from '../utils/highlight'

const { comments, isPanelOpen, activeCommentId, isEnabled } = useDocComments()
const route = useRoute()

function applyHighlights() {
  clearHighlights()
  const contentArea = document.querySelector('[data-doc-content]')
  if (!contentArea) return

  for (const comment of comments.value) {
    if (comment.status === 'resolved') continue
    highlightComment(comment, contentArea)
  }

  // Attach click handlers to all highlight marks
  contentArea.querySelectorAll<HTMLElement>('mark.doc-comment-highlight').forEach((mark) => {
    const id = mark.dataset.commentId
    if (id) {
      mark.addEventListener('click', () => {
        activeCommentId.value = id
        isPanelOpen.value = true
      })
    }
  })
}

// Re-apply highlights when comments change, route changes, or toggle changes
watch([comments, () => route.path, isEnabled], () => {
  if (!isEnabled.value) {
    clearHighlights()
    return
  }
  nextTick(() => applyHighlights())
}, { deep: true })

onMounted(() => {
  if (isEnabled.value) nextTick(() => applyHighlights())
})
onBeforeUnmount(() => clearHighlights())
</script>

<template>
  <slot />
</template>

<style>
.doc-comment-highlight {
  background-color: rgba(250, 204, 21, 0.3);
  border-bottom: 2px solid rgb(250, 204, 21);
  cursor: pointer;
  transition: background-color 0.2s;
}
.doc-comment-highlight:hover {
  background-color: rgba(250, 204, 21, 0.5);
}
</style>
