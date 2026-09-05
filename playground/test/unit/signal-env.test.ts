import { describe, it, expect } from 'vitest'
import { resolveSignalEnv } from '@incubrain/foundry/modules/events/server/utils/signal-env'

describe('resolveSignalEnv', () => {
  it('stamps local under dev mode with no explicit config', () => {
    expect(resolveSignalEnv({ isDev: true })).toBe('local')
  })

  it('is absent in production with no explicit config', () => {
    expect(resolveSignalEnv({ isDev: false })).toBeUndefined()
  })

  it('an explicit "local" override wins even outside dev mode (a locally-built server)', () => {
    expect(resolveSignalEnv({ isDev: false, configuredEnv: 'local' })).toBe('local')
  })

  it('an explicit "production" override suppresses the stamp even under dev mode (escape hatch)', () => {
    expect(resolveSignalEnv({ isDev: true, configuredEnv: 'production' })).toBeUndefined()
  })

  it('falls back to the dev-mode default when configuredEnv is empty', () => {
    expect(resolveSignalEnv({ isDev: true, configuredEnv: '' })).toBe('local')
    expect(resolveSignalEnv({ isDev: false, configuredEnv: '' })).toBeUndefined()
  })

  it('falls back to the dev-mode default for an unrecognised configuredEnv value', () => {
    expect(resolveSignalEnv({ isDev: true, configuredEnv: 'staging' })).toBe('local')
    expect(resolveSignalEnv({ isDev: false, configuredEnv: 'staging' })).toBeUndefined()
  })
})
