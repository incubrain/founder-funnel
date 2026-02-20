/**
 * Webhook retry logic with exponential backoff
 *
 * Retries failed webhook deliveries with increasing delays:
 * - Attempt 1: immediate
 * - Attempt 2: 1s delay
 * - Attempt 3: 2s delay
 * - Attempt 4: 4s delay
 *
 * Prevents lead loss due to temporary network issues or service downtime.
 */

interface RetryOptions {
  maxAttempts?: number
  baseDelay?: number
  logger?: {
    set: (data: Record<string, unknown>) => void
    error: (error: Error, context?: Record<string, unknown>) => void
  }
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { maxAttempts = 3, baseDelay = 1000, logger } = options

  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn()

      if (attempt > 1 && logger) {
        logger.set({ retry: { succeeded: true, attempt } })
      }

      return result
    }
    catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxAttempts) {
        logger?.error(lastError, { step: 'webhook-retry-exhausted', attempts: maxAttempts })
        throw lastError
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * (2 ** (attempt - 1))

      logger?.set({ retry: { attempt, nextDelay: delay } })

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Retry failed with no error captured')
}

/**
 * Validate webhook URL against allowed domains
 *
 * Security: Prevents token leakage to malicious URLs
 * Whitelist approach: Only allow known webhook providers
 */
const ALLOWED_WEBHOOK_DOMAINS = [
  'api.telegram.org',
  'hooks.slack.com',
  'discord.com',
  'discordapp.com',
  'webhook.site', // For testing
  'hooks.zapier.com',
  'maker.ifttt.com',
] as const

export function validateWebhookUrl(url: string): { valid: boolean, reason?: string } {
  try {
    const parsed = new URL(url)

    // Must be HTTPS (except localhost for dev)
    if (parsed.protocol !== 'https:' && !parsed.hostname.includes('localhost')) {
      return { valid: false, reason: 'Webhook URLs must use HTTPS' }
    }

    // Check against whitelist
    const isAllowed = ALLOWED_WEBHOOK_DOMAINS.some(domain =>
      parsed.hostname.toLowerCase().includes(domain),
    )

    if (!isAllowed) {
      return {
        valid: false,
        reason: `Domain ${parsed.hostname} not in allowed webhook providers. Allowed: ${ALLOWED_WEBHOOK_DOMAINS.join(', ')}`,
      }
    }

    return { valid: true }
  }
  catch {
    return { valid: false, reason: 'Invalid URL format' }
  }
}
