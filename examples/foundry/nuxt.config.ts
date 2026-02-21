import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

const SITE_URL
  = process.env.NUXT_PUBLIC_SITE_URL || 'https://foundry.incubrain.org'

export default defineNuxtConfig({
  extends: ['@incubrain/foundry'],

  modules: ['nuxt-studio', 'nuxt-llms'],

  site: {
    name: 'IncuBrain Foundry',
    url: SITE_URL,
    description: 'Open-source product validator for technical founders',
  },

  routeRules: {
    // Landing pages
    '/': { appLayout: 'landing' },
    '/about': { appLayout: 'default' },
    '/offers/**': { appLayout: 'article' },
    '/success': { appLayout: 'landing' },
    '/success/**': { appLayout: 'landing' },

    // Documentation
    '/docs': { appLayout: 'docs' },
    '/docs/**': { appLayout: 'docs' },

    // Founder Decision Log
    '/decisions': { appLayout: 'default' },
    '/decisions/**': { appLayout: 'article' },

    // RSS
    // '/rss/**': {
    //   headers: {
    //     'Content-Type': 'application/xml; charset=utf-8',
    //     'Cache-Control': 'public, max-age=3600',
    //   },
    // },
  },

  nitro: {
    prerender: {
      ignore: [/^\/decisions\/.+/],
    },
  },

  linkChecker: {
    excludeLinks: ['/decisions/**'],
  },

  // vite: {
  //   server: {
  //     fs: {
  //       allow: [resolve('../../'), resolve('../../layer')],
  //     },
  //     watch: {
  //       followSymlinks: true,
  //     },
  //   },
  // },

  llms: {
    domain: SITE_URL,
    title: 'IncuBrain Foundry',
    description:
      'Open-source product validator for technical founders validating product ideas',

    sections: [
      {
        title: 'Documentation',
        description:
          'How to use the Foundry layer and CLI — setup, content, signal capture, events, theming, deployment',
        contentCollection: 'docs',
      },
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
      // {
      //   title: 'Decisions',
      //   description: 'Founders strategic decisions',
      //   contentCollection: 'changelog',
      //   contentFilters: [
      //     { field: 'path', operator: 'LIKE', value: '/decisions/%' },
      //     { field: 'label', operator: 'IS NOT NULL' },
      //   ],
      // },
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

  // RSS feeds — each key becomes /rss/{key}
  rss: {
    feeds: {
      decisions: {
        collection: 'changelog',
        title: 'IncuBrain Foundry Changelog',
        description: 'Latest decisions and changelogs from IncuBrain Foundry',
        basePath: '/changelog',
      },
    },
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
