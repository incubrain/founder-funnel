import { z } from 'zod'
import { appendSignal } from '../utils/signal-buffer'
import { classifyVisitor } from '../utils/visitor-class'

// Sized for the identity-event stream (ui.click / ui.section / ui.page): the
// client batches at most `MAX_QUEUE` rows per POST (useSignalQueue.ts), so
// MAX_ROWS is that with headroom and MAX_BODY_BYTES covers 100 fat rows.
const MAX_BODY_BYTES = 128 * 1024
const MAX_ROWS = 100

const rowSchema = z.object({
  id: z.string().max(64).optional(),
  ts: z.number().optional(),
  kind: z.enum(['event', 'log']),
  name: z.string().min(1).max(64),
  severity: z.enum(['error', 'warning']).optional(),
  visitor: z.object({
    anonId: z.string().max(128).optional(),
    // Accepted but ignored — `class` is always overwritten server-side below.
    class: z.enum(['human', 'agent', 'bot']).optional(),
  }).optional(),
  page: z.string().max(512).optional(),
  referrer: z.string().max(512).optional(),
  utm: z.record(z.string().max(32), z.string().max(256)).optional(),
  review: z.string().max(128).optional(),
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
  const raw = await readRawBody(event)
  if (raw && raw.length > MAX_BODY_BYTES) {
    throw createError({
      statusCode: 413,
      statusMessage: `Signal payload too large: ${raw.length} bytes, limit is ${MAX_BODY_BYTES}`,
    })
  }

  const parsed = ingestSchema.safeParse(raw ? JSON.parse(raw.toString()) : {})

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: `Signal ingest validation failed: ${parsed.error.issues.map((issue: { message: string }) => issue.message).join(', ')}`,
    })
  }

  // Classify once per request — client-supplied `visitor.class` is never trusted.
  const visitorClass = classifyVisitor(getHeader(event, 'user-agent'))

  for (const row of parsed.data.rows) {
    await appendSignal({
      ...row,
      visitor: { ...row.visitor, class: visitorClass },
    }, event)
  }

  return { accepted: parsed.data.rows.length }
})
