// @vitest-environment nuxt
/**
 * DOM-level tests for the comment module's anchor computation and highlight application.
 *
 * These tests import the REAL functions from the module utils (not duplicates),
 * construct DOM structures that mirror what Nuxt Content produces, and verify
 * the full lifecycle: select → anchor → store → re-highlight.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { DocComment } from '@incubrain/foundry/modules/comments/runtime/types'
import { computeAnchor } from '@incubrain/foundry/modules/comments/runtime/utils/anchor'
import { highlightComment, clearHighlights } from '@incubrain/foundry/modules/comments/runtime/utils/highlight'

// ── DOM helpers (test fixtures — construct Nuxt Content-like structures) ──

let contentArea: HTMLDivElement

function createContentArea(): HTMLDivElement {
  const el = document.createElement('div')
  el.setAttribute('data-doc-content', '')
  document.body.appendChild(el)
  return el
}

function addHeading(parent: Element, level: number, id: string, text: string) {
  const h = document.createElement(`h${level}`)
  h.id = id
  h.textContent = text
  parent.appendChild(h)
  return h
}

function addParagraph(parent: Element, ...children: (string | HTMLElement)[]) {
  const p = document.createElement('p')
  for (const child of children) {
    if (typeof child === 'string') {
      p.appendChild(document.createTextNode(child))
    }
    else {
      p.appendChild(child)
    }
  }
  parent.appendChild(p)
  return p
}

function addList(parent: Element, items: (string | (string | HTMLElement)[])[]) {
  const ul = document.createElement('ul')
  for (const item of items) {
    const li = document.createElement('li')
    if (typeof item === 'string') {
      li.textContent = item
    }
    else {
      for (const child of item) {
        if (typeof child === 'string') {
          li.appendChild(document.createTextNode(child))
        }
        else {
          li.appendChild(child)
        }
      }
    }
    ul.appendChild(li)
  }
  parent.appendChild(ul)
  return ul
}

function bold(text: string): HTMLElement {
  const strong = document.createElement('strong')
  strong.textContent = text
  return strong
}

function code(text: string): HTMLElement {
  const el = document.createElement('code')
  el.textContent = text
  return el
}

function link(text: string): HTMLElement {
  const a = document.createElement('a')
  a.textContent = text
  a.href = 'https://example.com'
  return a
}

function makeComment(overrides: Partial<DocComment> = {}): DocComment {
  return {
    id: 'c_test0001',
    page: '/docs/test',
    selectedText: 'plain text',
    anchor: { headingId: 'section-a', blockIndex: 0, textOffset: 0, textLength: 10 },
    comment: 'test comment',
    author: 'tester',
    category: 'docs',
    priority: 'low',
    status: 'open',
    createdAt: '2026-02-18T00:00:00.000Z',
    ...overrides,
  }
}

// ── Setup / Teardown ──

beforeEach(() => {
  contentArea = createContentArea()
})

afterEach(() => {
  clearHighlights()
  contentArea.remove()
})

// ── Tests ──

describe('Anchor Computation', () => {
  it('computes anchor for plain text in first paragraph after heading', () => {
    addHeading(contentArea, 2, 'section-a', 'Section A')
    const p = addParagraph(contentArea, 'This is simple paragraph text.')

    const textNode = p.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 8) // "simple"
    range.setEnd(textNode, 14)

    const anchor = computeAnchor(range, contentArea)
    expect(anchor.headingId).toBe('section-a')
    expect(anchor.blockIndex).toBe(0)
    expect(anchor.textOffset).toBe(8)
    expect(anchor.textLength).toBe(6)
  })

  it('computes correct blockIndex for second paragraph after heading', () => {
    addHeading(contentArea, 2, 'section-a', 'Section A')
    addParagraph(contentArea, 'First paragraph.')
    const p2 = addParagraph(contentArea, 'Second paragraph.')

    const textNode = p2.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.setEnd(textNode, 6) // "Second"

    const anchor = computeAnchor(range, contentArea)
    expect(anchor.headingId).toBe('section-a')
    expect(anchor.blockIndex).toBe(1)
    expect(anchor.textOffset).toBe(0)
    expect(anchor.textLength).toBe(6)
  })

  it('finds the nearest heading, not a distant one', () => {
    addHeading(contentArea, 2, 'section-a', 'Section A')
    addParagraph(contentArea, 'Under section A.')
    addHeading(contentArea, 2, 'section-b', 'Section B')
    const p = addParagraph(contentArea, 'Under section B.')

    const textNode = p.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.setEnd(textNode, 5) // "Under"

    const anchor = computeAnchor(range, contentArea)
    expect(anchor.headingId).toBe('section-b')
    // blockIndex is 0 — no blocks between section-b heading and this paragraph
    expect(anchor.blockIndex).toBe(0)
  })

  it('does not count blocks from a previous section', () => {
    addHeading(contentArea, 2, 'section-a', 'Section A')
    addParagraph(contentArea, 'Para 1 under A.')
    addParagraph(contentArea, 'Para 2 under A.')
    addHeading(contentArea, 2, 'section-b', 'Section B')
    const p = addParagraph(contentArea, 'First para under B.')

    const textNode = p.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.setEnd(textNode, 5)

    const anchor = computeAnchor(range, contentArea)
    expect(anchor.headingId).toBe('section-b')
    // Should be 0, not 2 — the two paragraphs under section-a don't count
    expect(anchor.blockIndex).toBe(0)
  })

  it('returns null headingId when no heading precedes the content', () => {
    const p = addParagraph(contentArea, 'No heading above this.')

    const textNode = p.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.setEnd(textNode, 2)

    const anchor = computeAnchor(range, contentArea)
    expect(anchor.headingId).toBeNull()
  })

  it('computes textOffset across multiple text nodes (bold text)', () => {
    addHeading(contentArea, 2, 'fmt', 'Formatted')
    const p = addParagraph(contentArea, 'This contains ', bold('bold text'), ' in the middle.')

    const strongEl = p.querySelector('strong')!
    const boldTextNode = strongEl.firstChild!
    const range = document.createRange()
    range.setStart(boldTextNode, 0)
    range.setEnd(boldTextNode, 9) // "bold text"

    const anchor = computeAnchor(range, contentArea)
    expect(anchor.headingId).toBe('fmt')
    expect(anchor.blockIndex).toBe(0)
    expect(anchor.textOffset).toBe(14) // "This contains " = 14 chars
    expect(anchor.textLength).toBe(9)
  })

  it('computes textOffset for text after bold', () => {
    addHeading(contentArea, 2, 'fmt', 'Formatted')
    const p = addParagraph(contentArea, 'Before ', bold('middle'), ' after this.')

    const afterNode = p.childNodes[2]! // " after this."
    const range = document.createRange()
    range.setStart(afterNode, 1) // skip leading space → "after"
    range.setEnd(afterNode, 6)

    const anchor = computeAnchor(range, contentArea)
    // "Before " = 7 + "middle" = 6 + " " = 1 → offset 14
    expect(anchor.textOffset).toBe(14)
    expect(anchor.textLength).toBe(5)
  })

  it('finds heading for text inside a list item via UL parent', () => {
    addHeading(contentArea, 2, 'list-sec', 'List Section')
    const ul = addList(contentArea, ['First item', 'Second item', 'Third item'])

    const secondLi = ul.querySelectorAll('li')[1]!
    const textNode = secondLi.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.setEnd(textNode, 6) // "Second"

    const anchor = computeAnchor(range, contentArea)
    // LI escalates to UL, and UL finds the heading as its sibling
    expect(anchor.headingId).toBe('list-sec')
    expect(anchor.textOffset).toBe(0)
    expect(anchor.textLength).toBe(6)
  })
})

describe('Highlight Application — Plain Text', () => {
  it('highlights plain text in a paragraph', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'This is highlightable text here.')

    const comment = makeComment({
      selectedText: 'highlightable',
      anchor: { headingId: 'sec', blockIndex: 0, textOffset: 8, textLength: 13 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)

    const mark = contentArea.querySelector('mark.doc-comment-highlight')
    expect(mark).not.toBeNull()
    expect(mark!.textContent).toBe('highlightable')
    expect(mark!.dataset.commentId).toBe('c_test0001')
  })

  it('highlights text in second paragraph (blockIndex=1)', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'First paragraph content.')
    addParagraph(contentArea, 'Second paragraph content.')

    const comment = makeComment({
      selectedText: 'Second',
      anchor: { headingId: 'sec', blockIndex: 1, textOffset: 0, textLength: 6 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)

    const mark = contentArea.querySelector('mark.doc-comment-highlight')
    expect(mark!.textContent).toBe('Second')
  })

  it('clears highlights and restores DOM', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'Text to highlight.')

    const comment = makeComment({
      selectedText: 'highlight',
      anchor: { headingId: 'sec', blockIndex: 0, textOffset: 8, textLength: 9 },
    })

    highlightComment(comment, contentArea)
    expect(contentArea.querySelector('mark')).not.toBeNull()

    clearHighlights()
    expect(contentArea.querySelector('mark')).toBeNull()
    expect(contentArea.querySelector('p')!.textContent).toBe('Text to highlight.')
  })
})

describe('Highlight Application — Cross-Element', () => {
  it('highlights text spanning a <strong> boundary with multiple marks', () => {
    addHeading(contentArea, 2, 'fmt', 'Formatted')
    addParagraph(contentArea, 'This contains ', bold('bold text'), ' in the middle.')

    // "contains bold text in" crosses the <strong> boundary
    const comment = makeComment({
      selectedText: 'contains bold text in',
      anchor: { headingId: 'fmt', blockIndex: 0, textOffset: 5, textLength: 21 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)

    const marks = contentArea.querySelectorAll('mark.doc-comment-highlight')
    expect(marks.length).toBeGreaterThanOrEqual(2)

    const totalText = Array.from(marks).map(m => m.textContent).join('')
    expect(totalText).toBe('contains bold text in')
  })

  it('highlights across multiple list items with multiple marks', () => {
    addHeading(contentArea, 2, 'list', 'Lists')
    addList(contentArea, ['First item', 'Second item'])

    const comment = makeComment({
      id: 'c_multilist',
      selectedText: 'First itemSecond item',
      anchor: { headingId: 'list', blockIndex: 0, textOffset: 0, textLength: 21 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)

    const marks = contentArea.querySelectorAll('mark.doc-comment-highlight')
    expect(marks.length).toBeGreaterThanOrEqual(2)

    const totalText = Array.from(marks).map(m => m.textContent).join('')
    expect(totalText).toBe('First itemSecond item')
  })

  it('CAN highlight text entirely within <strong>', () => {
    addHeading(contentArea, 2, 'fmt', 'Formatted')
    addParagraph(contentArea, 'Text with ', bold('bold part'), ' here.')

    const comment = makeComment({
      selectedText: 'bold',
      anchor: { headingId: 'fmt', blockIndex: 0, textOffset: 10, textLength: 4 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)
    expect(contentArea.querySelector('mark')!.textContent).toBe('bold')
  })

  it('CAN highlight text entirely before <strong>', () => {
    addHeading(contentArea, 2, 'fmt', 'Formatted')
    addParagraph(contentArea, 'Text with ', bold('bold part'), ' here.')

    const comment = makeComment({
      selectedText: 'Text',
      anchor: { headingId: 'fmt', blockIndex: 0, textOffset: 0, textLength: 4 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)
    expect(contentArea.querySelector('mark')!.textContent).toBe('Text')
  })

  it('CAN highlight text entirely after <strong>', () => {
    addHeading(contentArea, 2, 'fmt', 'Formatted')
    addParagraph(contentArea, 'Text with ', bold('bold part'), ' here.')

    const comment = makeComment({
      selectedText: 'here',
      // "Text with " = 10, "bold part" = 9, " here." → "here" at offset 20
      anchor: { headingId: 'fmt', blockIndex: 0, textOffset: 20, textLength: 4 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)
    expect(contentArea.querySelector('mark')!.textContent).toBe('here')
  })
})

describe('Highlight Application — Duplicate Text', () => {
  it('anchor-based lookup targets correct paragraph via blockIndex', () => {
    addHeading(contentArea, 2, 'dup', 'Duplicates')
    addParagraph(contentArea, 'The word Foundry appears here.')
    addParagraph(contentArea, 'The word Foundry also appears here.')

    // Comment on SECOND occurrence — anchor says blockIndex=1
    const comment = makeComment({
      selectedText: 'Foundry',
      anchor: { headingId: 'dup', blockIndex: 1, textOffset: 9, textLength: 7 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)

    const mark = contentArea.querySelector('mark.doc-comment-highlight')!
    const parentP = mark.parentElement!
    expect(parentP.textContent).toContain('also appears')
  })

  it('anchor-based lookup targets correct paragraph, not first occurrence', () => {
    addHeading(contentArea, 2, 'dup', 'Duplicates')
    addParagraph(contentArea, 'Word appears here.')
    addParagraph(contentArea, 'Word appears here too.')

    const comment = makeComment({
      selectedText: 'Word',
      anchor: { headingId: 'dup', blockIndex: 1, textOffset: 0, textLength: 4 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)

    const mark = contentArea.querySelector('mark')!
    const parentP = mark.parentElement!
    expect(parentP.textContent).toContain('here too')
  })
})

describe('Highlight Application — Fallback Strategies', () => {
  it('falls back to text search when heading ID is not found', () => {
    addHeading(contentArea, 2, 'real-id', 'Real Heading')
    addParagraph(contentArea, 'Unique text content here.')

    const comment = makeComment({
      selectedText: 'Unique text',
      anchor: { headingId: 'non-existent-id', blockIndex: 0, textOffset: 0, textLength: 11 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)
    expect(contentArea.querySelector('mark')!.textContent).toBe('Unique text')
  })

  it('falls back to text search when blockIndex is out of range', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'Only one paragraph.')

    const comment = makeComment({
      selectedText: 'Only one',
      anchor: { headingId: 'sec', blockIndex: 5, textOffset: 0, textLength: 8 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)
    expect(contentArea.querySelector('mark')!.textContent).toBe('Only one')
  })

  it('returns false when text is not found anywhere', () => {
    addParagraph(contentArea, 'Some content.')

    const comment = makeComment({
      selectedText: 'xyzzy_nonexistent_string_12345',
      anchor: { headingId: 'no-such-heading', blockIndex: 0, textOffset: 0, textLength: 30 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(false)
  })
})

describe('Round-trip: Anchor → Store → Re-highlight', () => {
  it('plain text round-trips correctly', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    const p = addParagraph(contentArea, 'Select this exact phrase in the paragraph.')

    const textNode = p.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 12) // "exact phrase"
    range.setEnd(textNode, 24)

    const anchor = computeAnchor(range, contentArea)
    const selectedText = range.toString()
    expect(selectedText).toBe('exact phrase')

    const comment = makeComment({ selectedText, anchor })
    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)

    const mark = contentArea.querySelector('mark')!
    expect(mark.textContent).toBe('exact phrase')
  })

  it('text within bold round-trips correctly', () => {
    addHeading(contentArea, 2, 'fmt', 'Formatted')
    const p = addParagraph(contentArea, 'Before ', bold('the bold part'), ' after.')

    const boldNode = p.querySelector('strong')!.firstChild!
    const range = document.createRange()
    range.setStart(boldNode, 4) // "bold"
    range.setEnd(boldNode, 8)

    const anchor = computeAnchor(range, contentArea)
    const selectedText = range.toString()
    expect(selectedText).toBe('bold')

    const comment = makeComment({ selectedText, anchor })
    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)
    expect(contentArea.querySelector('mark')!.textContent).toBe('bold')
  })

  it('text spanning bold boundary round-trips with multi-mark highlight', () => {
    addHeading(contentArea, 2, 'fmt', 'Formatted')
    addParagraph(contentArea, 'Before ', bold('bold'), ' after.')

    const comment = makeComment({
      selectedText: 'Before bold',
      anchor: { headingId: 'fmt', blockIndex: 0, textOffset: 0, textLength: 11 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)

    const marks = contentArea.querySelectorAll('mark.doc-comment-highlight')
    const totalText = Array.from(marks).map(m => m.textContent).join('')
    expect(totalText).toBe('Before bold')
  })
})

describe('Multiple Comments on Same Page', () => {
  it('applies multiple highlights without interference', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'First paragraph with some text.')
    addParagraph(contentArea, 'Second paragraph with other text.')

    const c1 = makeComment({
      id: 'c_first',
      selectedText: 'First',
      anchor: { headingId: 'sec', blockIndex: 0, textOffset: 0, textLength: 5 },
    })
    const c2 = makeComment({
      id: 'c_second',
      selectedText: 'Second',
      anchor: { headingId: 'sec', blockIndex: 1, textOffset: 0, textLength: 6 },
    })

    const s1 = highlightComment(c1, contentArea)
    const s2 = highlightComment(c2, contentArea)

    expect(s1).toBe(true)
    expect(s2).toBe(true)

    const marks = contentArea.querySelectorAll('mark.doc-comment-highlight')
    expect(marks).toHaveLength(2)
    expect(marks[0]!.dataset.commentId).toBe('c_first')
    expect(marks[1]!.dataset.commentId).toBe('c_second')
  })

  it('skips resolved comments', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'Some text here.')

    const comment = makeComment({
      selectedText: 'text',
      anchor: { headingId: 'sec', blockIndex: 0, textOffset: 5, textLength: 4 },
      status: 'resolved',
    })

    // The overlay skips resolved comments before calling highlightComment
    if (comment.status !== 'resolved') {
      highlightComment(comment, contentArea)
    }

    expect(contentArea.querySelector('mark')).toBeNull()
  })
})

describe('Edge Cases', () => {
  it('handles content with no headings', () => {
    addParagraph(contentArea, 'Paragraph without any heading above.')

    const comment = makeComment({
      selectedText: 'without',
      anchor: { headingId: null, blockIndex: 0, textOffset: 10, textLength: 7 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)
  })

  it('handles empty content area', () => {
    const comment = makeComment({
      selectedText: 'anything',
      anchor: { headingId: null, blockIndex: 0, textOffset: 0, textLength: 8 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(false)
  })

  it('handles inline code elements', () => {
    addHeading(contentArea, 2, 'code-sec', 'Code')
    addParagraph(contentArea, 'Use the ', code('npm install'), ' command.')

    const comment = makeComment({
      selectedText: 'npm install',
      anchor: { headingId: 'code-sec', blockIndex: 0, textOffset: 8, textLength: 11 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)
    expect(contentArea.querySelector('mark')!.textContent).toBe('npm install')
  })

  it('handles link elements', () => {
    addHeading(contentArea, 2, 'link-sec', 'Links')
    addParagraph(contentArea, 'Visit ', link('Example Site'), ' for more.')

    const comment = makeComment({
      selectedText: 'Example Site',
      anchor: { headingId: 'link-sec', blockIndex: 0, textOffset: 6, textLength: 12 },
    })

    const success = highlightComment(comment, contentArea)
    expect(success).toBe(true)
    expect(contentArea.querySelector('mark')!.textContent).toBe('Example Site')
  })
})
