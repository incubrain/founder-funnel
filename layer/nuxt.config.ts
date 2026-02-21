import { createResolver } from '@nuxt/kit'
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
    resolve('./modules/vrt'),
    resolve('./modules/comments'),
    resolve('./modules/rss'),
    resolve('./modules/changelog'),
    resolve('./modules/docs'),
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — module-contributed config not typed in $production override
    evlog: {
      sampling: {
        rates: { info: 10, warn: 50, debug: 0 },
        keep: [{ status: 400 }, { duration: 1000 }],
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
          'remark-math': {},
          'remark-mdc': {
            options: {
              autoUnwrap: true,
            },
          },
        },
        rehypePlugins: {
          'rehype-katex': {},
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
    public: {
      debug: true,
      siteUrl: '',
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
    telegramChatId: '',
  },

  dir: {
    assets: resolve('./app/assets'),
  },

  alias: {
    '#constants': resolve('./shared/constants.ts'),
    '#navigation': resolve('./app/composables/useNavigation.ts'),
    '#search': resolve('./modules/docs/runtime/composables/useSearchStub.ts'),
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
      components: { pascalName: string; global?: boolean | 'sync' }[],
    ) => {
      const globals = components.filter((c: { pascalName: string }) =>
        ['UButton', 'UIcon'].includes(c.pascalName),
      )
      globals.forEach((c: { global?: boolean | 'sync' }) => (c.global = true))
    },
  },

  // Events module for conversion tracking
  events: {
    providers: ['umami', 'console', 'webhook'],
    webhook: {
      enabled: true,
      platforms: ['discord'],
    },
    debug: true,
  },

  // Structured logging (evlog) - one wide event per request
  evlog: {
    env: {
      service: 'foundry',
    },
    include: ['/api/**', '/rss/**'],
    transport: {
      enabled: true,
    },
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
