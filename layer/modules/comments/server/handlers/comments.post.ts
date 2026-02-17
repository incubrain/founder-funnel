import { readFile, appendFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { z } from 'zod'

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
})

const resolveSchema = z.object({
  action: z.literal('resolve'),
  id: z.string(),
})

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  const body = await readBody(event)
  const config = useRuntimeConfig(event)
  const logFile = resolve(process.cwd(), (config as any)._comments.logFile)

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
