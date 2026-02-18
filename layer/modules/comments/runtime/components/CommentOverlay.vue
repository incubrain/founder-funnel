<script setup lang="ts">
import type { DocComment } from '../types'
import { highlightComment, clearHighlights } from '../utils/highlight'

const { comments, isPanelOpen, activeCommentId, isEnabled } = useDocComments()
const route = useRoute()

const hoveredComment = ref<DocComment | null>(null)
const hoverRect = ref<DOMRect | null>(null)

const hoverReference = computed(() => {
  if (!hoverRect.value) return undefined
  const r = hoverRect.value
  return { getBoundingClientRect: () => r }
})

function findComment(id: string) {
  return comments.value.find(c => c.id === id) ?? null
}

function applyHighlights() {
  clearHighlights()
  const contentArea = document.querySelector('[data-doc-content]')
  if (!contentArea) return

  for (const comment of comments.value) {
    if (comment.status === 'resolved') continue
    highlightComment(comment, contentArea)
  }

  // Attach event handlers to all highlight marks
  contentArea.querySelectorAll<HTMLElement>('mark.doc-comment-highlight').forEach((mark) => {
    const id = mark.dataset.commentId
    if (!id) return

    mark.addEventListener('click', () => {
      activeCommentId.value = id
      isPanelOpen.value = true
    })
    mark.addEventListener('mouseenter', () => {
      hoveredComment.value = findComment(id)
      hoverRect.value = mark.getBoundingClientRect()
    })
    mark.addEventListener('mouseleave', () => {
      hoveredComment.value = null
      hoverRect.value = null
    })
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

// Scroll to and flash the active comment's highlight mark
watch(activeCommentId, (id) => {
  if (!id) return
  nextTick(() => {
    const mark = document.querySelector<HTMLElement>(`mark.doc-comment-highlight[data-comment-id="${CSS.escape(id)}"]`)
    if (!mark) return
    mark.scrollIntoView({ behavior: 'smooth', block: 'center' })
    mark.classList.add('doc-comment-highlight--flash')
    setTimeout(() => mark.classList.remove('doc-comment-highlight--flash'), 1500)
  })
})

onMounted(() => {
  if (isEnabled.value) nextTick(() => applyHighlights())
})
onBeforeUnmount(() => clearHighlights())
</script>

<template>
  <slot />

  <!-- Hover preview tooltip -->
  <UPopover
    :open="!!hoveredComment"
    :reference="hoverReference"
    :content="{ side: 'top', align: 'center', sideOffset: 6 }"
    :dismissible="false"
    :ui="{ content: 'max-w-xs p-2 pointer-events-none' }"
  >
    <span class="hidden" />
    <template #content>
      <div
        v-if="hoveredComment"
        class="space-y-1"
      >
        <p class="text-sm">
          {{ hoveredComment.comment }}
        </p>
        <div class="flex items-center gap-1.5">
          <UBadge
            :label="hoveredComment.author"
            size="xs"
            color="neutral"
            variant="soft"
          />
          <UBadge
            :label="hoveredComment.category"
            size="xs"
            color="primary"
            variant="subtle"
          />
          <UBadge
            :label="hoveredComment.priority"
            size="xs"
            :color="hoveredComment.priority === 'critical' ? 'error' : hoveredComment.priority === 'med' ? 'warning' : 'neutral'"
            variant="subtle"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>

<style>
/* Default (low priority) — yellow */
.doc-comment-highlight {
  background-color: rgba(250, 204, 21, 0.3);
  border-bottom: 2px solid rgb(250, 204, 21);
  cursor: pointer;
  transition: background-color 0.2s;
}
.doc-comment-highlight:hover {
  background-color: rgba(250, 204, 21, 0.5);
}
/* Medium priority — orange */
.doc-comment-highlight[data-priority="med"] {
  background-color: rgba(251, 146, 60, 0.3);
  border-bottom-color: rgb(251, 146, 60);
}
.doc-comment-highlight[data-priority="med"]:hover {
  background-color: rgba(251, 146, 60, 0.5);
}
/* Critical priority — red */
.doc-comment-highlight[data-priority="critical"] {
  background-color: rgba(239, 68, 68, 0.3);
  border-bottom-color: rgb(239, 68, 68);
}
.doc-comment-highlight[data-priority="critical"]:hover {
  background-color: rgba(239, 68, 68, 0.5);
}
.doc-comment-highlight--flash {
  animation: comment-flash 1.5s ease-out;
}
@keyframes comment-flash {
  0%, 30% { background-color: rgba(250, 204, 21, 0.7); }
  100% { background-color: rgba(250, 204, 21, 0.3); }
}
</style>
