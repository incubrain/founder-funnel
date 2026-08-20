import { z } from 'zod'
import { appendSignal } from '../utils/signal-buffer'

const MAX_BODY_BYTES = 64 * 1024
const MAX_ROWS = 50

const rowSchema = z.object({
  id: z.string().max(64).optional(),
  ts: z.number().optional(),
  kind: z.enum(['event', 'log']),
  name: z.string().min(1).max(64),
  severity: z.enum(['error', 'warning']).optional(),
  visitor: z.object({
    anonId: z.string().max(128).optional(),
    class: z.enum(['human', 'agent', 'bot']).optional(),
  }).optional(),
  page: z.string().max(512).optional(),
  referrer: z.string().max(512).optional(),
  utm: z.record(z.string().max(32), z.string().max(256)).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
})

const ingestSchema = z.object({
  rows: z.array(rowSchema).min(1).max(MAX_ROWS),
})

/**
 * POST /api/_signals/ingest — client-originated rows (events + client errors).
 * Size-capped, zod-validated, appended to the signal buffer.
 */
export default defineEventHandler(async (event) => {
  const log = useLogger(event)

  const raw = await readRawBody(event)
  if (raw && raw.length > MAX_BODY_BYTES) {
    throw createEvlogError({
      status: 413,
      message: 'Signal payload too large',
      why: `Body was ${raw.length} bytes, limit is ${MAX_BODY_BYTES}`,
      fix: 'Send fewer rows per batch or trim the data payload',
    })
  }

  const parsed = ingestSchema.safeParse(raw ? JSON.parse(raw.toString()) : {})

  if (!parsed.success) {
    throw createEvlogError({
      status: 400,
      message: 'Signal ingest validation failed',
      why: parsed.error.issues.map((issue: { message: string }) => issue.message).join(', '),
      fix: 'POST { rows: SignalRow[] } matching the signal envelope',
    })
  }

  for (const row of parsed.data.rows) {
    await appendSignal(row, event)
  }

  log.set({ ingest: { rows: parsed.data.rows.length } })

  return { accepted: parsed.data.rows.length }
})
