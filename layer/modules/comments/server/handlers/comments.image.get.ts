import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

interface CommentsConfig {
  _comments: { logFile: string }
}

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing image ID' })
  }

  const config = useRuntimeConfig(event) as unknown as CommentsConfig
  const logFile = resolve(process.cwd(), config._comments.logFile)
  const imgFile = resolve(dirname(logFile), 'images', `${id}.png`)

  try {
    const data = await readFile(imgFile)
    setResponseHeader(event, 'content-type', 'image/png')
    setResponseHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
    console.debug(`[comments] Serving image: ${imgFile} (${data.length} bytes)`)
    return data
  }
  catch (err) {
    console.warn(`[comments] Image not found: ${imgFile}`, err)
    throw createError({ statusCode: 404, message: 'Image not found' })
  }
})
