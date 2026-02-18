// Tests for the comments server handlers (JSONL read/write logic)
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'

// ── Schema definitions (mirrored from server handler) ──

const categoryEnum = z.enum(['bug', 'ui', 'chore', 'feature', 'docs', 'perf'])
const priorityEnum = z.enum(['low', 'med', 'critical'])

const newCommentSchema = z.object({
  page: z.string(),
  selectedText: z.string().min(1),
  anchor: z.object({
    headingId: z.string().nullable(),
    blockIndex: z.number(),
    textOffset: z.number(),
    textLength: z.number(),
  }),
  comment: z.string().min(1),
  author: z.string().min(1),
  category: categoryEnum,
  priority: priorityEnum,
})

const resolveSchema = z.object({
  action: z.literal('resolve'),
  id: z.string(),
})

const updateSchema = z.object({
  action: z.literal('update'),
  id: z.string(),
  category: categoryEnum.optional(),
  priority: priorityEnum.optional(),
})

// ── Test fixtures ──

function makeComment(overrides: Record<string, unknown> = {}) {
  return {
    page: '/docs/getting-started/introduction',
    selectedText: 'Foundry is a Nuxt Layer',
    anchor: {
      headingId: 'what-is-foundry',
      blockIndex: 0,
      textOffset: 0,
      textLength: 23,
    },
    comment: 'This is a test comment',
    author: 'tester',
    category: 'docs',
    priority: 'low',
    ...overrides,
  }
}

function makeStoredComment(overrides: Record<string, unknown> = {}) {
  return {
    id: 'c_test1234',
    ...makeComment(),
    status: 'open',
    createdAt: '2026-02-18T00:00:00.000Z',
    ...overrides,
  }
}

// ── JSONL helper (mirrors server logic) ──

const TEST_DIR = resolve(import.meta.dirname, '.tmp-comments-test')
const TEST_FILE = resolve(TEST_DIR, 'review.jsonl')

async function writeJsonl(comments: Record<string, unknown>[]) {
  await mkdir(dirname(TEST_FILE), { recursive: true })
  const content = comments.map(c => JSON.stringify(c)).join('\n') + '\n'
  await writeFile(TEST_FILE, content)
}

async function readJsonl(): Promise<Record<string, unknown>[]> {
  const content = await readFile(TEST_FILE, 'utf-8')
  return content.split('\n').filter(Boolean).map(line => JSON.parse(line))
}

// ── Tests ──

describe('Comment Schemas', () => {
  describe('newCommentSchema', () => {
    it('accepts valid comment', () => {
      const result = newCommentSchema.safeParse(makeComment())
      expect(result.success).toBe(true)
    })

    it('requires all category values', () => {
      for (const cat of ['bug', 'ui', 'chore', 'feature', 'docs', 'perf']) {
        const result = newCommentSchema.safeParse(makeComment({ category: cat }))
        expect(result.success).toBe(true)
      }
    })

    it('requires all priority values', () => {
      for (const pri of ['low', 'med', 'critical']) {
        const result = newCommentSchema.safeParse(makeComment({ priority: pri }))
        expect(result.success).toBe(true)
      }
    })

    it('rejects invalid category', () => {
      const result = newCommentSchema.safeParse(makeComment({ category: 'invalid' }))
      expect(result.success).toBe(false)
    })

    it('rejects invalid priority', () => {
      const result = newCommentSchema.safeParse(makeComment({ priority: 'invalid' }))
      expect(result.success).toBe(false)
    })

    it('rejects empty comment', () => {
      const result = newCommentSchema.safeParse(makeComment({ comment: '' }))
      expect(result.success).toBe(false)
    })

    it('rejects empty author', () => {
      const result = newCommentSchema.safeParse(makeComment({ author: '' }))
      expect(result.success).toBe(false)
    })

    it('rejects empty selectedText', () => {
      const result = newCommentSchema.safeParse(makeComment({ selectedText: '' }))
      expect(result.success).toBe(false)
    })

    it('requires anchor fields', () => {
      const result = newCommentSchema.safeParse(makeComment({ anchor: {} }))
      expect(result.success).toBe(false)
    })

    it('allows null headingId', () => {
      const result = newCommentSchema.safeParse(
        makeComment({ anchor: { headingId: null, blockIndex: 0, textOffset: 0, textLength: 5 } }),
      )
      expect(result.success).toBe(true)
    })
  })

  describe('resolveSchema', () => {
    it('accepts valid resolve action', () => {
      const result = resolveSchema.safeParse({ action: 'resolve', id: 'c_abc12345' })
      expect(result.success).toBe(true)
    })

    it('rejects wrong action', () => {
      const result = resolveSchema.safeParse({ action: 'update', id: 'c_abc12345' })
      expect(result.success).toBe(false)
    })

    it('rejects missing id', () => {
      const result = resolveSchema.safeParse({ action: 'resolve' })
      expect(result.success).toBe(false)
    })
  })

  describe('updateSchema', () => {
    it('accepts category update', () => {
      const result = updateSchema.safeParse({ action: 'update', id: 'c_abc12345', category: 'bug' })
      expect(result.success).toBe(true)
    })

    it('accepts priority update', () => {
      const result = updateSchema.safeParse({ action: 'update', id: 'c_abc12345', priority: 'critical' })
      expect(result.success).toBe(true)
    })

    it('accepts both fields', () => {
      const result = updateSchema.safeParse({ action: 'update', id: 'c_abc12345', category: 'ui', priority: 'med' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid category in update', () => {
      const result = updateSchema.safeParse({ action: 'update', id: 'c_abc12345', category: 'invalid' })
      expect(result.success).toBe(false)
    })
  })
})

describe('JSONL Storage', () => {
  beforeEach(async () => {
    await mkdir(TEST_DIR, { recursive: true })
  })

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true })
  })

  it('writes and reads a single comment', async () => {
    const comment = makeStoredComment()
    await writeJsonl([comment])
    const result = await readJsonl()
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(comment)
  })

  it('appends multiple comments', async () => {
    const c1 = makeStoredComment({ id: 'c_aaa11111' })
    const c2 = makeStoredComment({ id: 'c_bbb22222', category: 'bug', priority: 'critical' })
    await writeJsonl([c1, c2])
    const result = await readJsonl()
    expect(result).toHaveLength(2)
    expect(result[0]!.id).toBe('c_aaa11111')
    expect(result[1]!.id).toBe('c_bbb22222')
  })

  it('preserves category and priority through write/read cycle', async () => {
    const comment = makeStoredComment({ category: 'perf', priority: 'critical' })
    await writeJsonl([comment])
    const [result] = await readJsonl()
    expect(result!.category).toBe('perf')
    expect(result!.priority).toBe('critical')
  })

  it('can update a comment in-place (simulate resolve)', async () => {
    const c1 = makeStoredComment({ id: 'c_aaa11111' })
    const c2 = makeStoredComment({ id: 'c_bbb22222' })
    await writeJsonl([c1, c2])

    // Simulate resolve: read, modify, rewrite
    const lines = await readJsonl()
    const updated = lines.map((line) => {
      if (line.id === 'c_aaa11111') {
        return { ...line, status: 'resolved', resolvedAt: '2026-02-18T01:00:00.000Z' }
      }
      return line
    })
    await writeJsonl(updated)

    const result = await readJsonl()
    expect(result).toHaveLength(2)
    expect(result[0]!.status).toBe('resolved')
    expect(result[0]!.resolvedAt).toBe('2026-02-18T01:00:00.000Z')
    expect(result[1]!.status).toBe('open')
  })

  it('can update category/priority in-place', async () => {
    const comment = makeStoredComment({ category: 'docs', priority: 'low' })
    await writeJsonl([comment])

    const lines = await readJsonl()
    const updated = lines.map((line) => {
      if (line.id === 'c_test1234') {
        return { ...line, category: 'bug', priority: 'critical' }
      }
      return line
    })
    await writeJsonl(updated)

    const [result] = await readJsonl()
    expect(result!.category).toBe('bug')
    expect(result!.priority).toBe('critical')
  })

  it('filters comments by page', async () => {
    const c1 = makeStoredComment({ id: 'c_aaa', page: '/docs/intro' })
    const c2 = makeStoredComment({ id: 'c_bbb', page: '/docs/quickstart' })
    const c3 = makeStoredComment({ id: 'c_ccc', page: '/docs/intro' })
    await writeJsonl([c1, c2, c3])

    const all = await readJsonl()
    const filtered = all.filter(c => c.page === '/docs/intro')
    expect(filtered).toHaveLength(2)
    expect(filtered.every(c => c.page === '/docs/intro')).toBe(true)
  })
})

describe('Comment ID Generation', () => {
  it('generates unique IDs with c_ prefix', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      const id = `c_${crypto.randomUUID().slice(0, 8)}`
      expect(id).toMatch(/^c_[a-f0-9]{8}$/)
      ids.add(id)
    }
    // All 100 should be unique
    expect(ids.size).toBe(100)
  })
})
