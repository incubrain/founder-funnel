import type { DocComment } from '../types'
import { isBlockElement } from './anchor'

export function highlightComment(comment: DocComment, contentArea: Element): boolean {
  let startNode: Element | null = null
  if (comment.anchor.headingId) {
    startNode = contentArea.querySelector(`#${CSS.escape(comment.anchor.headingId)}`)
  }

  if (startNode) {
    // Walk forward from heading, counting block elements, stopping at next heading
    let blockCount = 0
    let sibling = startNode.nextElementSibling
    while (sibling) {
      if (/^H[1-6]$/.test(sibling.tagName)) break
      if (sibling instanceof HTMLElement && isBlockElement(sibling)) {
        if (blockCount === comment.anchor.blockIndex) {
          return wrapText(sibling, comment)
        }
        blockCount++
      }
      sibling = sibling.nextElementSibling
    }
  }

  // Fallback: text search across entire content area
  return fallbackTextSearch(contentArea, comment)
}

export function wrapText(block: Element, comment: DocComment): boolean {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
  let charCount = 0
  let node = walker.nextNode()
  let startNode: Node | null = null
  let startOffset = 0

  // Find the start text node based on character offset
  while (node) {
    const len = node.textContent?.length ?? 0
    if (!startNode && charCount + len > comment.anchor.textOffset) {
      startNode = node
      startOffset = comment.anchor.textOffset - charCount
    }
    charCount += len
    node = walker.nextNode()
  }

  if (!startNode) {
    return fallbackTextSearch(block, comment)
  }

  // Find the end text node
  const endCharPos = comment.anchor.textOffset + comment.anchor.textLength
  const walker2 = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
  let endNode: Node | null = null
  let endOffset = 0
  charCount = 0
  node = walker2.nextNode()

  while (node) {
    const len = node.textContent?.length ?? 0
    if (charCount + len >= endCharPos) {
      endNode = node
      endOffset = endCharPos - charCount
      break
    }
    charCount += len
    node = walker2.nextNode()
  }

  if (!endNode) {
    return fallbackTextSearch(block, comment)
  }

  const range = document.createRange()
  range.setStart(startNode, Math.min(startOffset, startNode.textContent?.length ?? 0))
  range.setEnd(endNode, Math.min(endOffset, endNode.textContent?.length ?? 0))

  return wrapRange(range, comment.id)
}

export function wrapRange(range: Range, commentId: string): boolean {
  // Collect all text nodes the range touches
  const textNodes: { node: Text, start: number, end: number }[] = []
  const ancestor = range.commonAncestorContainer

  // If range is within a single text node, use simple path
  if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
    const mark = document.createElement('mark')
    mark.className = 'doc-comment-highlight'
    mark.dataset.commentId = commentId
    try {
      range.surroundContents(mark)
      return true
    }
    catch {
      return false
    }
  }

  // Multi-node: walk text nodes under the common ancestor
  const root = ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentNode! : ancestor
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let current = walker.nextNode()

  while (current) {
    const compareStart = range.comparePoint(current, 0)
    const compareEnd = range.comparePoint(current, current.textContent?.length ?? 0)

    // Node is at least partially within the range
    if (compareStart <= 0 && compareEnd >= 0) {
      const start = current === range.startContainer ? range.startOffset : 0
      const end = current === range.endContainer
        ? range.endOffset
        : (current.textContent?.length ?? 0)

      if (end > start) {
        textNodes.push({ node: current as Text, start, end })
      }
    }
    current = walker.nextNode()
  }

  if (textNodes.length === 0) return false

  // Wrap each text segment in its own <mark> (safe: each range is within one text node)
  for (const { node, start, end } of textNodes) {
    const segmentRange = document.createRange()
    segmentRange.setStart(node, start)
    segmentRange.setEnd(node, end)

    const mark = document.createElement('mark')
    mark.className = 'doc-comment-highlight'
    mark.dataset.commentId = commentId
    segmentRange.surroundContents(mark)
  }

  return true
}

export function clearHighlights(root: ParentNode = document): void {
  root.querySelectorAll('mark.doc-comment-highlight').forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
  })
}

function fallbackTextSearch(root: Element, comment: DocComment): boolean {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    if (node.textContent?.includes(comment.selectedText)) {
      const idx = node.textContent.indexOf(comment.selectedText)
      const range = document.createRange()
      range.setStart(node, idx)
      range.setEnd(node, idx + comment.selectedText.length)
      return wrapRange(range, comment.id)
    }
    node = walker.nextNode()
  }
  return false
}
