<script setup lang="ts">
import type { DocComment } from '../types'

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
}

function highlightComment(comment: DocComment, contentArea: Element) {
  // Find the heading section
  let startNode: Element | null = null
  if (comment.anchor.headingId) {
    startNode = contentArea.querySelector(`#${CSS.escape(comment.anchor.headingId)}`)
  }

  // Find the block at blockIndex after the heading
  const searchRoot = startNode?.parentElement || contentArea
  const blocks = Array.from(searchRoot.children).filter(el =>
    /^(?:P|DIV|LI|UL|OL|PRE|BLOCKQUOTE|TABLE|DL|FIGURE|SECTION|ARTICLE)$/.test(el.tagName),
  )

  // If we found the heading, start counting from after it
  if (startNode) {
    const headingIdx = Array.from(searchRoot.children).indexOf(startNode)
    const blocksAfterHeading = blocks.filter((_, i) => {
      const origIdx = Array.from(searchRoot.children).indexOf(blocks[i]!)
      return origIdx > headingIdx
    })
    const targetBlock = blocksAfterHeading[comment.anchor.blockIndex]
    if (targetBlock) {
      wrapText(targetBlock, comment)
      return
    }
  }

  // Fallback: text search across entire content area
  const walker = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    if (node.textContent?.includes(comment.selectedText)) {
      const idx = node.textContent.indexOf(comment.selectedText)
      const range = document.createRange()
      range.setStart(node, idx)
      range.setEnd(node, idx + comment.selectedText.length)
      wrapRange(range, comment.id)
      return
    }
    node = walker.nextNode()
  }
}

function wrapText(block: Element, comment: DocComment) {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
  let charCount = 0
  let node = walker.nextNode()

  while (node) {
    const len = node.textContent?.length || 0
    if (charCount + len > comment.anchor.textOffset) {
      const localOffset = comment.anchor.textOffset - charCount
      const range = document.createRange()
      range.setStart(node, Math.min(localOffset, len))
      range.setEnd(node, Math.min(localOffset + comment.anchor.textLength, len))
      wrapRange(range, comment.id)
      return
    }
    charCount += len
    node = walker.nextNode()
  }

  // Fallback: text search within block
  const textWalker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
  let searchNode = textWalker.nextNode()
  while (searchNode) {
    if (searchNode.textContent?.includes(comment.selectedText)) {
      const idx = searchNode.textContent.indexOf(comment.selectedText)
      const range = document.createRange()
      range.setStart(searchNode, idx)
      range.setEnd(searchNode, idx + comment.selectedText.length)
      wrapRange(range, comment.id)
      return
    }
    searchNode = textWalker.nextNode()
  }
}

function wrapRange(range: Range, commentId: string) {
  const mark = document.createElement('mark')
  mark.className = 'doc-comment-highlight'
  mark.dataset.commentId = commentId
  mark.addEventListener('click', () => {
    activeCommentId.value = commentId
    isPanelOpen.value = true
  })
  try {
    range.surroundContents(mark)
  }
  catch {
    // Range crosses element boundaries — skip gracefully
  }
}

function clearHighlights() {
  document.querySelectorAll('mark.doc-comment-highlight').forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
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
