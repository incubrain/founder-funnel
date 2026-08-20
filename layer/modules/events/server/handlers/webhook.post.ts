import { z } from 'zod'
import { appendSignal } from '../utils/signal-buffer'
import { classifyVisitor } from '../utils/visitor-class'

// Strict schema matching FieldDef types from useFormCapture
const captureSchema = z.object({
  formData: z.record(z.string(), z.union([
    z.string(),
    z.number(),
    z.boolean(),
  ])),
  antiSpam: z.object({
    honeypot: z.string().optional(),
    timeOnForm: z.number().optional(),
    jsToken: z.string().optional(),
  }).optional(),
})

// Minimum time (ms) a real human takes to fill the form
const MIN_FORM_TIME_MS = 2000

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { formData, antiSpam } = body

  // === MINIMAL ANTI-SPAM CHECK ===
  // Honeypot filled in, or submitted faster than a human could type => bot.
  const isHoneypot = Boolean(antiSpam?.honeypot?.trim())
  const isTooFast = typeof antiSpam?.timeOnForm === 'number' && antiSpam.timeOnForm < MIN_FORM_TIME_MS

  if (isHoneypot || isTooFast) {
    // Pretend success so bots don't learn they were caught
    return {
      success: true,
      message: 'Thanks! Check your email.',
    }
  }

  // === PAYLOAD VALIDATION ===

  const parsed = captureSchema.safeParse({ formData })

  if (!parsed.success) {
    // Thrown errors are picked up by the Nitro error hook and land in the
    // signal buffer as a `kind: 'log'` row — don't append one here too.
    throw createError({
      statusCode: 400,
      statusMessage: `Form capture validation failed: ${parsed.error.issues.map((e: { message: string }) => e.message).join(', ')}`,
    })
  }

  // === SIGNAL BUFFER (what Polaris pulls) ===

  await appendSignal({
    kind: 'event',
    name: 'form_submitted',
    visitor: { class: classifyVisitor(getHeader(event, 'user-agent')) },
    data: { formData: parsed.data.formData },
  }, event)

  return {
    success: true,
    message: 'Thanks! Check your email.',
  }
})
