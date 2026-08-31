import { describe, it, expect } from 'vitest'
import { buildHealthPayload } from '@incubrain/foundry/server/utils/health'

describe('buildHealthPayload', () => {
  it('reports ok with the given version and siteId', () => {
    const payload = buildHealthPayload('0.8.0', 'my-site', new Date('2026-01-01T00:00:00.000Z'))

    expect(payload).toEqual({
      ok: true,
      service: 'foundry',
      version: '0.8.0',
      siteId: 'my-site',
      timestamp: '2026-01-01T00:00:00.000Z',
    })
  })

  it('falls back to an empty version when unset', () => {
    expect(buildHealthPayload(undefined, 'my-site').version).toBe('')
  })

  it('reports siteId as null, not empty string, when unset', () => {
    expect(buildHealthPayload('0.8.0', undefined).siteId).toBeNull()
    expect(buildHealthPayload('0.8.0', '').siteId).toBeNull()
  })

  it('stamps a valid ISO timestamp by default', () => {
    const before = Date.now()
    const payload = buildHealthPayload('0.8.0', 'my-site')
    const after = Date.now()

    const stamped = new Date(payload.timestamp).getTime()
    expect(stamped).toBeGreaterThanOrEqual(before)
    expect(stamped).toBeLessThanOrEqual(after)
  })
})
