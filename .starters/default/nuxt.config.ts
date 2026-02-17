const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default defineNuxtConfig({
  extends: ['@incubrain/foundry'],

  modules: ['nuxt-studio', 'nuxt-llms'],

  site: {
    name: 'Your Product',
    url: SITE_URL,
    description: 'One-sentence value proposition for your product',
  },

  routeRules: {
    '/': { appLayout: 'landing' },
    '/about': { appLayout: 'default' },
    '/offers/**': { appLayout: 'article' },
    '/success': { appLayout: 'landing' },
    '/success/**': { appLayout: 'landing' },
  },

  llms: {
    domain: SITE_URL,
    title: 'Your Product',
    description: 'One-sentence value proposition for your product',
    notes: [
      'The documentation only includes Your Product docs.',
      'The content is automatically generated from the same source as the official documentation.',
    ],
    full: {
      title: 'Complete Documentation',
      description: 'The complete documentation including all content',
    },
  },

  studio: {
    route: '/_studio',
  },
})
