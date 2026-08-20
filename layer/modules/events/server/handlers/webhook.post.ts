import { z } from 'zod'
import { appendSignal } from '../utils/signal-buffer'

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
  const log = useLogger(event)
  const body = await readBody(event)
  const { formData, antiSpam } = body

  log.set({ lead: { email: formData?.email } })

  // === MINIMAL ANTI-SPAM CHECK ===
  // Honeypot filled in, or submitted faster than a human could type => bot.
  const isHoneypot = Boolean(antiSpam?.honeypot?.trim())
  const isTooFast = typeof antiSpam?.timeOnForm === 'number' && antiSpam.timeOnForm < MIN_FORM_TIME_MS

  if (isHoneypot || isTooFast) {
    log.set({ rejected: isHoneypot ? 'honeypot' : 'too-fast' })
    // Pretend success so bots don't learn they were caught
    return {
      success: true,
      message: 'Thanks! Check your email.',
    }
  }

  // === PAYLOAD VALIDATION ===

  const parsed = captureSchema.safeParse({ formData })

  if (!parsed.success) {
    log.error(new Error('Validation failed'), { step: 'schema-validation' })
    throw createEvlogError({
      status: 400,
      message: 'Email capture validation failed',
      why: parsed.error.issues.map((e: { message: string }) => e.message).join(', '),
      fix: 'Check the submitted form data matches the expected schema',
    })
  }

  // === SIGNAL BUFFER (what Polaris pulls) ===

  await appendSignal({
    kind: 'event',
    name: 'form_submitted',
    data: { formData: parsed.data.formData },
  }, event)

  // === WEBHOOK FORWARD (best-effort notification, doesn't block the response) ===

  const config = useRuntimeConfig()
  const webhookUrl = config.webhookUrl

  if (webhookUrl) {
    void (async () => {
      try {
        await $fetch(webhookUrl, {
          method: 'POST',
          body: parsed.data.formData,
        })
      }
      catch (error) {
        log.error(error instanceof Error ? error : new Error(String(error)), { step: 'webhook-forward' })
      }
    })()
  }

  return {
    success: true,
    message: 'Thanks! Check your email.',
  }
})
