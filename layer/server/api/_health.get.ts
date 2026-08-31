import { buildHealthPayload, type HealthResponse } from '../utils/health'

/**
 * GET /api/_health — cheap liveness + identity check for external monitors
 * (Polaris). No auth, no useStorage/content access: pure computation from
 * build-time config so it stays fast even if the signal buffer or content
 * layer is unhealthy.
 */
export default defineEventHandler((event): HealthResponse => {
  setHeader(event, 'Cache-Control', 'no-store')

  const foundry = useAppConfig().foundry as { version?: string } | undefined
  const siteId = useRuntimeConfig(event).public.siteId as string | undefined

  return buildHealthPayload(foundry?.version, siteId)
})
