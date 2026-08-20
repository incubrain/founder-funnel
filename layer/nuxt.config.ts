import { join } from 'node:path'
import { createResolver, useNuxt } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'
import { ICON_LIBRARIES } from './shared/constants'

const { resolve } = createResolver(import.meta.url)

const isCI = process.env.CI === 'true'
const ciPrerender = process.env.CI_PRERENDER === 'true'

export default defineNuxtConfig({
  modules: [
    resolve('./modules/config'),
    resolve('./modules/css'),
    resolve('./modules/events'),
    resolve('./modules/rss'),
    resolve('./modules/markdown-rewrite'),
    () => {
      // Auto-register the consumer's app/assets/icons/ SVGs under the `custom:` prefix.
      // Drop SVG files in <consumer>/app/assets/icons/ and use them as `i-custom:<name>`.
      // Adopted from upstream docus #1288.
      const nuxt = useNuxt()
      nuxt.options.icon ||= {}
      nuxt.options.icon.customCollections ||= []
      nuxt.options.icon.customCollections.push({
        prefix: 'custom',
        dir: join(nuxt.options.srcDir, 'assets/icons'),
      })
    },
    'evlog/nuxt',
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/mcp-toolkit',
    '@vueuse/nuxt',
    '@nuxt/scripts',
    '@nuxt/test-utils/module',
  ],

  $development: {
    modules: ['@nuxt/eslint', '@compodium/nuxt', '@nuxt/hints'],

    devtools: { enabled: true },

    nitro: {
      debug: true,
    },

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — module-contributed config not typed in $development override
    scripts: {
      registry: {
        umamiAnalytics: 'mock',
      },
    },
  },

  $production: {
    sourcemap: false,
    experimental: {
      payloadExtraction: false,
    },

    nitro: {
      prerender: {
        routes: ciPrerender ? ['/'] : [],
        crawlLinks: ciPrerender,
      },
    },

    scripts: {
      registry: {
        umamiAnalytics: true,
      },
    },
  },

  ssr: true,

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  css: [resolve('./app/assets/main.css')],

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'andromeeda',
            dark: 'github-dark',
          },
          langs: [
            'bash',
            'diff',
            'json',
            'js',
            'ts',
            'html',
            'css',
            'vue',
            'shell',
            'mdc',
            'md',
            'yaml',
          ],
        },
        remarkPlugins: {
          'remark-mdc': {
            options: {
              autoUnwrap: true,
            },
          },
        },
      },
    },
  },

  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'neutral',
        'info',
        'success',
        'warning',
        'error',
      ],
    },
  },

  runtimeConfig: {
    foundryRegister: false, // NUXT_FOUNDRY_REGISTER — auto-register with Incubrain network in production
    public: {
      debug: true,
      siteUrl: '',
      siteId: '', // NUXT_PUBLIC_SITE_ID — stamped on every signal row (falls back to request host)
      scripts: {
        umamiAnalytics: {
          websiteId: '',
          scriptInput: {
            src: '',
          },
        },
      },
    },
    webhookUrl: '',
    signalExportToken: '', // NUXT_SIGNAL_EXPORT_TOKEN — bearer token for GET /api/_signals/export
  },

  dir: {
    assets: resolve('./app/assets'),
  },

  alias: {
    '#constants': resolve('./shared/constants.ts'),
    '#navigation': resolve('./app/composables/useNavigation.ts'),
    '#search': resolve('./app/composables/useSearch.ts'),
  },

  experimental: {
    asyncContext: true,
    defaults: {
      nuxtLink: {
        externalRelAttribute: 'noopener noreferrer',
        prefetch: false,
        prefetchOn: { interaction: true },
        trailingSlash: 'remove',
      },
    },
  },

  compatibilityDate: '2026-01-20',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: isCI,
      autoSubfolderIndex: false,
      ignore: ['/__og-image__', '/_ipx'],
    },
    compatibilityDate: {
      // Don't generate observability routes for now
      vercel: '2025-07-14',
    },
  },

  typescript: {
    tsConfig: {
      include: ['../test/**/*'],
    },
  },

  hooks: {
    'components:extend': (
      components: { pascalName: string, global?: boolean | 'sync' }[],
    ) => {
      const globals = components.filter((c: { pascalName: string }) =>
        ['UButton', 'UIcon'].includes(c.pascalName),
      )
      globals.forEach((c: { global?: boolean | 'sync' }) => (c.global = true))
    },
  },

  // Events module for conversion tracking + signal capture
  events: {
    providers: ['umami', 'console', 'webhook'],
    webhook: {
      enabled: true,
    },
    signals: {
      enabled: true,
      capacity: 10_000,
      captureErrors: true,
    },
    debug: true,
  },

  // Structured logging (evlog) — one wide event per request, console only.
  // No drain/sampling/enrichment pipeline: errors reach consumers through the
  // signal buffer (`/api/_signals/export`), not through evlog adapters.
  evlog: {
    env: {
      service: 'foundry',
    },
    include: ['/api/**', '/rss/**'],
  },

  icon: {
    serverBundle: {
      // Install individual @iconify-json/* packages (optional peer deps)
      // Override ICON_LIBRARIES in shared/constants.ts to use different icon sets
      collections: [...ICON_LIBRARIES],
    },
  },
  linkChecker: {
    failOnError: isCI,
    excludeLinks: ['/pdfs/**'],
  },
  seo: {
    redirectToCanonicalSiteUrl: true,
  },
})
