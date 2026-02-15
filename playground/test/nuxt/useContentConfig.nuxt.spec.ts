// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { useContentConfig } from '@incubrain/foundry/app/composables/useContentConfig'

describe('useContentConfig', () => {
  describe('Configuration Helpers', () => {
    it('resolves collection name correctly', () => {
      const { getCollectionName } = useContentConfig()
      expect(getCollectionName('docs')).toBe('docs')
      expect(getCollectionName('articles' as any)).toBe('pages')
    })

    it('resolves collection prefix correctly', () => {
      const { getCollectionPrefix } = useContentConfig()
      expect(getCollectionPrefix('docs')).toBe('/docs')
      expect(getCollectionPrefix('articles' as any)).toBe('/articles')
    })

    it('gets searchable collections', () => {
      const { getSearchableCollections } = useContentConfig()
      expect(getSearchableCollections()).toContain('docs')
      expect(getSearchableCollections()).toContain('articles')
    })
  })

  describe('Route Mapping', () => {
    it('maps routes to collections based on prefix', () => {
      const { getCollectionForRoute } = useContentConfig()
      expect(getCollectionForRoute('/docs/introduction')).toBe('docs')
      expect(getCollectionForRoute('/articles/my-post')).toBe('pages' as any)
      expect(getCollectionForRoute('/')).toBe('pages') // Default fallback
    })

    it('handles exact prefix matches', () => {
      const { getCollectionForRoute } = useContentConfig()
      expect(getCollectionForRoute('/docs')).toBe('docs')
      expect(getCollectionForRoute('/articles')).toBe('pages' as any)
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
      expect(resolveInternalPath('/articles/post', 'articles' as any)).toBe(
        '/articles/post',
      )
    })

    it('preserves hash fragments', () => {
      const { resolveInternalPath } = useContentConfig()
      expect(resolveInternalPath('intro#section', 'docs')).toBe(
        '/docs/intro#section',
      )
    })
  })

  describe('Pre-resolved Values', () => {
    it('provides correct collection short-names', () => {
      const { collections } = useContentConfig()
      expect(collections.docs).toBe('docs')
      expect(collections.references).toBe('references')
    })

    it('provides correct routing prefixes', () => {
      const { routing } = useContentConfig()
      expect(routing.docsPrefix).toBe('/docs')
    })
  })
})
