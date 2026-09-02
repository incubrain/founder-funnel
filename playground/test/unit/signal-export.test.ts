import { describe, it, expect } from 'vitest'
import {
  checkExportAuth,
  parseExportParams,
} from '@incubrain/foundry/modules/events/server/utils/signal-export'

const TOKEN = 'super-secret-token'

describe('checkExportAuth', () => {
  it('accepts a matching bearer token', () => {
    expect(checkExportAuth(`Bearer ${TOKEN}`, TOKEN)).toEqual({ ok: true })
  })

  it('rejects a missing Authorization header with 401', () => {
    const result = checkExportAuth(undefined, TOKEN)

    expect(result.ok).toBe(false)
    expect(result).toMatchObject({ status: 401 })
  })

  it('rejects a wrong token with 401', () => {
    const result = checkExportAuth('Bearer nope', TOKEN)

    expect(result.ok).toBe(false)
    expect(result).toMatchObject({ status: 401 })
  })

  it('rejects a non-bearer scheme with 401', () => {
    expect(checkExportAuth(`Basic ${TOKEN}`, TOKEN)).toMatchObject({ status: 401 })
  })

  it('is never open by default — unconfigured token returns 503', () => {
    expect(checkExportAuth(`Bearer ${TOKEN}`, '')).toMatchObject({ status: 503 })
    expect(checkExportAuth(undefined, undefined)).toMatchObject({ status: 503 })
  })

  it('explains how to fix a 503', () => {
    const result = checkExportAuth(undefined, '')

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.fix).toContain('NUXT_SIGNAL_EXPORT_TOKEN')
  })

  it('tolerates surrounding whitespace on the token', () => {
    expect(checkExportAuth(`Bearer ${TOKEN}  `, TOKEN)).toEqual({ ok: true })
  })
})

describe('parseExportParams', () => {
  it('defaults to since=0 and limit=100', () => {
    expect(parseExportParams({})).toEqual({ since: 0, limit: 100 })
  })

  it('parses numeric strings from the query', () => {
    expect(parseExportParams({ since: '42', limit: '10' })).toEqual({ since: 42, limit: 10 })
  })

  it('clamps limit to the export maximum and at least 1', () => {
    expect(parseExportParams({ limit: '99999' }).limit).toBe(2000)
    expect(parseExportParams({ limit: '0' }).limit).toBe(1)
    expect(parseExportParams({ limit: '-5' }).limit).toBe(1)
  })

  it('never returns a negative or NaN cursor', () => {
    expect(parseExportParams({ since: '-10' }).since).toBe(0)
    expect(parseExportParams({ since: 'abc' }).since).toBe(0)
  })
})
