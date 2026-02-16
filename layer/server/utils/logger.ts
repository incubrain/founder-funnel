// server/utils/logger.ts
import { consola } from 'consola'

/**
 * Create a tagged logger instance for server-side logging outside of request handlers.
 * For request-scoped logging, use `useLogger(event)` from evlog instead.
 * @param tag - Tag to identify the logger (e.g., 'webhook', 'auth', 'email')
 */
export function createServerLogger(tag: string) {
  return consola.withTag(tag)
}

// Pre-configured loggers for common server operations
export const logger = createServerLogger('api')

// Note: useLogger, createEvlogError, and parseError are auto-imported
// by the evlog/nuxt module — no re-export needed here.
