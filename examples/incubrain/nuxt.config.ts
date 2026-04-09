import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

const SITE_URL
  = process.env.NUXT_PUBLIC_SITE_URL || 'https://incubrain.org'

export default defineNuxtConfig({
  extends: ['@incubrain/foundry'],

  modules: ['nuxt-studio', 'nuxt-llms'],

  css: ['~/assets/css/overrides.css'],

  site: {
    name: 'Incubrain',
    url: SITE_URL,
    description: 'Purpose-built Marathi OCR and data pipeline for digitizing Maharashtra\'s government records',
  },

  routeRules: {
    '/': { appLayout: 'landing' },
    '/benchmarks': { appLayout: 'default' },
    '/domains/**': { appLayout: 'default' },
    '/products/**': { appLayout: 'default' },
  },

  docs: { enabled: false },

  llms: {
    domain: SITE_URL,
    title: 'Incubrain',
    description:
      'Maharashtra-based AI company building purpose-built Marathi language infrastructure for government digitization',

    sections: [
      {
        title: 'Overview',
        description:
          'Incubrain homepage — Marathi AI data pipeline, OCR technology, and government digitization',
        contentCollection: 'pages',
        contentFilters: [{ field: 'path', operator: '=', value: '/' }],
      },
      {
        title: 'Benchmarks',
        description:
          'Marathi OCR benchmark results — CER, WER, exact match, throughput vs PaddleOCR, EasyOCR, and Tesseract',
        contentCollection: 'pages',
        contentFilters: [
          { field: 'path', operator: '=', value: '/benchmarks' },
        ],
      },
      {
        title: 'Review Pipeline',
        description:
          'Five-stage quality control pipeline from raw scans to verified AI-ready Marathi text',
        contentCollection: 'pages',
        contentFilters: [
          { field: 'path', operator: '=', value: '/pipeline' },
        ],
      },
    ],

    notes: [
      'Incubrain is headquartered in Pune, Maharashtra, India',
      'Focused exclusively on Marathi language AI infrastructure',
      'OCR model achieves 6.23% CER on MarathiLine benchmark, outperforming all open-source alternatives',
      'Proposing 3-month pilot to digitize 200,000+ Maharashtra Government Resolutions',
    ],
  },

  // Disable canonical URL redirect in dev (causes infinite loop with SSR)
  seo: { redirectToCanonicalSiteUrl: false },

  studio: {
    route: '/_studio',
    repository: {
      provider: 'github',
      owner: 'incubrain',
      repo: 'foundry',
      branch: 'main',
      rootDir: resolve('./'),
      private: false,
    },
  },
})
