import { readFile, appendFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { z } from 'zod'

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

interface CommentsConfig {
  _comments: { logFile: string }
}

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  const body = await readBody(event)
  const config = useRuntimeConfig(event) as unknown as CommentsConfig
  const logFile = resolve(process.cwd(), config._comments.logFile)

  // Delete a comment
  if (body.action === 'delete') {
    const { id } = deleteSchema.parse(body)

    let content: string
    try {
      content = await readFile(logFile, 'utf-8')
    }
    catch {
      throw createError({ statusCode: 404, message: 'No comments file' })
    }

    const lines = content.split('\n').filter(Boolean)
    const filtered = lines.filter((line) => {
      const parsed = JSON.parse(line)
      return parsed.id !== id
    })

    if (filtered.length === lines.length) {
      throw createError({ statusCode: 404, message: 'Comment not found' })
    }

    await writeFile(logFile, filtered.length ? filtered.join('\n') + '\n' : '')
    return { success: true }
  }

  // Resolve an existing comment
  if (body.action === 'resolve') {
    const { id } = resolveSchema.parse(body)

    let content: string
    try {
      content = await readFile(logFile, 'utf-8')
    }
    catch {
      throw createError({ statusCode: 404, message: 'No comments file' })
    }

    const lines = content.split('\n').filter(Boolean)
    let found = false
    const updated = lines.map((line) => {
      const parsed = JSON.parse(line)
      if (parsed.id === id) {
        found = true
        parsed.status = 'resolved'
        parsed.resolvedAt = new Date().toISOString()
        return JSON.stringify(parsed)
      }
      return line
    })

    if (!found) {
      throw createError({ statusCode: 404, message: 'Comment not found' })
    }

    await writeFile(logFile, updated.join('\n') + '\n')
    return { success: true }
  }

  // Update category/priority on an existing comment
  if (body.action === 'update') {
    const { id, category, priority } = updateSchema.parse(body)

    let content: string
    try {
      content = await readFile(logFile, 'utf-8')
    }
    catch {
      throw createError({ statusCode: 404, message: 'No comments file' })
    }

    const lines = content.split('\n').filter(Boolean)
    let found = false
    const updated = lines.map((line) => {
      const parsed = JSON.parse(line)
      if (parsed.id === id) {
        found = true
        if (category) parsed.category = category
        if (priority) parsed.priority = priority
        return JSON.stringify(parsed)
      }
      return line
    })

    if (!found) {
      throw createError({ statusCode: 404, message: 'Comment not found' })
    }

    await writeFile(logFile, updated.join('\n') + '\n')
    return { success: true }
  }

  // Create a new comment
  const parsed = newCommentSchema.parse(body)
  const comment = {
    id: `c_${crypto.randomUUID().slice(0, 8)}`,
    ...parsed,
    status: 'open' as const,
    createdAt: new Date().toISOString(),
  }

  await mkdir(dirname(logFile), { recursive: true })
  await appendFile(logFile, JSON.stringify(comment) + '\n')

  return comment
})
