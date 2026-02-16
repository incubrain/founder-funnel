// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { inferSiteURL } from '@incubrain/foundry/shared/utils/meta'

describe('inferSiteURL', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('prefers NUXT_PUBLIC_SITE_URL', () => {
    vi.stubEnv('NUXT_PUBLIC_SITE_URL', 'https://example.com')
    expect(inferSiteURL()).toBe('https://example.com')
  })

  it('falls back to Vercel URL', () => {
    // Explicitly clear NUXT_PUBLIC_SITE_URL to test fallback
    vi.stubEnv('NUXT_PUBLIC_SITE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', 'example.vercel.app')
    expect(inferSiteURL()).toBe('https://example.vercel.app')
  })

  it('returns undefined if no env matches', () => {
    vi.stubEnv('NUXT_PUBLIC_SITE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', '')
    expect(inferSiteURL()).toBeUndefined()
  })
})
