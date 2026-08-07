// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useContentConfig } from '@incubrain/foundry/app/composables/useContentConfig'

// useContentConfig resolves routes/paths from `appConfig.content`. Mock it with a
// controlled fixture so these tests exercise the mapping *mechanism* independent of
// whatever collections the shipped layer configures (the layer ships no page-prefix
// collections by default — pages live at '/').
mockNuxtImport('useAppConfig', () => {
  return () => ({
    content: {
      routeMap: { '/blog': 'blog', '/': 'pages' },
      routing: { offers: '/offers', success: '/success', sources: '/sources' },
    },
  })
})

describe('useContentConfig', () => {
  describe('Route Mapping', () => {
    it('maps routes to collections based on routeMap prefix', () => {
      const { getCollectionForRoute } = useContentConfig()
      expect(getCollectionForRoute('/blog/introduction')).toBe('blog')
      expect(getCollectionForRoute('/')).toBe('pages') // Default fallback
    })

    it('handles exact prefix matches', () => {
      const { getCollectionForRoute } = useContentConfig()
      expect(getCollectionForRoute('/blog')).toBe('blog')
    })
  })

  describe('Path Resolution', () => {
    it('resolves internal paths with correct prefix', () => {
      const { resolveInternalPath } = useContentConfig()
      expect(resolveInternalPath('intro', 'blog')).toBe('/blog/intro')
      expect(resolveInternalPath('/intro', 'blog')).toBe('/blog/intro')
    })

    it('does not double-prefix if already prefixed', () => {
      const { resolveInternalPath } = useContentConfig()
      expect(resolveInternalPath('/blog/intro', 'blog')).toBe('/blog/intro')
    })

    it('preserves hash fragments', () => {
      const { resolveInternalPath } = useContentConfig()
      expect(resolveInternalPath('intro#section', 'blog')).toBe(
        '/blog/intro#section',
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
