import { readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  const { page } = getQuery(event)
  const config = useRuntimeConfig(event)
  const logFile = resolve(process.cwd(), (config as any)._comments.logFile)

  try {
    await access(logFile)
  }
  catch {
    return { comments: [] }
  }

  const content = await readFile(logFile, 'utf-8')
  const comments = content
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line))

  if (page) {
    return { comments: comments.filter((c: any) => c.page === page) }
  }

  return { comments }
})
