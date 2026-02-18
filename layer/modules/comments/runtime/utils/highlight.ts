import type { CommentPriority, DocComment } from '../types'
import { findContentRoot, isBlockElement } from './anchor'

const DEBUG = import.meta.dev

export function highlightComment(comment: DocComment, contentArea: Element): boolean {
  const contentRoot = findContentRoot(contentArea)
  if (DEBUG) {
    console.groupCollapsed(`[comments:highlight] highlightComment id=${comment.id.slice(0, 8)}`)
    console.log('anchor:', JSON.stringify(comment.anchor))
    console.log('selectedText:', JSON.stringify(comment.selectedText))
    console.log('contentRoot:', contentRoot.tagName, 'children:', contentRoot.children.length)
  }

  let startNode: Element | null = null
  if (comment.anchor.headingId) {
    startNode = contentRoot.querySelector(`#${CSS.escape(comment.anchor.headingId)}`)
      || contentArea.querySelector(`#${CSS.escape(comment.anchor.headingId)}`)
    if (DEBUG) console.log('heading found:', !!startNode, startNode?.tagName)
  }

  if (startNode) {
    // Check if the selected text is inside the heading itself (not a following block)
    const headingText = startNode.textContent ?? ''
    const endPos = comment.anchor.textOffset + comment.anchor.textLength
    if (endPos <= headingText.length) {
      const slice = headingText.slice(comment.anchor.textOffset, endPos)
      if (slice === comment.selectedText) {
        if (DEBUG) console.log('text is inside heading itself, wrapping heading')
        const headingResult = wrapText(startNode, comment)
        if (headingResult) {
          if (DEBUG) console.groupEnd()
          return true
        }
      }
    }

    // Walk forward from heading, counting block elements, stopping at next heading
    let blockCount = 0
    let sibling = startNode.nextElementSibling
    while (sibling) {
      if (/^H[1-6]$/.test(sibling.tagName)) {
        if (DEBUG) console.log('hit next heading, stopping walk')
        break
      }
      if (sibling instanceof HTMLElement && isBlockElement(sibling)) {
        if (DEBUG) console.log(`  block[${blockCount}]: <${sibling.tagName}>`, sibling.textContent?.slice(0, 50))
        if (blockCount === comment.anchor.blockIndex) {
          // If the sibling is a wrapper div containing a <pre>, use the <pre> directly
          // This avoids text offset mismatch from non-content children (e.g. copy buttons)
          let target: Element = sibling
          if (sibling.tagName === 'DIV') {
            const innerPre = sibling.querySelector('pre')
            if (innerPre) target = innerPre
          }
          if (DEBUG) console.log('  → target:', `<${target.tagName}>`, 'calling wrapText')
          const result = wrapText(target, comment)
          if (result) {
            if (DEBUG) {
              console.log('  → wrapText succeeded')
              console.groupEnd()
            }
            return true
          }
          // wrapText failed (e.g. text spans across block boundaries), fall through to global fallback
          if (DEBUG) console.log('  → wrapText failed, will try global fallback')
          break
        }
        blockCount++
      }
      else if (DEBUG) {
        console.log(`  skip non-block: <${sibling.tagName}>`, sibling.className)
      }
      sibling = sibling.nextElementSibling
    }
    if (DEBUG) console.log('block walk exhausted, blockCount reached:', blockCount, 'needed:', comment.anchor.blockIndex)
  }

  // Fallback: text search across entire content area
  if (DEBUG) console.log('falling back to text search')
  const fallbackResult = fallbackTextSearch(contentArea, comment)
  if (DEBUG) {
    console.log('fallback result:', fallbackResult)
    console.groupEnd()
  }
  return fallbackResult
}

export function wrapText(block: Element, comment: DocComment): boolean {
  if (DEBUG) {
    console.log('[comments:highlight] wrapText block:', `<${block.tagName}>`, 'totalText:', JSON.stringify(block.textContent?.slice(0, 80)))
  }

  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
  let charCount = 0
  let node = walker.nextNode()
  let startNode: Node | null = null
  let startOffset = 0
  let textNodeCount = 0

  // Find the start text node based on character offset
  while (node) {
    const len = node.textContent?.length ?? 0
    textNodeCount++
    if (!startNode && charCount + len > comment.anchor.textOffset) {
      startNode = node
      startOffset = comment.anchor.textOffset - charCount
      if (DEBUG) console.log('  found start node at charCount:', charCount, 'nodeText:', JSON.stringify(node.textContent?.slice(0, 30)), 'startOffset:', startOffset)
    }
    charCount += len
    node = walker.nextNode()
  }

  if (DEBUG) console.log('  totalChars:', charCount, 'textNodes:', textNodeCount, 'needed offset:', comment.anchor.textOffset, 'needed end:', comment.anchor.textOffset + comment.anchor.textLength)

  if (!startNode) {
    if (DEBUG) console.log('  startNode not found, falling back to text search')
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
      if (DEBUG) console.log('  found end node at charCount:', charCount, 'nodeText:', JSON.stringify(node.textContent?.slice(0, 30)), 'endOffset:', endOffset)
      break
    }
    charCount += len
    node = walker2.nextNode()
  }

  if (!endNode) {
    if (DEBUG) console.log('  endNode not found, falling back to text search')
    return fallbackTextSearch(block, comment)
  }

  const range = document.createRange()
  range.setStart(startNode, Math.min(startOffset, startNode.textContent?.length ?? 0))
  range.setEnd(endNode, Math.min(endOffset, endNode.textContent?.length ?? 0))

  if (DEBUG) console.log('  range text:', JSON.stringify(range.toString()), 'expected:', JSON.stringify(comment.selectedText))

  return wrapRange(range, comment.id, comment.priority)
}

export function wrapRange(range: Range, commentId: string, priority?: CommentPriority): boolean {
  if (DEBUG) {
    console.log('[comments:highlight] wrapRange',
      'sameContainer:', range.startContainer === range.endContainer,
      'startType:', range.startContainer.nodeType,
      'rangeText:', JSON.stringify(range.toString()))
  }

  // Collect all text nodes the range touches
  const textNodes: { node: Text, start: number, end: number }[] = []
  const ancestor = range.commonAncestorContainer

  // If range is within a single text node, use simple path
  if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
    const mark = document.createElement('mark')
    mark.className = 'doc-comment-highlight'
    mark.dataset.commentId = commentId
    if (priority) mark.dataset.priority = priority
    try {
      range.surroundContents(mark)
      if (DEBUG) console.log('  single-node wrap succeeded')
      return true
    }
    catch (e) {
      if (DEBUG) console.log('  single-node wrap FAILED:', e)
      return false
    }
  }

  // Multi-node: walk text nodes under the common ancestor
  const root = ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentNode! : ancestor
  if (DEBUG) console.log('  multi-node wrap, root:', root instanceof HTMLElement ? `<${root.tagName}>` : root.nodeName)
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

  if (DEBUG) console.log('  textNodes to wrap:', textNodes.length)

  if (textNodes.length === 0) return false

  // Wrap each text segment in its own <mark> (safe: each range is within one text node)
  for (const { node, start, end } of textNodes) {
    const segmentRange = document.createRange()
    segmentRange.setStart(node, start)
    segmentRange.setEnd(node, end)

    const mark = document.createElement('mark')
    mark.className = 'doc-comment-highlight'
    mark.dataset.commentId = commentId
    if (priority) mark.dataset.priority = priority
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
  if (DEBUG) console.log('[comments:highlight] fallbackTextSearch in:', `<${root.tagName}>`, 'looking for:', JSON.stringify(comment.selectedText.slice(0, 50)))
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  let nodeCount = 0

  // First: check if any single text node contains the full string
  while (node) {
    nodeCount++
    if (node.textContent?.includes(comment.selectedText)) {
      if (DEBUG) console.log('  found in text node #' + nodeCount, 'parent:', (node.parentElement?.tagName ?? 'null'))
      const idx = node.textContent.indexOf(comment.selectedText)
      const range = document.createRange()
      range.setStart(node, idx)
      range.setEnd(node, idx + comment.selectedText.length)
      return wrapRange(range, comment.id, comment.priority)
    }
    node = walker.nextNode()
  }

  // Second: try concatenated text search (for Shiki token spans etc.)
  // Collect all text nodes, then find the selected text across them
  const allNodes: Text[] = []
  const walker2 = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let n = walker2.nextNode()
  while (n) {
    allNodes.push(n as Text)
    n = walker2.nextNode()
  }

  const fullText = allNodes.map(t => t.textContent ?? '').join('')
  const searchIdx = fullText.indexOf(comment.selectedText)
  if (searchIdx === -1) {
    if (DEBUG) console.log('  not found in', nodeCount, 'text nodes (single or concatenated)')
    return false
  }

  if (DEBUG) console.log('  found via concatenated search at idx:', searchIdx)

  // Find start and end text nodes
  let charCount = 0
  let startNode: Text | null = null
  let startOffset = 0
  let endNode: Text | null = null
  let endOffset = 0
  const endIdx = searchIdx + comment.selectedText.length

  for (const textNode of allNodes) {
    const len = textNode.textContent?.length ?? 0
    if (!startNode && charCount + len > searchIdx) {
      startNode = textNode
      startOffset = searchIdx - charCount
    }
    if (charCount + len >= endIdx) {
      endNode = textNode
      endOffset = endIdx - charCount
      break
    }
    charCount += len
  }

  if (!startNode || !endNode) return false

  const range = document.createRange()
  range.setStart(startNode, startOffset)
  range.setEnd(endNode, endOffset)
  return wrapRange(range, comment.id, comment.priority)
}
