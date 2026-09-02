import { readSignals, resolveSite } from '../utils/signal-buffer'
import { checkExportAuth, parseExportParams } from '../utils/signal-export'
import type { SignalExportResponse } from '../../runtime/types/signal'

/**
 * GET /api/_signals/export?since=<seq>&limit=<n≤2000>
 * Cursor-based pull for external consumers (Polaris). Bearer auth required.
 */
export default defineEventHandler(async (event): Promise<SignalExportResponse> => {
  const config = useRuntimeConfig(event)

  const auth = checkExportAuth(
    getHeader(event, 'authorization'),
    config.signalExportToken as string | undefined,
  )

  if (!auth.ok) {
    throw createError({
      statusCode: auth.status,
      statusMessage: `${auth.message}: ${auth.why}`,
    })
  }

  const { since, limit } = parseExportParams(getQuery(event))
  const { rows, cursor } = await readSignals(since, limit)

  return { rows, cursor, site: resolveSite(event) }
})
