// Tests for comment module type constants and anchor logic
import { describe, it, expect } from 'vitest'
import { CATEGORIES, PRIORITIES, isElementAnchor, isTextAnchor } from '@incubrain/foundry/modules/comments/runtime/types'
import type { CommentAnchor, CommentCategory, CommentPriority, DocComment, ElementAnchor, TextAnchor, ReviewMode } from '@incubrain/foundry/modules/comments/runtime/types'

describe('Comment Type Constants', () => {
  it('exports all 6 categories', () => {
    expect(CATEGORIES).toEqual(['bug', 'ui', 'chore', 'feature', 'docs', 'perf'])
    expect(CATEGORIES).toHaveLength(6)
  })

  it('exports all 3 priorities', () => {
    expect(PRIORITIES).toEqual(['low', 'med', 'critical'])
    expect(PRIORITIES).toHaveLength(3)
  })

  it('category type covers all values', () => {
    // Type assertion — if this compiles, the types are correct
    const cats: CommentCategory[] = ['bug', 'ui', 'chore', 'feature', 'docs', 'perf']
    expect(cats).toEqual(CATEGORIES)
  })

  it('priority type covers all values', () => {
    const pris: CommentPriority[] = ['low', 'med', 'critical']
    expect(pris).toEqual(PRIORITIES)
  })
})

describe('Comment Anchor', () => {
  it('represents a valid anchor', () => {
    const anchor: CommentAnchor = {
      headingId: 'what-is-foundry',
      blockIndex: 0,
      textOffset: 5,
      textLength: 20,
    }
    expect(anchor.headingId).toBe('what-is-foundry')
    expect(anchor.blockIndex).toBe(0)
    expect(anchor.textOffset).toBe(5)
    expect(anchor.textLength).toBe(20)
  })

  it('allows null headingId for content before any heading', () => {
    const anchor: CommentAnchor = {
      headingId: null,
      blockIndex: 0,
      textOffset: 0,
      textLength: 10,
    }
    expect(anchor.headingId).toBeNull()
  })
})

describe('DocComment', () => {
  it('represents a complete comment object', () => {
    const comment: DocComment = {
      id: 'c_abc12345',
      page: '/docs/getting-started/introduction',
      selectedText: 'Foundry is a',
      anchor: {
        headingId: 'what-is-foundry',
        blockIndex: 0,
        textOffset: 0,
        textLength: 12,
      },
      comment: 'Good intro',
      author: 'drew',
      category: 'docs',
      priority: 'low',
      status: 'open',
      createdAt: '2026-02-18T00:00:00.000Z',
    }

    expect(comment.id).toMatch(/^c_/)
    expect(comment.category).toBe('docs')
    expect(comment.priority).toBe('low')
    expect(comment.status).toBe('open')
    expect(comment.resolvedAt).toBeUndefined()
  })

  it('includes resolvedAt when resolved', () => {
    const comment: DocComment = {
      id: 'c_abc12345',
      page: '/docs/intro',
      selectedText: 'text',
      anchor: { headingId: null, blockIndex: 0, textOffset: 0, textLength: 4 },
      comment: 'note',
      author: 'drew',
      category: 'bug',
      priority: 'critical',
      status: 'resolved',
      createdAt: '2026-02-18T00:00:00.000Z',
      resolvedAt: '2026-02-18T01:00:00.000Z',
    }

    expect(comment.status).toBe('resolved')
    expect(comment.resolvedAt).toBeDefined()
  })

  it('accepts element anchor type', () => {
    const comment: DocComment = {
      id: 'c_elem0001',
      page: '/',
      selectedText: '<section>',
      anchor: {
        type: 'element',
        selector: '[data-testid="hero"]',
        testId: 'hero',
        tagName: 'section',
        rect: { top: 0, left: 0, width: 800, height: 400 },
      },
      comment: 'This section needs work',
      author: 'drew',
      category: 'ui',
      priority: 'med',
      status: 'open',
      createdAt: '2026-02-18T00:00:00.000Z',
      screenshot: 'data:image/png;base64,abc123',
    }

    expect(comment.anchor.type).toBe('element')
    expect(comment.screenshot).toBeDefined()
  })
})

describe('ReviewMode', () => {
  it('accepts text and element values', () => {
    const modes: ReviewMode[] = ['text', 'element']
    expect(modes).toHaveLength(2)
  })
})

describe('Anchor Type Guards', () => {
  it('isElementAnchor identifies element anchors', () => {
    const anchor: ElementAnchor = {
      type: 'element',
      selector: 'section',
      testId: 'hero',
      tagName: 'section',
      rect: { top: 0, left: 0, width: 100, height: 50 },
    }
    expect(isElementAnchor(anchor)).toBe(true)
    expect(isTextAnchor(anchor)).toBe(false)
  })

  it('isTextAnchor identifies text anchors with explicit type', () => {
    const anchor: TextAnchor = {
      type: 'text',
      headingId: 'sec',
      blockIndex: 0,
      textOffset: 0,
      textLength: 10,
    }
    expect(isTextAnchor(anchor)).toBe(true)
    expect(isElementAnchor(anchor)).toBe(false)
  })

  it('isTextAnchor identifies legacy anchors without type field', () => {
    const anchor: CommentAnchor = {
      headingId: 'sec',
      blockIndex: 0,
      textOffset: 0,
      textLength: 10,
    }
    expect(isTextAnchor(anchor)).toBe(true)
    expect(isElementAnchor(anchor)).toBe(false)
  })
})
