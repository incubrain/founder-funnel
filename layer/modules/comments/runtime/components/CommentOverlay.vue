<script setup lang="ts">
import type { DocComment } from '../types'
import { isElementAnchor } from '../types'
import { resolveContentArea } from '../utils/anchor'
import {
  applyHighlights as doApplyHighlights,
  clearHighlights,
  findCommentAtPoint,
  getCommentRangeById,
  getCommentRect,
  setActiveHighlight,
} from '../utils/highlight'
import { findElementByAnchor } from '../utils/element-select'

const { comments, isPanelOpen, activeCommentId, isEnabled, reviewMode } = useDocComments()
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
  const contentArea = resolveContentArea()
  if (!contentArea) return
  doApplyHighlights(comments.value, contentArea)
  applyElementOutlines()
}

// --- Element comment outlines ---
const elementOutlineCleanups: (() => void)[] = []

function clearElementOutlines() {
  for (const cleanup of elementOutlineCleanups) cleanup()
  elementOutlineCleanups.length = 0
}

function applyElementOutlines() {
  clearElementOutlines()
  const contentArea = resolveContentArea()
  if (!contentArea) return

  for (const comment of comments.value) {
    if (comment.status !== 'open' || !isElementAnchor(comment.anchor)) continue
    const el = findElementByAnchor(comment.anchor, contentArea)
    if (!el || !(el instanceof HTMLElement)) continue

    const priority = comment.priority
    const cls = `comment-element-outline-${priority}`
    el.classList.add('comment-element-outline', cls)
    el.dataset.commentElementId = comment.id

    elementOutlineCleanups.push(() => {
      el.classList.remove('comment-element-outline', cls)
      delete el.dataset.commentElementId
    })
  }
}

function handleContentClick(e: MouseEvent) {
  // Check element outlines first
  const target = e.target as Element
  const outlinedEl = target.closest?.('[data-comment-element-id]')
  if (outlinedEl) {
    const id = (outlinedEl as HTMLElement).dataset.commentElementId
    if (id) {
      activeCommentId.value = id
      isPanelOpen.value = true
      return
    }
  }

  // Then check text highlights
  if (reviewMode.value === 'text') {
    const id = findCommentAtPoint(e.clientX, e.clientY)
    if (id) {
      activeCommentId.value = id
      isPanelOpen.value = true
    }
  }
}

function handleContentMouseMove(e: MouseEvent) {
  // Check element outlines
  const target = e.target as Element
  const outlinedEl = target.closest?.('[data-comment-element-id]')
  if (outlinedEl) {
    const id = (outlinedEl as HTMLElement).dataset.commentElementId
    if (id) {
      const comment = findComment(id)
      if (comment && comment !== hoveredComment.value) {
        hoveredComment.value = comment
        hoverRect.value = outlinedEl.getBoundingClientRect()
      }
      return
    }
  }

  // Check text highlights
  if (reviewMode.value === 'text') {
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
  else if (hoveredComment.value && !outlinedEl) {
    hoveredComment.value = null
    hoverRect.value = null
  }
}

// Attach click/hover listeners
let contentCleanup: (() => void) | null = null

function attachContentListeners() {
  detachContentListeners()
  // Listen on document body for all pages
  document.body.addEventListener('click', handleContentClick)
  document.body.addEventListener('mousemove', handleContentMouseMove)
  contentCleanup = () => {
    document.body.removeEventListener('click', handleContentClick)
    document.body.removeEventListener('mousemove', handleContentMouseMove)
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
    clearElementOutlines()
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
  const comment = findComment(id)
  if (!comment) return

  if (isElementAnchor(comment.anchor)) {
    const contentArea = resolveContentArea()
    if (!contentArea) return
    const el = findElementByAnchor(comment.anchor, contentArea)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  else {
    // Scroll to text highlight using the range's start container
    const range = getCommentRangeById(id)
    if (range) {
      const startNode = range.startContainer
      const el = startNode.nodeType === Node.TEXT_NODE ? startNode.parentElement : startNode as Element
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      nextTick(() => setActiveHighlight(id))
    }
  }
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
  clearElementOutlines()
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

/* Element mode — hover outline when selecting */
.comment-element-hover {
  outline: 2px dashed rgb(59, 130, 246) !important;
  outline-offset: 2px;
  cursor: crosshair;
}

/* Element comment outlines — persistent for existing comments */
.comment-element-outline {
  outline-style: solid !important;
  outline-width: 2px !important;
  outline-offset: 2px;
  position: relative;
}
.comment-element-outline-low {
  outline-color: rgb(250, 204, 21) !important;
}
.comment-element-outline-med {
  outline-color: rgb(251, 146, 60) !important;
}
.comment-element-outline-critical {
  outline-color: rgb(239, 68, 68) !important;
}
</style>
