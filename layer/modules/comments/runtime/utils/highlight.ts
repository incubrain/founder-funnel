import type { DocComment } from '../types'
import { isElementAnchor } from '../types'
import { buildNormalizedText, findContentRoot, isBlockElement } from './anchor'

const DEBUG = import.meta.dev

/** Map from commentId → Range for click/hover detection */
const commentRanges = new Map<string, Range>()

/**
 * Check if the CSS Custom Highlight API is available.
 */
function hasHighlightAPI(): boolean {
  return typeof CSS !== 'undefined' && 'highlights' in CSS
}

/**
 * Find a Range in the DOM that matches the comment's anchor.
 * Uses a two-pass strategy:
 * 1. Fast path: heading → blockIndex → textOffset (existing single-block logic)
 * 2. Text-quote search: normalized text search with prefix/suffix disambiguation
 */
export function findCommentRange(comment: DocComment, contentArea: Element): Range | null {
  if (isElementAnchor(comment.anchor)) return null
  const contentRoot = findContentRoot(contentArea)
  if (DEBUG) {
    console.groupCollapsed(`[comments:highlight] findCommentRange id=${comment.id.slice(0, 8)}`)
    console.log('anchor:', JSON.stringify(comment.anchor))
    console.log('selectedText:', JSON.stringify(comment.selectedText.slice(0, 60)))
  }

  // Fast path: try single-block anchoring
  const fastRange = tryFastPath(comment, contentRoot, contentArea)
  if (fastRange) {
    if (DEBUG) {
      console.log('fast path succeeded')
      console.groupEnd()
    }
    return fastRange
  }

  // Text-quote search: find text across any element boundaries
  const quoteRange = textQuoteSearch(comment, contentRoot)
  if (quoteRange) {
    if (DEBUG) {
      console.log('text-quote search succeeded')
      console.groupEnd()
    }
    return quoteRange
  }

  if (DEBUG) {
    console.warn('all strategies failed')
    console.groupEnd()
  }
  return null
}

/**
 * Fast path: heading → blockIndex → single-block text offset.
 * Returns a Range if the text is found entirely within one block element.
 */
function tryFastPath(comment: DocComment, contentRoot: Element, contentArea: Element): Range | null {
  const { anchor } = comment

  let startNode: Element | null = null
  if (anchor.headingId) {
    startNode = contentRoot.querySelector(`#${CSS.escape(anchor.headingId)}`)
      || contentArea.querySelector(`#${CSS.escape(anchor.headingId)}`)
  }

  if (!startNode) return null

  // Check if text is inside the heading itself
  const headingText = startNode.textContent ?? ''
  const endPos = anchor.textOffset + anchor.textLength
  if (endPos <= headingText.length) {
    const slice = headingText.slice(anchor.textOffset, endPos)
    if (slice === comment.selectedText) {
      if (DEBUG) console.log('text is inside heading, creating range')
      return createRangeInElement(startNode, anchor.textOffset, anchor.textLength)
    }
  }

  // Walk forward from heading to find the target block
  let blockCount = 0
  let sibling = startNode.nextElementSibling
  while (sibling) {
    if (/^H[1-6]$/.test(sibling.tagName)) break
    if (sibling instanceof HTMLElement && isBlockElement(sibling)) {
      if (blockCount === anchor.blockIndex) {
        // Drill into wrapper divs to find the actual content element
        let target: Element = sibling
        if (sibling.tagName === 'DIV') {
          const innerPre = sibling.querySelector('pre')
          if (innerPre) target = innerPre
        }
        const range = createRangeInElement(target, anchor.textOffset, anchor.textLength)
        if (range) {
          // Verify the range text matches what we expect
          const rangeText = range.toString()
          if (rangeText === comment.selectedText || rangeText === anchor.exact) {
            return range
          }
          if (DEBUG) console.log('fast path range text mismatch:', JSON.stringify(rangeText.slice(0, 40)), 'vs', JSON.stringify(comment.selectedText.slice(0, 40)))
        }
        break
      }
      blockCount++
    }
    sibling = sibling.nextElementSibling
  }

  return null
}

/**
 * Create a Range within a single element using character offset + length.
 */
function createRangeInElement(element: Element, textOffset: number, textLength: number): Range | null {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let charCount = 0
  let node = walker.nextNode()
  let startNode: Node | null = null
  let startOffset = 0

  while (node) {
    const len = node.textContent?.length ?? 0
    if (!startNode && charCount + len > textOffset) {
      startNode = node
      startOffset = textOffset - charCount
    }
    charCount += len
    node = walker.nextNode()
  }

  if (!startNode) return null

  // Find end node
  const endCharPos = textOffset + textLength
  const walker2 = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
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

  if (!endNode) return null

  const range = document.createRange()
  range.setStart(startNode, Math.min(startOffset, startNode.textContent?.length ?? 0))
  range.setEnd(endNode, Math.min(endOffset, endNode.textContent?.length ?? 0))
  return range
}

/**
 * Text-quote search: find the comment's text across any element boundaries.
 * Uses prefix/suffix for disambiguation when multiple matches exist.
 */
function textQuoteSearch(comment: DocComment, contentRoot: Element): Range | null {
  const { text: normalizedText, nodes } = buildNormalizedText(contentRoot)

  // Try search candidates in priority order:
  // 1. anchor.exact (normalized text with \n at block boundaries — new format)
  // 2. comment.selectedText (from sel.toString() — may have \n\n between blocks)
  // 3. selectedText with collapsed whitespace (backwards compat for old comments
  //    where exact was from range.toString() without newlines)
  const candidates: string[] = []
  if (comment.anchor.exact) candidates.push(comment.anchor.exact)
  if (comment.selectedText && comment.selectedText !== comment.anchor.exact) {
    candidates.push(comment.selectedText)
  }
  // Collapsed whitespace fallback: replace all whitespace runs with single space
  const collapsed = (comment.anchor.exact ?? comment.selectedText).replace(/\s+/g, ' ')
  if (!candidates.includes(collapsed)) candidates.push(collapsed)

  let searchText = ''
  let matches: number[] = []

  for (const candidate of candidates) {
    const found: number[] = []
    let searchFrom = 0
    while (true) {
      const idx = normalizedText.indexOf(candidate, searchFrom)
      if (idx === -1) break
      found.push(idx)
      searchFrom = idx + 1
    }
    if (found.length > 0) {
      searchText = candidate
      matches = found
      if (DEBUG) console.log('text-quote search matched candidate:', JSON.stringify(candidate.slice(0, 60)), 'matches:', found.length)
      break
    }
  }

  if (matches.length === 0) {
    // Last resort: try whitespace-insensitive search on normalized text
    const normalizedCollapsed = normalizedText.replace(/\s+/g, ' ')
    const searchCollapsed = (comment.anchor.exact ?? comment.selectedText).replace(/\s+/g, ' ')
    const idx = normalizedCollapsed.indexOf(searchCollapsed)
    if (idx !== -1) {
      // Map collapsed position back to original normalized text position
      // by counting characters through the original text
      let origIdx = 0
      let collapsedIdx = 0
      while (collapsedIdx < idx && origIdx < normalizedText.length) {
        if (/\s/.test(normalizedText[origIdx]!)) {
          // Skip whitespace run in original
          while (origIdx < normalizedText.length && /\s/.test(normalizedText[origIdx]!)) origIdx++
          collapsedIdx++ // One space in collapsed
        }
        else {
          origIdx++
          collapsedIdx++
        }
      }
      const startInOrig = origIdx
      // Find end position
      const endCollapsed = idx + searchCollapsed.length
      while (collapsedIdx < endCollapsed && origIdx < normalizedText.length) {
        if (/\s/.test(normalizedText[origIdx]!)) {
          while (origIdx < normalizedText.length && /\s/.test(normalizedText[origIdx]!)) origIdx++
          collapsedIdx++
        }
        else {
          origIdx++
          collapsedIdx++
        }
      }
      searchText = normalizedText.slice(startInOrig, origIdx)
      matches = [startInOrig]
      if (DEBUG) console.log('text-quote search: whitespace-insensitive fallback matched at', startInOrig)
    }
  }

  if (matches.length === 0) {
    if (DEBUG) console.log('no matches found in normalized text for any candidate')
    return null
  }

  if (DEBUG) console.log('text-quote search, normalizedText length:', normalizedText.length, 'searchText length:', searchText.length)

  if (DEBUG) console.log('found', matches.length, 'match(es)')

  // Use prefix/suffix to disambiguate
  let bestMatch = matches[0]!
  if (matches.length > 1 && (comment.anchor.prefix || comment.anchor.suffix)) {
    let bestScore = -1
    for (const matchIdx of matches) {
      let score = 0
      if (comment.anchor.prefix) {
        const actual = normalizedText.slice(Math.max(0, matchIdx - comment.anchor.prefix.length), matchIdx)
        score += commonSuffixLength(actual, comment.anchor.prefix)
      }
      if (comment.anchor.suffix) {
        const endIdx = matchIdx + searchText.length
        const actual = normalizedText.slice(endIdx, endIdx + comment.anchor.suffix.length)
        score += commonPrefixLength(actual, comment.anchor.suffix)
      }
      if (score > bestScore) {
        bestScore = score
        bestMatch = matchIdx
      }
    }
  }

  // Map the match position back to DOM text nodes
  const startIdx = bestMatch
  const endIdx = bestMatch + searchText.length

  let startNode: Text | null = null
  let startOffset = 0
  let endNode: Text | null = null
  let endOffset = 0

  for (const entry of nodes) {
    if (!startNode && entry.end > startIdx) {
      startNode = entry.node
      startOffset = startIdx - entry.start
    }
    if (entry.end >= endIdx) {
      endNode = entry.node
      endOffset = endIdx - entry.start
      break
    }
  }

  if (!startNode || !endNode) return null

  const range = document.createRange()
  range.setStart(startNode, Math.min(startOffset, startNode.textContent?.length ?? 0))
  range.setEnd(endNode, Math.min(endOffset, endNode.textContent?.length ?? 0))

  if (DEBUG) console.log('created range:', JSON.stringify(range.toString().slice(0, 60)))
  return range
}

function commonSuffixLength(a: string, b: string): number {
  let i = 0
  while (i < a.length && i < b.length && a[a.length - 1 - i] === b[b.length - 1 - i]) i++
  return i
}

function commonPrefixLength(a: string, b: string): number {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

/**
 * Apply highlights for all comments using the CSS Custom Highlight API.
 * Returns the commentRanges map for click/hover detection.
 */
export function applyHighlights(comments: DocComment[], contentArea: Element): Map<string, Range> {
  clearHighlights()

  if (!hasHighlightAPI()) {
    if (DEBUG) console.warn('[comments:highlight] CSS Custom Highlight API not available')
    return commentRanges
  }

  const priorityGroups = new Map<string, Range[]>()

  if (DEBUG) console.groupCollapsed(`[comments:highlight] applyHighlights — ${comments.length} comments`)

  for (const comment of comments) {
    if (comment.status === 'resolved') continue
    // Element-type anchors are handled by CommentOverlay's outline logic
    if (isElementAnchor(comment.anchor)) continue

    const range = findCommentRange(comment, contentArea)
    if (range) {
      commentRanges.set(comment.id, range)

      const priority = comment.priority ?? 'low'
      if (!priorityGroups.has(priority)) priorityGroups.set(priority, [])
      priorityGroups.get(priority)!.push(range)

      if (DEBUG) console.log(`  ✓ ${comment.id.slice(0, 8)} → range created (priority: ${priority})`)
    }
    else {
      if (DEBUG) console.warn(`  ✗ FAILED ${comment.id.slice(0, 8)}: ${JSON.stringify(comment.selectedText.slice(0, 50))}`)
    }
  }

  // Register highlights grouped by priority
  for (const [priority, ranges] of priorityGroups) {
    CSS.highlights.set(`comment-${priority}`, new Highlight(...ranges))
  }

  if (DEBUG) {
    console.log(`  ${commentRanges.size} ranges created, ${priorityGroups.size} highlight groups registered`)
    console.groupEnd()
  }

  return commentRanges
}

/**
 * Clear all comment highlights from the CSS Custom Highlight registry.
 */
export function clearHighlights(): void {
  commentRanges.clear()
  if (!hasHighlightAPI()) return
  const toDelete: string[] = []
  CSS.highlights.forEach((_highlight, name) => {
    if (name.startsWith('comment-')) toDelete.push(name)
  })
  for (const name of toDelete) {
    CSS.highlights.delete(name)
  }
}

/**
 * Set the "active" highlight for a specific comment (e.g., on click/hover).
 * Moves the comment's range into a separate highlight group for distinct styling.
 */
export function setActiveHighlight(commentId: string | null): void {
  if (!hasHighlightAPI()) return
  if (!commentId) {
    CSS.highlights.delete('comment-active')
    return
  }
  const range = commentRanges.get(commentId)
  if (range) {
    CSS.highlights.set('comment-active', new Highlight(range))
  }
}

/**
 * Find which comment is at the given viewport coordinates.
 * Uses caretPositionFromPoint/caretRangeFromPoint + Range.isPointInRange.
 */
export function findCommentAtPoint(x: number, y: number): string | null {
  // Get the caret position at the click point
  let offsetNode: Node | null = null
  let offset = 0

  if ('caretPositionFromPoint' in document) {
    const pos = (document as unknown as { caretPositionFromPoint(x: number, y: number): { offsetNode: Node, offset: number } | null }).caretPositionFromPoint(x, y)
    if (pos) {
      offsetNode = pos.offsetNode
      offset = pos.offset
    }
  }
  else if ('caretRangeFromPoint' in document) {
    const range = document.caretRangeFromPoint(x, y)
    if (range) {
      offsetNode = range.startContainer
      offset = range.startOffset
    }
  }

  if (!offsetNode) return null

  for (const [commentId, range] of commentRanges) {
    try {
      if (range.isPointInRange(offsetNode, offset)) {
        return commentId
      }
    }
    catch {
      // isPointInRange can throw if nodes are in different documents
    }
  }

  return null
}

/**
 * Get the bounding rect of a comment's highlight range.
 */
export function getCommentRect(commentId: string): DOMRect | null {
  const range = commentRanges.get(commentId)
  return range ? range.getBoundingClientRect() : null
}
