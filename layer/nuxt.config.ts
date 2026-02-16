import { createResolver } from '@nuxt/kit'
import { ICON_LIBRARIES } from './shared/constants'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    resolve('./modules/config'),
    resolve('./modules/css'),
    resolve('./modules/events'),
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

    evlog: {
      sampling: {
        rates: { info: 10, warn: 50, debug: 0 },
        keep: [
          { status: 400 },
          { duration: 1000 },
        ],
      },
    },

    nitro: {
      prerender: {
        routes: [],
        crawlLinks: false,
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
      configSource: '',
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
    '#navigation': resolve('./shared/navigation.ts'),
    '#search': resolve('./shared/search.ts'),
    '#config-resolver': resolve('./shared/config-resolver.ts'),
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

  typescript: {
    tsConfig: {
      include: ['../test/**/*'],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      autoSubfolderIndex: false,
    },
    compatibilityDate: {
      // Don't generate observability routes for now
      vercel: '2025-07-14',
    },
  },

  hooks: {
    'components:extend': (components) => {
      const globals = components.filter((c) =>
        ['UButton', 'UIcon', 'ProseDfn'].includes(c.pascalName),
      )
      globals.forEach((c) => (c.global = true))
    },
  },

  // Structured logging (evlog) - one wide event per request
  evlog: {
    env: {
      service: 'foundry',
    },
    include: ['/api/**', '/rss/**'],
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

  icon: {
    serverBundle: {
      // {DX}: Using full @iconify/json no need to install collection packages
      // collections array enables tree-shake
      collections: [...ICON_LIBRARIES],
    },
  },
  seo: {
    redirectToCanonicalSiteUrl: true,
  },
})
