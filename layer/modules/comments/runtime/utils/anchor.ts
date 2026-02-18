import type { CommentAnchor } from '../types'

const DEBUG = import.meta.dev

export function isBlockElement(el: HTMLElement): boolean {
  return /^(?:P|DIV|LI|UL|OL|PRE|BLOCKQUOTE|TABLE|DL|DD|DT|FIGURE|SECTION|ARTICLE)$/
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

export function computeAnchor(range: Range, contentArea: Element): CommentAnchor {
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
  // This is what we use for heading/sibling walks
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
          // Match against both the exact block AND its sibling-level ancestor
          if (sibling === block || sibling === walkStart || sibling === siblingLevel || sibling.contains(block)) break
          if (DEBUG) console.log('  counting block:', `<${sibling.tagName}>`, 'index:', blockIndex)
          blockIndex++
        }
        sibling = sibling.nextElementSibling
      }
    }
  }

  const textOffset = getTextOffset(range.startContainer, range.startOffset, block)

  const anchor = {
    headingId,
    blockIndex,
    textOffset,
    textLength: range.toString().length,
  }

  if (DEBUG) {
    console.log('result:', JSON.stringify(anchor))
    console.groupEnd()
  }

  return anchor
}
