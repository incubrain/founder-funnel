export interface HealthResponse {
  ok: true
  service: 'foundry'
  version: string
  siteId: string | null
  timestamp: string
}

/**
 * Pure payload builder for `GET /api/_health`. Kept free of Nitro/H3 globals
 * (`useAppConfig`, `useRuntimeConfig`) so it is unit-testable without a
 * running server — the route handler resolves those and passes plain values.
 */
export function buildHealthPayload(
  version: string | undefined,
  siteId: string | undefined,
  now: Date = new Date(),
): HealthResponse {
  return {
    ok: true,
    service: 'foundry',
    version: version || '',
    siteId: siteId || null,
    timestamp: now.toISOString(),
  }
}
