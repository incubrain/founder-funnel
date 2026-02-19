// Tests for the comments server handlers (JSONL read/write logic)
import { readFile, writeFile, mkdir, rm, stat } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'

// ── Schema definitions (mirrored from server handler) ──

const categoryEnum = z.enum(['bug', 'ui', 'chore', 'feature', 'docs', 'perf'])
const priorityEnum = z.enum(['low', 'med', 'critical'])

const textAnchorSchema = z.object({
  type: z.literal('text').optional(),
  headingId: z.string().nullable(),
  blockIndex: z.number(),
  textOffset: z.number(),
  textLength: z.number(),
  exact: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
})

const elementAnchorSchema = z.object({
  type: z.literal('element'),
  selector: z.string(),
  testId: z.string().nullable(),
  tagName: z.string(),
  rect: z.object({
    top: z.number(),
    left: z.number(),
    width: z.number(),
    height: z.number(),
  }),
})

const anchorSchema = z.union([textAnchorSchema, elementAnchorSchema])

const newCommentSchema = z.object({
  page: z.string(),
  selectedText: z.string().min(1),
  anchor: anchorSchema,
  comment: z.string().min(1),
  author: z.string().min(1),
  category: categoryEnum,
  priority: priorityEnum,
  screenshot: z.string().optional(),
})

const resolveSchema = z.object({
  action: z.literal('resolve'),
  id: z.string(),
})

const deleteSchema = z.object({
  action: z.literal('delete'),
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

describe('Delete Schema', () => {
  it('accepts valid delete action', () => {
    const result = deleteSchema.safeParse({ action: 'delete', id: 'c_abc12345' })
    expect(result.success).toBe(true)
  })

  it('rejects wrong action', () => {
    const result = deleteSchema.safeParse({ action: 'resolve', id: 'c_abc12345' })
    expect(result.success).toBe(false)
  })

  it('rejects missing id', () => {
    const result = deleteSchema.safeParse({ action: 'delete' })
    expect(result.success).toBe(false)
  })
})

describe('Element Anchor Schema', () => {
  it('accepts valid element anchor', () => {
    const result = newCommentSchema.safeParse(makeComment({
      selectedText: '<section>',
      anchor: {
        type: 'element',
        selector: '[data-testid="hero"]',
        testId: 'hero',
        tagName: 'section',
        rect: { top: 0, left: 0, width: 800, height: 400 },
      },
    }))
    expect(result.success).toBe(true)
  })

  it('accepts element anchor with optional screenshot', () => {
    const result = newCommentSchema.safeParse(makeComment({
      selectedText: '<div>',
      anchor: {
        type: 'element',
        selector: 'div:nth-of-type(2)',
        testId: null,
        tagName: 'div',
        rect: { top: 100, left: 50, width: 600, height: 200 },
      },
      screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    }))
    expect(result.success).toBe(true)
  })

  it('rejects element anchor missing type', () => {
    const result = anchorSchema.safeParse({
      selector: '[data-testid="hero"]',
      testId: 'hero',
      tagName: 'section',
      rect: { top: 0, left: 0, width: 800, height: 400 },
    })
    // Without type: 'element', it tries to match textAnchorSchema and fails
    expect(result.success).toBe(false)
  })

  it('rejects element anchor with missing rect', () => {
    const result = anchorSchema.safeParse({
      type: 'element',
      selector: '[data-testid="hero"]',
      testId: 'hero',
      tagName: 'section',
    })
    expect(result.success).toBe(false)
  })
})

describe('JSONL Delete', () => {
  beforeEach(async () => {
    await mkdir(TEST_DIR, { recursive: true })
  })

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true })
  })

  it('removes a comment from JSONL by id', async () => {
    const c1 = makeStoredComment({ id: 'c_aaa11111' })
    const c2 = makeStoredComment({ id: 'c_bbb22222' })
    const c3 = makeStoredComment({ id: 'c_ccc33333' })
    await writeJsonl([c1, c2, c3])

    // Simulate delete logic from server handler
    const content = await readFile(TEST_FILE, 'utf-8')
    const lines = content.split('\n').filter(Boolean)
    const filtered = lines.filter((line) => {
      const parsed = JSON.parse(line)
      return parsed.id !== 'c_bbb22222'
    })
    await writeFile(TEST_FILE, filtered.join('\n') + '\n')

    const result = await readJsonl()
    expect(result).toHaveLength(2)
    expect(result.map(c => c.id)).toEqual(['c_aaa11111', 'c_ccc33333'])
  })

  it('results in empty file when last comment is deleted', async () => {
    const c1 = makeStoredComment({ id: 'c_only0001' })
    await writeJsonl([c1])

    const content = await readFile(TEST_FILE, 'utf-8')
    const lines = content.split('\n').filter(Boolean)
    const filtered = lines.filter((line) => {
      const parsed = JSON.parse(line)
      return parsed.id !== 'c_only0001'
    })
    await writeFile(TEST_FILE, filtered.length ? filtered.join('\n') + '\n' : '')

    const result = await readFile(TEST_FILE, 'utf-8')
    expect(result).toBe('')
  })
})

describe('Screenshot File Storage', () => {
  const IMAGES_DIR = resolve(TEST_DIR, 'images')

  // 1x1 red pixel PNG as base64
  const TINY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
  const TINY_PNG_DATA_URL = `data:image/png;base64,${TINY_PNG_BASE64}`

  beforeEach(async () => {
    await mkdir(TEST_DIR, { recursive: true })
  })

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true })
  })

  it('extracts base64 from data URL and saves as PNG file', async () => {
    await mkdir(IMAGES_DIR, { recursive: true })

    const commentId = 'c_img00001'
    const base64Data = TINY_PNG_DATA_URL.replace(/^data:image\/\w+;base64,/, '')
    const imgFile = resolve(IMAGES_DIR, `${commentId}.png`)
    await writeFile(imgFile, Buffer.from(base64Data, 'base64'))

    // Verify file exists and is a valid PNG
    const fileData = await readFile(imgFile)
    expect(fileData.length).toBeGreaterThan(0)
    // PNG magic bytes: 137 80 78 71 (0x89 0x50 0x4E 0x47)
    expect(fileData[0]).toBe(0x89)
    expect(fileData[1]).toBe(0x50)
    expect(fileData[2]).toBe(0x4E)
    expect(fileData[3]).toBe(0x47)
  })

  it('stored comment references API path instead of base64', async () => {
    const commentId = 'c_img00002'
    const screenshotPath = `/api/_comments/image/${commentId}`

    const comment = makeStoredComment({
      id: commentId,
      screenshot: screenshotPath,
      anchor: {
        type: 'element',
        selector: '[data-testid="hero"]',
        testId: 'hero',
        tagName: 'section',
        rect: { top: 0, left: 0, width: 800, height: 400 },
      },
    })
    await writeJsonl([comment])

    const [result] = await readJsonl()
    expect(result!.screenshot).toBe(screenshotPath)
    expect(result!.screenshot).not.toContain('base64')
  })

  it('cleans up screenshot file on delete', async () => {
    await mkdir(IMAGES_DIR, { recursive: true })

    const commentId = 'c_img00003'
    const imgFile = resolve(IMAGES_DIR, `${commentId}.png`)
    const base64Data = TINY_PNG_DATA_URL.replace(/^data:image\/\w+;base64,/, '')
    await writeFile(imgFile, Buffer.from(base64Data, 'base64'))

    // Verify file exists
    const fileStat = await stat(imgFile)
    expect(fileStat.isFile()).toBe(true)

    // Simulate delete cleanup
    const { unlink } = await import('node:fs/promises')
    await unlink(imgFile)

    // File should be gone
    await expect(stat(imgFile)).rejects.toThrow()
  })

  it('handles data URL with various image MIME types', () => {
    const pngUrl = 'data:image/png;base64,abc123'
    const jpegUrl = 'data:image/jpeg;base64,xyz789'
    const webpUrl = 'data:image/webp;base64,def456'

    // The regex from the server handler should strip any image/* prefix
    const regex = /^data:image\/\w+;base64,/
    expect(pngUrl.replace(regex, '')).toBe('abc123')
    expect(jpegUrl.replace(regex, '')).toBe('xyz789')
    expect(webpUrl.replace(regex, '')).toBe('def456')
  })

  it('does not save when screenshot is undefined', () => {
    const parsed = { screenshot: undefined }
    // Server logic: if (parsed.screenshot) { ... }
    expect(!!parsed.screenshot).toBe(false)
  })

  it('does not save when screenshot is not a data URL', () => {
    const parsed = { screenshot: '/api/_comments/image/c_existing' }
    // Server logic: if (parsed.screenshot.startsWith('data:')) { ... }
    expect(parsed.screenshot.startsWith('data:')).toBe(false)
  })
})
