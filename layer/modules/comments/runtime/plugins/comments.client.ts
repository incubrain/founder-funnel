import { useEventListener } from '@vueuse/core'
import type { CommentAnchor } from '../types'

export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return

  const { selection, loadComments, isEnabled } = useDocComments()
  const route = useRoute()

  const isDocsPage = computed(() =>
    route.path.startsWith('/docs'),
  )

  // Load comments on route change
  watch(
    () => route.path,
    (path) => {
      if (isDocsPage.value) loadComments(path)
    },
    { immediate: true },
  )

  // Listen for text selection via mouseup
  useEventListener(document, 'mouseup', () => {
    if (!isDocsPage.value || !isEnabled.value) return

    // Small delay to let the selection finalize
    setTimeout(() => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !sel.rangeCount) return

      const text = sel.toString().trim()
      if (text.length < 3) return

      const range = sel.getRangeAt(0)
      const contentArea = document.querySelector('[data-doc-content]')
      if (!contentArea || !contentArea.contains(range.commonAncestorContainer)) return

      const anchor = computeAnchor(range, contentArea)
      const rect = range.getBoundingClientRect()

      selection.value = { text, anchor, rect }
    }, 10)
  })
})

function computeAnchor(range: Range, contentArea: Element): CommentAnchor {
  // Walk up from start container to find the containing block element
  let block = range.startContainer as Node
  while (block && block !== contentArea) {
    if (block instanceof HTMLElement && isBlockElement(block)) break
    block = block.parentNode!
  }

  // Find nearest preceding heading
  let headingId: string | null = null
  let blockIndex = 0
  let sibling = block?.previousSibling

  // Also check the block itself if it's a heading
  if (block instanceof HTMLElement && /^H[1-6]$/.test(block.tagName)) {
    headingId = block.id || null
  }

  // Walk backwards to find heading and count blocks
  while (sibling) {
    if (sibling instanceof HTMLElement) {
      if (/^H[1-6]$/.test(sibling.tagName) && !headingId) {
        headingId = sibling.id || null
      }
      if (headingId && isBlockElement(sibling)) {
        blockIndex++
      }
    }
    sibling = sibling.previousSibling
  }

  // Compute text offset within the block
  const textOffset = getTextOffset(range.startContainer, range.startOffset, block)

  return {
    headingId,
    blockIndex,
    textOffset,
    textLength: range.toString().length,
  }
}

function isBlockElement(el: HTMLElement): boolean {
  return /^(?:P|DIV|LI|UL|OL|PRE|BLOCKQUOTE|TABLE|DL|DD|DT|FIGURE|SECTION|ARTICLE)$/
    .test(el.tagName)
}

function getTextOffset(node: Node, offset: number, container: Node): number {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  let charCount = 0
  let current = walker.nextNode()

  while (current) {
    if (current === node) {
      return charCount + offset
    }
    charCount += current.textContent?.length || 0
    current = walker.nextNode()
  }

  return offset
}
