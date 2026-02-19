import type { TextAnchor } from '../types'

const DEBUG = import.meta.dev
const CONTEXT_CHARS = 32

/**
 * Resolve the content area for commenting.
 * Falls back from [data-doc-content] → <main> → document.body.
 */
export function resolveContentArea(): Element | null {
  return document.querySelector('[data-doc-content]')
    ?? document.querySelector('main')
    ?? document.body
}

export function isBlockElement(el: HTMLElement): boolean {
  return /^(?:P|DIV|LI|UL|OL|PRE|BLOCKQUOTE|TABLE|DL|DD|DT|FIGURE|SECTION|ARTICLE|H[1-6])$/
    .test(el.tagName)
}

/**
 * Find the "content root" — the actual parent element that contains headings and blocks as direct children.
 * Nuxt Content renders: [data-doc-content] > div ([...slug].vue) > div (ContentRenderer) > h2, p, div, ...
 * We walk down single-child div chains to find where the real content lives.
 */
export function findContentRoot(contentArea: Element): Element {
  let root = contentArea
  while (root.children.length === 1 && root.firstElementChild?.tagName === 'DIV') {
    root = root.firstElementChild
  }
  return root
}

/**
 * Walk up from a node to find its ancestor that is a direct child of contentRoot.
 * This is the "sibling-level" element that can be compared with headings.
 */
function findSiblingLevelAncestor(node: Node, contentRoot: Element): Element | null {
  let current = node
  while (current && current.parentNode !== contentRoot) {
    current = current.parentNode!
  }
  return current instanceof HTMLElement ? current : null
}

export function getTextOffset(node: Node, offset: number, container: Node): number {
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

/**
 * Build a normalized text string from a DOM subtree, inserting '\n' at block boundaries.
 * This matches what Range.toString() produces (which adds newlines between blocks).
 */
export function buildNormalizedText(root: Element): { text: string, nodes: { node: Text, start: number, end: number }[] } {
  const nodes: { node: Text, start: number, end: number }[] = []
  let text = ''
  let lastBlockParent: Element | null = null

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let current = walker.nextNode()

  while (current) {
    // Find the nearest block ancestor of this text node
    let blockParent: Element | null = current.parentElement
    while (blockParent && blockParent !== root && !(blockParent instanceof HTMLElement && isBlockElement(blockParent))) {
      blockParent = blockParent.parentElement
    }

    // Insert newline when crossing block boundaries
    if (lastBlockParent && blockParent !== lastBlockParent && !lastBlockParent.contains(blockParent)) {
      text += '\n'
    }
    lastBlockParent = blockParent

    const content = current.textContent ?? ''
    const start = text.length
    text += content
    nodes.push({ node: current as Text, start, end: text.length })

    current = walker.nextNode()
  }

  return { text, nodes }
}

/**
 * Extract surrounding context text (prefix/suffix) and normalized exact text
 * from a Range's position in the content area.
 *
 * The `exact` field uses the normalized text (with \n at block boundaries),
 * which matches what buildNormalizedText produces during search — ensuring
 * indexOf will find the text even for cross-element selections.
 */
function extractContext(range: Range, contentArea: Element): { prefix: string, suffix: string, exact: string } {
  const { text, nodes } = buildNormalizedText(contentArea)

  // Find where the range's start node appears in our normalized text
  const startNode = range.startContainer
  const endNode = range.endContainer
  let rangeStart = -1
  let rangeEnd = -1

  for (const entry of nodes) {
    if (entry.node === startNode) {
      rangeStart = entry.start + range.startOffset
    }
    if (entry.node === endNode) {
      rangeEnd = entry.start + range.endOffset
      break
    }
  }

  if (rangeStart === -1 || rangeEnd === -1) {
    return { prefix: '', suffix: '', exact: range.toString() }
  }

  const prefix = text.slice(Math.max(0, rangeStart - CONTEXT_CHARS), rangeStart)
  const suffix = text.slice(rangeEnd, rangeEnd + CONTEXT_CHARS)
  const exact = text.slice(rangeStart, rangeEnd)

  return { prefix, suffix, exact }
}

export function computeAnchor(range: Range, contentArea: Element): TextAnchor {
  const contentRoot = findContentRoot(contentArea)

  // Walk up from startContainer to find the containing block element
  let block = range.startContainer as Node
  if (DEBUG) {
    console.groupCollapsed('[comments:anchor] computeAnchor')
    console.log('startContainer:', range.startContainer, 'nodeType:', range.startContainer.nodeType)
    console.log('selectedText:', JSON.stringify(range.toString()))
    console.log('contentRoot:', contentRoot.tagName, 'children:', contentRoot.children.length)
  }

  while (block && block !== contentArea && block !== contentRoot) {
    if (block instanceof HTMLElement && isBlockElement(block)) break
    block = block.parentNode!
  }

  if (DEBUG) {
    console.log('found block:', block instanceof HTMLElement ? `<${block.tagName}>` : block.nodeName)
  }

  // Find the sibling-level ancestor (direct child of contentRoot)
  const siblingLevel = findSiblingLevelAncestor(block, contentRoot)

  if (DEBUG) {
    console.log('siblingLevel:', siblingLevel ? `<${siblingLevel.tagName}> class=${siblingLevel.className?.split(' ').slice(0, 2).join(' ')}` : 'null')
  }

  // Determine walkStart: for LI, escalate to UL/OL
  let walkStart = siblingLevel || block
  if (block instanceof HTMLElement && block.tagName === 'LI') {
    const listParent = block.parentElement
    if (listParent && /^(?:UL|OL)$/.test(listParent.tagName)) {
      walkStart = findSiblingLevelAncestor(listParent, contentRoot) || listParent
    }
  }

  // Check if the walkStart itself is a heading
  let headingId: string | null = null
  if (walkStart instanceof HTMLElement && /^H[1-6]$/.test(walkStart.tagName)) {
    headingId = walkStart.id || null
  }

  // Pass 1: walk backwards from walkStart to find the nearest heading
  if (!headingId) {
    let sibling = (walkStart as ChildNode).previousElementSibling
    if (DEBUG) console.log('walking backwards from:', walkStart instanceof HTMLElement ? `<${(walkStart as HTMLElement).tagName}>` : walkStart.nodeName)
    while (sibling) {
      if (DEBUG) console.log('  prev:', `<${sibling.tagName} id="${sibling.id}">`)
      if (/^H[1-6]$/.test(sibling.tagName)) {
        headingId = sibling.id || null
        break
      }
      sibling = sibling.previousElementSibling
    }
  }

  if (DEBUG) console.log('headingId:', headingId)

  // Pass 2: walk forward from heading to count blocks up to the current sibling-level element
  let blockIndex = 0
  if (headingId) {
    const heading = contentRoot.querySelector(`#${CSS.escape(headingId)}`)
      || contentArea.querySelector(`#${CSS.escape(headingId)}`)
    if (heading) {
      let sibling = heading.nextElementSibling
      while (sibling) {
        if (/^H[1-6]$/.test(sibling.tagName)) break
        if (sibling instanceof HTMLElement && isBlockElement(sibling)) {
          if (sibling === block || sibling === walkStart || sibling === siblingLevel || sibling.contains(block)) break
          if (DEBUG) console.log('  counting block:', `<${sibling.tagName}>`, 'index:', blockIndex)
          blockIndex++
        }
        sibling = sibling.nextElementSibling
      }
    }
  }

  const textOffset = getTextOffset(range.startContainer, range.startOffset, block)
  const selectedText = range.toString()

  // Extract text-quote context for cross-element re-anchoring
  // `exact` comes from normalized text (with \n at block boundaries) to match textQuoteSearch
  const { prefix, suffix, exact } = extractContext(range, findContentRoot(contentArea))

  const anchor: TextAnchor = {
    headingId,
    blockIndex,
    textOffset,
    textLength: selectedText.length,
    exact,
    prefix,
    suffix,
  }

  if (DEBUG) {
    console.log('result:', JSON.stringify(anchor))
    console.groupEnd()
  }

  return anchor
}
