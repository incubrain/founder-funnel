import { readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'

interface CommentsConfig {
  _comments: { logFile: string }
}

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  const { page } = getQuery(event)
  const config = useRuntimeConfig(event) as unknown as CommentsConfig
  const logFile = resolve(process.cwd(), config._comments.logFile)

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
    return { comments: comments.filter((c: { page: string }) => c.page === page) }
  }

  return { comments }
})
