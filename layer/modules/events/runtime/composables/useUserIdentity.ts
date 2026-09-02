// composables/useUserIdentity.ts

/**
 * Anonymous user identity for cross-session tracking
 *
 * Generates a unique ID on first call and persists in localStorage.
 * Subsequent calls return the existing ID.
 *
 * Uses Web Crypto API (built-in, no dependencies)
 */
/** Only used when persistent storage is unavailable — see the catch in `getUserId`. */
let volatileUserId: string | undefined

export const useUserIdentity = () => {
  const { local } = useAppStorage()
  const USER_ID_KEY = 'userId'

  /**
   * Get or create user ID
   * - Returns existing ID if found in localStorage
   * - Generates new ID on first call and persists it
   * - Returns empty string on server (SSR guard)
   */
  const getUserId = (): string => {
    // SSR guard
    if (import.meta.server) return ''

    try {
      // Check if ID already exists
      let userId = local.get(USER_ID_KEY)

      // If not, create and store it
      if (!userId) {
        userId = `user_${crypto.randomUUID()}`
        local.set(USER_ID_KEY, userId)
      }

      return userId
    }
    catch {
      // localStorage can throw outright — private mode, blocked site data. Fall
      // back to a per-page-load id so rows still correlate with each other
      // instead of the whole event pipeline throwing on every visitor.
      volatileUserId ||= `user_${crypto.randomUUID()}`
      return volatileUserId
    }
  }

  return { getUserId }
}
