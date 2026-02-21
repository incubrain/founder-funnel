import {
  defineNuxtModule,
  addImports,
  addComponentsDir,
  addLayout,
  createResolver,
} from '@nuxt/kit'
import type { DocsModuleOptions } from './runtime/types'

export default defineNuxtModule<DocsModuleOptions>({
  meta: {
    name: 'docs',
    configKey: 'docs',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
    enabled: true,
    glossary: true,
    citations: true,
    search: true,
  },

  setup(options, nuxt) {
    if (!options.enabled) {
      // Point #search alias to a no-op stub so app.vue still works
      nuxt.options.alias['#search'] = createResolver(import.meta.url)
        .resolve('./runtime/composables/useSearchStub.ts')
      return
    }

    const resolver = createResolver(import.meta.url)

    // Register docs layout
    addLayout(resolver.resolve('./runtime/layouts/docs.vue'), 'docs')

    // Register core docs components (sidebar, header links, etc.)
    // We register selectively based on feature flags
    const coreComponents = [
      'DocsAsideLeftBody',
      'DocsAsideLeftTop',
      'DocsAsideRightBottom',
      'DocsPageHeaderLinks',
    ]

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      watch: true,
      // Only include core components + feature-gated components
      pathPrefix: false,
      pattern: buildComponentPattern(options, coreComponents),
    })

    // Search
    if (options.search !== false) {
      addImports({
        name: 'useSearch',
        from: resolver.resolve('./runtime/composables/useSearch.ts'),
      })
      // Override #search alias to point to real implementation
      nuxt.options.alias['#search'] = resolver.resolve('./runtime/composables/useSearch.ts')
    }
    else {
      nuxt.options.alias['#search'] = resolver.resolve('./runtime/composables/useSearchStub.ts')
    }

    // Citations (Bibliography, Cited, SourcesTable)
    if (options.citations !== false) {
      addImports([
        {
          name: 'useCitations',
          from: resolver.resolve('./runtime/composables/useCitations.ts'),
        },
        {
          name: 'useSourcesTable',
          from: resolver.resolve('./runtime/composables/useSourcesTable.ts'),
        },
        {
          name: 'getLinkInfo',
          from: resolver.resolve('./runtime/composables/useSourcesTable.ts'),
        },
      ])
    }

    // Glossary (GlossaryTable, Defn)
    if (options.glossary !== false) {
      addImports({
        name: 'useGlossary',
        from: resolver.resolve('./runtime/composables/useGlossary.ts'),
      })
    }

    // Expose config to runtime for conditional rendering in layouts
    nuxt.options.runtimeConfig.public.docs = {
      citations: options.citations !== false,
      glossary: options.glossary !== false,
    }

    // Defn component is used as :defn[text]{#id} in MDC (inline component syntax)
    // It's auto-registered via addComponentsDir above when glossary is enabled
  },
})

/**
 * Build a glob pattern that includes core components + feature-gated components.
 */
function buildComponentPattern(
  options: DocsModuleOptions,
  coreComponents: string[],
): string {
  const patterns = [...coreComponents]

  if (options.citations !== false) {
    patterns.push('Bibliography', 'Cited', 'SourcesTable')
  }

  if (options.glossary !== false) {
    patterns.push('GlossaryTable', 'Defn')
  }

  // Match any of the listed component files
  return `**/{${patterns.join(',')}}.vue`
}

export type { DocsModuleOptions } from './runtime/types'
export { baseReferencesSchema, baseGlossarySchema } from './runtime/types'
