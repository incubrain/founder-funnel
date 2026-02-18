<script setup lang="ts">
import type { DocComment } from '../types'
import {
  applyHighlights as doApplyHighlights,
  clearHighlights,
  findCommentAtPoint,
  getCommentRect,
  setActiveHighlight,
} from '../utils/highlight'

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
  const contentArea = document.querySelector('[data-doc-content]')
  if (!contentArea) return
  doApplyHighlights(comments.value, contentArea)
}

function handleContentClick(e: MouseEvent) {
  const id = findCommentAtPoint(e.clientX, e.clientY)
  if (id) {
    activeCommentId.value = id
    isPanelOpen.value = true
  }
}

function handleContentMouseMove(e: MouseEvent) {
  const id = findCommentAtPoint(e.clientX, e.clientY)
  if (id) {
    const comment = findComment(id)
    if (comment && comment !== hoveredComment.value) {
      hoveredComment.value = comment
      hoverRect.value = getCommentRect(id)
      setActiveHighlight(id)
    }
  }
  else if (hoveredComment.value) {
    hoveredComment.value = null
    hoverRect.value = null
    setActiveHighlight(null)
  }
}

// Attach click/hover listeners to the content area
let contentCleanup: (() => void) | null = null

function attachContentListeners() {
  detachContentListeners()
  const contentArea = document.querySelector('[data-doc-content]')
  if (!contentArea) return

  contentArea.addEventListener('click', handleContentClick)
  contentArea.addEventListener('mousemove', handleContentMouseMove)
  contentCleanup = () => {
    contentArea.removeEventListener('click', handleContentClick)
    contentArea.removeEventListener('mousemove', handleContentMouseMove)
  }
}

function detachContentListeners() {
  contentCleanup?.()
  contentCleanup = null
}

// Re-apply highlights when comments change, route changes, or toggle changes
watch([comments, () => route.path, isEnabled], () => {
  if (!isEnabled.value) {
    clearHighlights()
    detachContentListeners()
    return
  }
  nextTick(() => {
    applyHighlights()
    attachContentListeners()
  })
}, { deep: true })

// Scroll to the active comment's highlight
watch(activeCommentId, (id) => {
  if (!id) return
  setActiveHighlight(id)
  nextTick(() => {
    const rect = getCommentRect(id)
    if (!rect) return
    // Scroll element at the midpoint of the range into view
    const el = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
})

onMounted(() => {
  if (isEnabled.value) {
    nextTick(() => {
      applyHighlights()
      attachContentListeners()
    })
  }
})

onBeforeUnmount(() => {
  clearHighlights()
  detachContentListeners()
})
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
/* CSS Custom Highlight API — priority-based colors */
/* Low priority — yellow */
::highlight(comment-low) {
  background-color: rgba(250, 204, 21, 0.3);
  text-decoration: underline;
  text-decoration-color: rgb(250, 204, 21);
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}
/* Medium priority — orange */
::highlight(comment-med) {
  background-color: rgba(251, 146, 60, 0.3);
  text-decoration: underline;
  text-decoration-color: rgb(251, 146, 60);
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}
/* Critical priority — red */
::highlight(comment-critical) {
  background-color: rgba(239, 68, 68, 0.3);
  text-decoration: underline;
  text-decoration-color: rgb(239, 68, 68);
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}
/* Active/hovered comment — brighter */
::highlight(comment-active) {
  background-color: rgba(250, 204, 21, 0.6);
  text-decoration: underline;
  text-decoration-color: rgb(250, 204, 21);
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}
</style>
