import {
  defineNuxtModule,
  addImports,
  addComponent,
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
    const resolver = createResolver(import.meta.url)

    if (!options.enabled) {
      // Point #search alias to a no-op stub so app.vue still works
      nuxt.options.alias['#search'] = resolver
        .resolve('./runtime/composables/useSearchStub.ts')

      // Register stub components so MDC references resolve gracefully
      registerStubComponents(resolver, {
        citations: true,
        glossary: true,
      })

      if (import.meta.dev) {
        console.warn('[docs] Module is disabled — stub components are being used. Enable with `docs: { enabled: true }` in nuxt.config.ts')
      }

      return
    }

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
    else {
      // Register citation stubs when citations feature is disabled
      registerStubComponents(resolver, { citations: true, glossary: false })
    }

    // Glossary (GlossaryTable, Defn)
    if (options.glossary !== false) {
      addImports({
        name: 'useGlossary',
        from: resolver.resolve('./runtime/composables/useGlossary.ts'),
      })
    }
    else {
      // Register glossary stubs when glossary feature is disabled
      registerStubComponents(resolver, { citations: false, glossary: true })
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
 * Register stub components so MDC references like :cited{} and :defn{}
 * resolve gracefully instead of failing when features are disabled.
 */
function registerStubComponents(
  resolver: ReturnType<typeof createResolver>,
  features: { citations: boolean, glossary: boolean },
) {
  if (features.citations) {
    addComponent({ name: 'Cited', filePath: resolver.resolve('./runtime/components/stubs/CitedStub.vue') })
    addComponent({ name: 'Bibliography', filePath: resolver.resolve('./runtime/components/stubs/BibliographyStub.vue') })
    addComponent({ name: 'SourcesTable', filePath: resolver.resolve('./runtime/components/stubs/SourcesTableStub.vue') })
  }

  if (features.glossary) {
    addComponent({ name: 'Defn', filePath: resolver.resolve('./runtime/components/stubs/DefnStub.vue') })
    addComponent({ name: 'GlossaryTable', filePath: resolver.resolve('./runtime/components/stubs/GlossaryTableStub.vue') })
  }
}

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
