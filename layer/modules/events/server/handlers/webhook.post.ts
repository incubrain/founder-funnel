import { z } from 'zod'
import { formatDiscordMessage } from '../formatters/discord'
import { formatSlackMessage } from '../formatters/slack'
import { formatTelegramMessage } from '../formatters/telegram'
import { RateLimiter, validateAntiSpam } from '../utils/anti-spam'

const captureSchema = z.object({
  formData: z.record(z.string(), z.any()),
  antiSpam: z.any().optional(),
})

// Global rate limiter instance
const rateLimiter = new RateLimiter()

type WebhookPlatform = 'telegram' | 'slack' | 'discord' | 'unknown'

interface WebhookResult {
  platform: string
  url: string
  success: boolean
}

function detectPlatform(url: string): WebhookPlatform {
  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes('api.telegram.org')) return 'telegram'
  if (lowerUrl.includes('hooks.slack.com')) return 'slack'
  if (
    lowerUrl.includes('discord.com/api/webhooks')
    || lowerUrl.includes('discordapp.com/api/webhooks')
  )
    return 'discord'

  return 'unknown'
}

export default defineEventHandler(async (event) => {
  const log = useLogger(event)
  const body = await readBody(event)
  const { formData, antiSpam } = body

  // Get IP for rate limiting
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  log.set({ lead: { email: formData?.email }, ip: ip.substring(0, 10) + '...' })

  // === ANTI-SPAM VALIDATION ===

  const flags = validateAntiSpam(antiSpam || {})
  log.set({ antiSpam: { score: flags.score, honeypot: flags.honeypot, fast: flags.fast, noJs: flags.noJs } })

  // HARD REJECT: Honeypot triggered
  if (flags.honeypot) {
    log.set({ rejected: 'honeypot' })
    return {
      success: true,
      message: 'Thanks! Check your email.',
    }
  }

  // HARD REJECT: Rate limit exceeded
  if (rateLimiter.check(ip)) {
    log.set({ rejected: 'rate-limit' })
    throw createEvlogError({
      status: 429,
      message: 'Too many submissions. Please try again in a few minutes.',
      why: `IP ${ip.substring(0, 10)}... exceeded rate limit`,
      fix: 'Wait 15 minutes before submitting again',
    })
  }

  // === EMAIL VALIDATION ===

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

  const config = useRuntimeConfig()
  const webhookUrl = config.webhookUrl

  if (!webhookUrl) {
    throw createEvlogError({
      status: 500,
      message: 'Webhook URL is missing',
      why: 'NUXT_WEBHOOK_URL environment variable is not set',
      fix: 'Add NUXT_WEBHOOK_URL to your .env file. Supports Telegram, Slack, or Discord webhook URLs.',
    })
  }

  // Parse multiple webhook URLs (comma-separated)
  const webhookUrls = webhookUrl
    .split(',')
    .map(url => url.trim())
    .filter(Boolean)

  if (webhookUrls.length === 0) {
    throw createEvlogError({
      status: 500,
      message: 'No valid webhook URLs found',
      why: 'NUXT_WEBHOOK_URL is set but contains no valid URLs after parsing',
      fix: 'Check NUXT_WEBHOOK_URL format — use comma-separated URLs for multiple destinations',
    })
  }

  const telegramChatId = config.telegramChatId

  log.set({ webhooks: { count: webhookUrls.length } })

  // Send to all webhooks in parallel
  const results = await Promise.allSettled(
    webhookUrls.map(async (url) => {
      const platform = detectPlatform(url)

      let message
      try {
        if (platform === 'discord') {
          message = formatDiscordMessage({
            formData: parsed.data.formData,
            flags,
          })
        }
        else if (platform === 'slack') {
          message = formatSlackMessage({
            formData: parsed.data.formData,
            flags,
          })
        }
        else if (platform === 'telegram') {
          message = formatTelegramMessage(
            { formData: parsed.data.formData, flags },
            telegramChatId,
          )
        }
        else {
          message = {
            text: `New Lead: ${parsed.data.formData?.email} - ${JSON.stringify(parsed.data.formData)}`,
          }
        }
      }
      catch (error) {
        log.error(error instanceof Error ? error : new Error(String(error)), { step: `format-${platform}` })
        throw error
      }

      try {
        const response = await $fetch(url, {
          method: 'POST',
          body: message,
        })

        // Validate Telegram response
        if (
          platform === 'telegram'
          && response
          && typeof response === 'object'
        ) {
          const telegramResponse = response as {
            ok: boolean
            description?: string
            error_code?: number
          }

          if (!telegramResponse.ok) {
            log.error(new Error(telegramResponse.description || 'Telegram API returned ok: false'), {
              step: `delivery-${platform}`,
              errorCode: telegramResponse.error_code,
            })

            throw new Error(
              telegramResponse.description || 'Telegram API returned ok: false',
            )
          }
        }

        return { platform, url: url.substring(0, 30) + '...', success: true }
      }
      catch (error: unknown) {
        log.error(error instanceof Error ? error : new Error(String(error)), {
          step: `delivery-${platform}`,
          url: url.substring(0, 10) + '...',
        })

        throw error
      }
    }),
  )

  // Analyze results
  const successful = results.filter(r => r.status === 'fulfilled')
  const failed = results.filter(r => r.status === 'rejected')

  log.set({
    delivery: {
      total: webhookUrls.length,
      successful: successful.length,
      failed: failed.length,
      platforms: successful.map(r => (r as PromiseFulfilledResult<WebhookResult>).value.platform),
    },
  })

  // Return success if at least one webhook succeeded
  if (successful.length > 0) {
    return {
      success: true,
      delivered: successful.length,
      failed: failed.length,
      platforms: successful.map(
        r => (r as PromiseFulfilledResult<WebhookResult>).value,
      ),
    }
  }

  // All failed - throw error
  throw createEvlogError({
    status: 500,
    message: `Failed to deliver to all ${webhookUrls.length} configured webhook(s)`,
    why: failed.map((r, i) => `${webhookUrls[i]?.substring(0, 30)}...: ${(r as PromiseRejectedResult).reason?.message || 'Unknown error'}`).join('; '),
    fix: 'Check webhook URLs are valid and the destination services are reachable',
  })
})
