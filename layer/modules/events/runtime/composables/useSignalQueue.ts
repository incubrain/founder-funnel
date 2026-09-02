import { useDebounceFn, useEventListener } from '@vueuse/core'
import type { SignalInput } from '../types/signal'

const ENDPOINT = '/api/_signals/ingest'
/**
 * Rows buffered before an immediate flush. Raised from 25 with the identity-event
 * stream so a click burst batches instead of firing extra requests; still well
 * under the ingest handler's 100-row cap and under `sendBeacon`'s ~64 KB limit
 * (50 rows ≈ 20 KB).
 */
const MAX_QUEUE = 50

const queue: SignalInput[] = []
let listening = false

/**
 * Client-side batch queue for signal rows. Debounced POST during the session,
 * `sendBeacon` on pagehide so the last rows survive the unload.
 */
export const useSignalQueue = () => {
  const flush = (beacon = false) => {
    if (!import.meta.client || !queue.length) return

    const rows = queue.splice(0, queue.length)
    const body = JSON.stringify({ rows })

    if (beacon && navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'application/json' }))) return

    void $fetch(ENDPOINT, { method: 'POST', body: { rows } }).catch(() => {})
  }

  const flushSoon = useDebounceFn(() => flush(), 800, { maxWait: 4000 })

  if (import.meta.client && !listening) {
    listening = true
    useEventListener(window, 'pagehide', () => flush(true))
  }

  const enqueue = (row: SignalInput) => {
    if (!import.meta.client) return
    queue.push(row)
    if (queue.length >= MAX_QUEUE) flush()
    else void flushSoon()
  }

  return { enqueue, flush }
}
