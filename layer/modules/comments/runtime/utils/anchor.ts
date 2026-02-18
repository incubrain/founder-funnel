import type { CommentAnchor } from '../types'

export function isBlockElement(el: HTMLElement): boolean {
  return /^(?:P|DIV|LI|UL|OL|PRE|BLOCKQUOTE|TABLE|DL|DD|DT|FIGURE|SECTION|ARTICLE)$/
    .test(el.tagName)
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
  // Walk up from startContainer to find the containing block element
  let block = range.startContainer as Node
  while (block && block !== contentArea) {
    if (block instanceof HTMLElement && isBlockElement(block)) break
    block = block.parentNode!
  }

  // If block is an LI, escalate to the parent UL/OL for heading search
  // because headings are siblings of the list container, not list items
  let walkStart: Node = block
  if (block instanceof HTMLElement && block.tagName === 'LI') {
    const listParent = block.parentElement
    if (listParent && /^(?:UL|OL)$/.test(listParent.tagName)) {
      walkStart = listParent
    }
  }

  // Check if the walkStart itself is a heading
  let headingId: string | null = null
  if (walkStart instanceof HTMLElement && /^H[1-6]$/.test(walkStart.tagName)) {
    headingId = walkStart.id || null
  }

  // Pass 1: walk backwards from walkStart to find the nearest heading
  if (!headingId) {
    let sibling = (walkStart as ChildNode).previousSibling
    while (sibling) {
      if (sibling instanceof HTMLElement && /^H[1-6]$/.test(sibling.tagName)) {
        headingId = sibling.id || null
        break
      }
      sibling = sibling.previousSibling
    }
  }

  // Pass 2: walk forward from heading to count blocks up to the current block
  let blockIndex = 0
  if (headingId) {
    const heading = contentArea.querySelector(`#${CSS.escape(headingId)}`)
    if (heading) {
      let sibling = heading.nextElementSibling
      while (sibling) {
        if (/^H[1-6]$/.test(sibling.tagName)) break
        if (sibling instanceof HTMLElement && isBlockElement(sibling)) {
          if (sibling === block || sibling === walkStart) break
          blockIndex++
        }
        sibling = sibling.nextElementSibling
      }
    }
  }

  const textOffset = getTextOffset(range.startContainer, range.startOffset, block)

  return {
    headingId,
    blockIndex,
    textOffset,
    textLength: range.toString().length,
  }
}
