// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { useContentConfig } from '@incubrain/foundry/app/composables/useContentConfig'

describe('useContentConfig', () => {
  describe('Route Mapping', () => {
    it('maps routes to collections based on routeMap prefix', () => {
      const { getCollectionForRoute } = useContentConfig()
      expect(getCollectionForRoute('/docs/introduction')).toBe('docs')
      expect(getCollectionForRoute('/')).toBe('pages') // Default fallback
    })

    it('handles exact prefix matches', () => {
      const { getCollectionForRoute } = useContentConfig()
      expect(getCollectionForRoute('/docs')).toBe('docs')
    })
  })

  describe('Path Resolution', () => {
    it('resolves internal paths with correct prefix', () => {
      const { resolveInternalPath } = useContentConfig()
      expect(resolveInternalPath('intro', 'docs')).toBe('/docs/intro')
      expect(resolveInternalPath('/intro', 'docs')).toBe('/docs/intro')
    })

    it('does not double-prefix if already prefixed', () => {
      const { resolveInternalPath } = useContentConfig()
      expect(resolveInternalPath('/docs/intro', 'docs')).toBe('/docs/intro')
    })

    it('preserves hash fragments', () => {
      const { resolveInternalPath } = useContentConfig()
      expect(resolveInternalPath('intro#section', 'docs')).toBe(
        '/docs/intro#section',
      )
    })
  })

  describe('Routing Constants', () => {
    it('provides correct routing paths', () => {
      const { routing } = useContentConfig()
      expect(routing.offers).toBe('/offers')
      expect(routing.success).toBe('/success')
      expect(routing.sources).toBe('/sources')
    })
  })
})
