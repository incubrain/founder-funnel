import { readSignals, resolveSite } from '../utils/signal-buffer'
import { checkExportAuth, parseExportParams } from '../utils/signal-export'
import type { SignalExportResponse } from '../../runtime/types/signal'

/**
 * GET /api/_signals/export?since=<seq>&limit=<n≤1000>
 * Cursor-based pull for external consumers (Polaris). Bearer auth required.
 */
export default defineEventHandler(async (event): Promise<SignalExportResponse> => {
  const log = useLogger(event)
  const config = useRuntimeConfig(event)

  const auth = checkExportAuth(
    getHeader(event, 'authorization'),
    config.signalExportToken as string | undefined,
  )

  if (!auth.ok) {
    log.set({ export: { rejected: auth.status } })
    throw createEvlogError({
      status: auth.status,
      message: auth.message,
      why: auth.why,
      fix: auth.fix,
    })
  }

  const { since, limit } = parseExportParams(getQuery(event))
  const { rows, cursor } = await readSignals(since, limit)

  log.set({ export: { since, limit, returned: rows.length, cursor } })

  return { rows, cursor, site: resolveSite(event) }
})
