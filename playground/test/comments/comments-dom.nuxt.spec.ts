// @vitest-environment nuxt
/**
 * DOM-level tests for the comment module's anchor computation and highlight range finding.
 *
 * These tests import the REAL functions from the module utils,
 * construct DOM structures that mirror what Nuxt Content produces, and verify
 * the full lifecycle: select → anchor → store → re-find range.
 *
 * NOTE: happy-dom doesn't support the CSS Custom Highlight API (CSS.highlights),
 * so we test findCommentRange (Range creation) rather than applyHighlights (CSS registration).
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { DocComment } from '@incubrain/foundry/modules/comments/runtime/types'
import { buildNormalizedText, computeAnchor, findContentRoot } from '@incubrain/foundry/modules/comments/runtime/utils/anchor'
import { findCommentRange, clearHighlights } from '@incubrain/foundry/modules/comments/runtime/utils/highlight'

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

/** Build a Shiki-like syntax-highlighted code block: <pre class="shiki"><code>...<span> tokens</code></pre> */
function addShikiCodeBlock(parent: Element, tokens: string[]) {
  const pre = document.createElement('pre')
  pre.className = 'shiki'
  const codeEl = document.createElement('code')
  for (const token of tokens) {
    const span = document.createElement('span')
    span.style.color = '#d4d4d4'
    span.textContent = token
    codeEl.appendChild(span)
  }
  pre.appendChild(codeEl)
  parent.appendChild(pre)
  return pre
}

/**
 * Build a realistic Shiki code block WITH wrapper div (as MDC/Nuxt Content renders):
 * <div class="relative my-5 group"><button>Copy</button><pre class="shiki"><code><span class="line"><span>token</span>...</code></pre></div>
 */
function addWrappedCodeBlock(parent: Element, tokens: string[]) {
  const wrapper = document.createElement('div')
  wrapper.className = 'relative my-5 group'
  const btn = document.createElement('button')
  btn.textContent = 'Copy code to clipboard'
  wrapper.appendChild(btn)

  const pre = document.createElement('pre')
  pre.className = 'shiki shiki-themes material-theme'
  const codeEl = document.createElement('code')
  const lineSpan = document.createElement('span')
  lineSpan.className = 'line'
  for (const token of tokens) {
    const span = document.createElement('span')
    span.className = 'sBMFI'
    span.textContent = token
    lineSpan.appendChild(span)
  }
  codeEl.appendChild(lineSpan)
  pre.appendChild(codeEl)
  wrapper.appendChild(pre)
  parent.appendChild(wrapper)
  return { wrapper, pre }
}

/**
 * Create a content area with the real Nuxt Content wrapper chain:
 * [data-doc-content] > div ([...slug].vue) > div (ContentRenderer) > actual content
 */
function createRealisticContentArea(): { contentArea: HTMLDivElement, contentRoot: HTMLDivElement } {
  const contentArea = document.createElement('div')
  contentArea.setAttribute('data-doc-content', '')
  const slugDiv = document.createElement('div')
  const rendererDiv = document.createElement('div')
  slugDiv.appendChild(rendererDiv)
  contentArea.appendChild(slugDiv)
  document.body.appendChild(contentArea)
  return { contentArea, contentRoot: rendererDiv }
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
    expect(anchor.headingId).toBe('list-sec')
    expect(anchor.textOffset).toBe(0)
    expect(anchor.textLength).toBe(6)
  })

  it('captures exact, prefix, and suffix fields', () => {
    addHeading(contentArea, 2, 'ctx', 'Context Section')
    addParagraph(contentArea, 'The quick brown fox jumps over the lazy dog.')

    const p = contentArea.querySelector('p')!
    const textNode = p.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 10) // "brown fox"
    range.setEnd(textNode, 19)

    const anchor = computeAnchor(range, contentArea)
    expect(anchor.exact).toBe('brown fox')
    expect(anchor.prefix).toContain('quick ')
    expect(anchor.suffix).toContain('jumps')
  })
})

describe('buildNormalizedText', () => {
  it('inserts newline between sibling block elements', () => {
    addHeading(contentArea, 2, 'h', 'Heading')
    addParagraph(contentArea, 'Paragraph one.')

    const { text } = buildNormalizedText(contentArea)
    expect(text).toContain('Heading\nParagraph one.')
  })

  it('does NOT insert newline between inline elements within a paragraph', () => {
    addParagraph(contentArea, 'Before ', bold('bold'), ' after.')

    const { text } = buildNormalizedText(contentArea)
    expect(text).toBe('Before bold after.')
  })

  it('tracks text node positions correctly', () => {
    addParagraph(contentArea, 'Hello world.')

    const { text, nodes } = buildNormalizedText(contentArea)
    expect(text).toBe('Hello world.')
    expect(nodes).toHaveLength(1)
    expect(nodes[0]!.start).toBe(0)
    expect(nodes[0]!.end).toBe(12)
  })

  it('handles code block wrapper divs with copy button text', () => {
    addWrappedCodeBlock(contentArea, ['const', ' x'])

    const { text } = buildNormalizedText(contentArea)
    // The "Copy code to clipboard" button text is included (it's a text node)
    expect(text).toContain('const x')
  })
})

describe('findCommentRange — Single Block', () => {
  it('finds range for plain text in a paragraph', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'This is highlightable text here.')

    const comment = makeComment({
      selectedText: 'highlightable',
      anchor: { headingId: 'sec', blockIndex: 0, textOffset: 8, textLength: 13, exact: 'highlightable' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('highlightable')
  })

  it('finds range in second paragraph (blockIndex=1)', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'First paragraph content.')
    addParagraph(contentArea, 'Second paragraph content.')

    const comment = makeComment({
      selectedText: 'Second',
      anchor: { headingId: 'sec', blockIndex: 1, textOffset: 0, textLength: 6, exact: 'Second' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('Second')
  })

  it('finds range for text within heading itself', () => {
    addHeading(contentArea, 2, 'single', 'Single Heading Text')
    addParagraph(contentArea, 'Some paragraph.')

    const comment = makeComment({
      selectedText: 'Heading',
      anchor: { headingId: 'single', blockIndex: 0, textOffset: 7, textLength: 7, exact: 'Heading' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('Heading')
  })

  it('returns null when text is not found anywhere', () => {
    addParagraph(contentArea, 'Some content.')

    const comment = makeComment({
      selectedText: 'xyzzy_nonexistent_string_12345',
      anchor: { headingId: 'no-such-heading', blockIndex: 0, textOffset: 0, textLength: 30, exact: 'xyzzy_nonexistent_string_12345' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).toBeNull()
  })
})

describe('findCommentRange — Cross-Element (Text-Quote Search)', () => {
  it('finds range spanning heading into paragraph', () => {
    addHeading(contentArea, 2, 'cross', 'Cross Block')
    addParagraph(contentArea, 'First paragraph text.')

    // "Cross Block\nFirst paragraph" — spans H2 → P with newline
    const comment = makeComment({
      selectedText: 'Cross Block\nFirst paragraph',
      anchor: {
        headingId: 'cross',
        blockIndex: 0,
        textOffset: 0,
        textLength: 27,
        exact: 'Cross Block\nFirst paragraph',
      },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toContain('Cross Block')
    expect(range!.toString()).toContain('First paragraph')
  })

  it('finds range spanning paragraph into next paragraph', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'End of first.')
    addParagraph(contentArea, 'Start of second.')

    const comment = makeComment({
      selectedText: 'End of first.\nStart of second.',
      anchor: {
        headingId: 'sec',
        blockIndex: 0,
        textOffset: 0,
        textLength: 30,
        exact: 'End of first.\nStart of second.',
      },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    const rangeText = range!.toString()
    expect(rangeText).toContain('End of first.')
    expect(rangeText).toContain('Start of second.')
  })

  it('finds range spanning paragraph across list into another paragraph', () => {
    addHeading(contentArea, 2, 'multi', 'Multi')
    addParagraph(contentArea, 'Before list.')
    addList(contentArea, ['Item one', 'Item two'])
    addParagraph(contentArea, 'After list.')

    // The selected text contains content from P → UL → P
    const comment = makeComment({
      selectedText: 'Before list.\nItem one\nItem two\nAfter list.',
      anchor: {
        headingId: 'multi',
        blockIndex: 0,
        textOffset: 0,
        textLength: 42,
        exact: 'Before list.\nItem one\nItem two\nAfter list.',
      },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    const rangeText = range!.toString()
    expect(rangeText).toContain('Before list.')
    expect(rangeText).toContain('Item one')
    expect(rangeText).toContain('After list.')
  })

  it('finds range spanning paragraph into code block', () => {
    addHeading(contentArea, 2, 'code', 'Code Section')
    addParagraph(contentArea, 'Install with:')
    addShikiCodeBlock(contentArea, ['npm', ' install'])

    const comment = makeComment({
      selectedText: 'Install with:\nnpm install',
      anchor: {
        headingId: 'code',
        blockIndex: 0,
        textOffset: 0,
        textLength: 25,
        exact: 'Install with:\nnpm install',
      },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    const rangeText = range!.toString()
    expect(rangeText).toContain('Install with:')
    expect(rangeText).toContain('npm install')
  })

  it('uses prefix/suffix to disambiguate duplicate text', () => {
    addHeading(contentArea, 2, 'dup', 'Duplicates')
    addParagraph(contentArea, 'The word Foundry appears here.')
    addParagraph(contentArea, 'The word Foundry also appears here.')

    // Comment targets second occurrence with prefix/suffix context
    const comment = makeComment({
      selectedText: 'Foundry',
      anchor: {
        headingId: 'dup',
        blockIndex: 1,
        textOffset: 9,
        textLength: 7,
        exact: 'Foundry',
        prefix: 'The word ',
        suffix: ' also appears here.',
      },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('Foundry')

    // Verify it's in the SECOND paragraph (suffix has "also")
    const container = range!.startContainer.parentElement!
    expect(container.textContent).toContain('also appears')
  })
})

describe('findCommentRange — Syntax-Highlighted Code Blocks', () => {
  it('finds range across Shiki token spans', () => {
    addHeading(contentArea, 2, 'code-sec', 'Code')
    addShikiCodeBlock(contentArea, ['const', ' ', 'x', ' = ', '1'])

    const comment = makeComment({
      selectedText: 'const x',
      anchor: { headingId: 'code-sec', blockIndex: 0, textOffset: 0, textLength: 7, exact: 'const x' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('const x')
  })

  it('finds range for partial token', () => {
    addHeading(contentArea, 2, 'code-sec', 'Code')
    addShikiCodeBlock(contentArea, ['const', ' ', 'myVariable', ' = ', '"hello"'])

    const comment = makeComment({
      selectedText: 'Variable',
      anchor: { headingId: 'code-sec', blockIndex: 0, textOffset: 8, textLength: 8, exact: 'Variable' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('Variable')
  })

  it('round-trips anchor through Shiki tokens', () => {
    addHeading(contentArea, 2, 'code-sec', 'Code')
    const pre = addShikiCodeBlock(contentArea, ['import', ' ', 'foo', ' from ', '\'bar\''])

    const fooSpan = pre.querySelectorAll('span')[2]!
    const textNode = fooSpan.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.setEnd(textNode, 3)

    const anchor = computeAnchor(range, contentArea)
    expect(anchor.headingId).toBe('code-sec')
    expect(anchor.textOffset).toBe(7)
    expect(anchor.textLength).toBe(3)
    expect(anchor.exact).toBe('foo')

    const comment = makeComment({ selectedText: 'foo', anchor })
    const foundRange = findCommentRange(comment, contentArea)
    expect(foundRange).not.toBeNull()
    expect(foundRange!.toString()).toBe('foo')
  })
})

describe('findCommentRange — Fallback Strategies', () => {
  it('falls back to text-quote search when heading ID is not found', () => {
    addHeading(contentArea, 2, 'real-id', 'Real Heading')
    addParagraph(contentArea, 'Unique text content here.')

    const comment = makeComment({
      selectedText: 'Unique text',
      anchor: { headingId: 'non-existent-id', blockIndex: 0, textOffset: 0, textLength: 11, exact: 'Unique text' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('Unique text')
  })

  it('falls back to text-quote search when blockIndex is out of range', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'Only one paragraph.')

    const comment = makeComment({
      selectedText: 'Only one',
      anchor: { headingId: 'sec', blockIndex: 5, textOffset: 0, textLength: 8, exact: 'Only one' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('Only one')
  })

  it('handles backwards-compat comments without exact field', () => {
    addHeading(contentArea, 2, 'sec', 'Section')
    addParagraph(contentArea, 'Legacy comment text here.')

    const comment = makeComment({
      selectedText: 'Legacy comment',
      anchor: { headingId: 'sec', blockIndex: 0, textOffset: 0, textLength: 14 },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('Legacy comment')
  })
})

describe('Round-trip: Anchor → Store → Re-find Range', () => {
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
    const foundRange = findCommentRange(comment, contentArea)
    expect(foundRange).not.toBeNull()
    expect(foundRange!.toString()).toBe('exact phrase')
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
    const foundRange = findCommentRange(comment, contentArea)
    expect(foundRange).not.toBeNull()
    expect(foundRange!.toString()).toBe('bold')
  })

  it('text spanning bold boundary round-trips correctly', () => {
    addHeading(contentArea, 2, 'fmt', 'Formatted')
    addParagraph(contentArea, 'Before ', bold('bold'), ' after.')

    const comment = makeComment({
      selectedText: 'Before bold',
      anchor: { headingId: 'fmt', blockIndex: 0, textOffset: 0, textLength: 11, exact: 'Before bold' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('Before bold')
  })
})

describe('Edge Cases', () => {
  it('handles content with no headings', () => {
    addParagraph(contentArea, 'Paragraph without any heading above.')

    const comment = makeComment({
      selectedText: 'without',
      anchor: { headingId: null, blockIndex: 0, textOffset: 10, textLength: 7, exact: 'without' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('without')
  })

  it('handles empty content area', () => {
    const comment = makeComment({
      selectedText: 'anything',
      anchor: { headingId: null, blockIndex: 0, textOffset: 0, textLength: 8, exact: 'anything' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).toBeNull()
  })

  it('handles inline code elements', () => {
    addHeading(contentArea, 2, 'code-sec', 'Code')
    addParagraph(contentArea, 'Use the ', code('npm install'), ' command.')

    const comment = makeComment({
      selectedText: 'npm install',
      anchor: { headingId: 'code-sec', blockIndex: 0, textOffset: 8, textLength: 11, exact: 'npm install' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('npm install')
  })

  it('handles link elements', () => {
    addHeading(contentArea, 2, 'link-sec', 'Links')
    addParagraph(contentArea, 'Visit ', link('Example Site'), ' for more.')

    const comment = makeComment({
      selectedText: 'Example Site',
      anchor: { headingId: 'link-sec', blockIndex: 0, textOffset: 6, textLength: 12, exact: 'Example Site' },
    })

    const range = findCommentRange(comment, contentArea)
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('Example Site')
  })
})

describe('Realistic DOM — Wrapper Divs (Nuxt Content rendering)', () => {
  let realisticContentArea: HTMLDivElement
  let contentRoot: HTMLDivElement

  beforeEach(() => {
    contentArea.remove()
    const result = createRealisticContentArea()
    realisticContentArea = result.contentArea
    contentRoot = result.contentRoot
  })

  afterEach(() => {
    clearHighlights()
    realisticContentArea.remove()
  })

  it('findContentRoot drills down single-child div chains', () => {
    addHeading(contentRoot, 2, 'test-h', 'Test')
    const root = findContentRoot(realisticContentArea)
    expect(root).toBe(contentRoot)
    expect(root.querySelector('#test-h')).toBeTruthy()
  })

  it('anchors code block text inside wrapper div correctly', () => {
    addHeading(contentRoot, 2, 'code-h', 'Code Section')
    addParagraph(contentRoot, 'Some intro text.')
    addWrappedCodeBlock(contentRoot, ['npx', ' create-foundry', ' my-funnel'])

    const pre = contentRoot.querySelector('pre')!
    const tokenSpan = pre.querySelectorAll('span.sBMFI')[0]
    const textNode = tokenSpan.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.setEnd(textNode, 3)

    const anchor = computeAnchor(range, realisticContentArea)
    expect(anchor.headingId).toBe('code-h')
    expect(anchor.blockIndex).toBe(1)
  })

  it('finds range for code block text via anchor in wrapper div', () => {
    addHeading(contentRoot, 2, 'code-h', 'Code Section')
    addParagraph(contentRoot, 'Some intro text.')
    addWrappedCodeBlock(contentRoot, ['npx', ' create-foundry', ' my-funnel'])

    const pre = contentRoot.querySelector('pre')!
    const tokenSpan = pre.querySelectorAll('span.sBMFI')[0]
    const textNode = tokenSpan.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.setEnd(textNode, 3)

    const anchor = computeAnchor(range, realisticContentArea)
    const comment = makeComment({ selectedText: 'npx', anchor })

    const foundRange = findCommentRange(comment, realisticContentArea)
    expect(foundRange).not.toBeNull()
    expect(foundRange!.toString()).toBe('npx')
  })

  it('round-trips anchor for paragraph text in realistic DOM', () => {
    addHeading(contentRoot, 2, 'para-h', 'Paragraph Section')
    addParagraph(contentRoot, 'First paragraph with some text.')
    addParagraph(contentRoot, 'Second paragraph here.')

    const p = contentRoot.querySelectorAll('p')[0]!
    const textNode = p.firstChild!
    const range = document.createRange()
    range.setStart(textNode, 21)
    range.setEnd(textNode, 30)

    const anchor = computeAnchor(range, realisticContentArea)
    expect(anchor.headingId).toBe('para-h')
    expect(anchor.blockIndex).toBe(0)

    const comment = makeComment({ selectedText: 'some text', anchor })
    const foundRange = findCommentRange(comment, realisticContentArea)
    expect(foundRange).not.toBeNull()
    expect(foundRange!.toString()).toBe('some text')
  })
})
