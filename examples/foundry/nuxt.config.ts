import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://founderfunnel.dev'

export default defineNuxtConfig({
  extends: ['@incubrain/foundry'],

  modules: ['nuxt-studio', 'nuxt-llms'],

  site: {
    name: 'Founder Funnel',
    url: SITE_URL,
    description: 'Open-source funnel for technical founders',
  },

  routeRules: {
    // Landing pages
    '/': { appLayout: 'default', ssr: true, prerender: false },
    '/about': { appLayout: 'default', ssr: true, prerender: false },
    '/offers/**': { appLayout: 'conversion', ssr: true, prerender: false },
    '/success': { appLayout: 'conversion', ssr: true, prerender: false },
    '/success/**': { appLayout: 'conversion', ssr: true, prerender: false },

    // Documentation
    '/decisions': { appLayout: 'default', swr: 3600 },
    '/decisions/**': { appLayout: 'article', swr: 3600 },

    // RSS
    '/rss/**': {
      swr: 3600,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  },

  vite: {
    server: {
      fs: {
        allow: [
          resolve('../../'),
          resolve('../../layer'),
        ],
      },
      watch: {
        followSymlinks: true,
      },
    },
  },

  llms: {
    domain: SITE_URL,
    title: 'Founder Funnel',
    description:
      'Open-source landing page template for technical founders validating product ideas',

    sections: [
      {
        title: 'Product Offers',
        description:
          'Ways to work with us - mentorship, templates, and opportunities',
        contentCollection: 'pages',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/offers/%' },
          { field: 'path', operator: 'NOT LIKE', value: '%-success' },
        ],
      },
      {
        title: 'About',
        description: 'Our story and mission',
        contentCollection: 'pages',
        contentFilters: [{ field: 'path', operator: '=', value: '/about' }],
      },
      {
        title: 'Decisions',
        description: 'Founders strategic decisions',
        contentCollection: 'decisions',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/decisions/%' },
          { field: 'label', operator: 'IS NOT NULL' },
        ],
      },
      {
        title: 'Overview',
        description: 'Product overview and value proposition',
        contentCollection: 'pages',
        contentFilters: [{ field: 'path', operator: '=', value: '/' }],
      },
    ],

    notes: [
      'This is an open-source project (MIT License)',
      'Template designed for technical founders validating ideas',
      'Built with Nuxt 4, Tailwind v4, TypeScript',
    ],
  },

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
