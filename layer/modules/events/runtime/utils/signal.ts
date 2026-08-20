import type { EventPayload } from '../types/events'
import type { SignalInput } from '../types/signal'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

export const truncate = (value: unknown, max: number): string | undefined =>
  value === undefined || value === null ? undefined : String(value).slice(0, max)

/** Page + referrer + utm context for the current client navigation. */
export function pageContext(): Pick<SignalInput, 'page' | 'referrer' | 'utm'> {
  if (!import.meta.client) return {}

  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) utm[key] = value.slice(0, 256)
  }

  return {
    page: window.location.pathname,
    referrer: document.referrer || undefined,
    utm: Object.keys(utm).length ? utm : undefined,
  }
}

/** Analytics event payload → signal envelope. */
export function toSignalRow(payload: EventPayload): SignalInput {
  const { userId, ...data } = (payload.data ?? {}) as Record<string, unknown>

  return {
    id: payload.id,
    ts: payload.timestamp,
    kind: 'event',
    name: payload.type,
    visitor: userId ? { anonId: String(userId) } : undefined,
    ...pageContext(),
    data: {
      ...data,
      location: payload.location,
      target: payload.target,
      action: payload.action,
    },
  }
}
