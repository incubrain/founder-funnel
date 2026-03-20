import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

const SITE_URL
  = process.env.NUXT_PUBLIC_SITE_URL || 'https://incubrain.org'

export default defineNuxtConfig({
  extends: ['@incubrain/foundry'],

  modules: ['nuxt-studio', 'nuxt-llms'],

  site: {
    name: 'Incubrain',
    url: SITE_URL,
    description: 'AI-powered incubation hub for technical solopreneurs',
  },

  routeRules: {
    // Landing pages
    '/': { appLayout: 'landing' },
    '/join-us': { appLayout: 'default' },
    '/approach': { appLayout: 'default' },
    '/sectors': { appLayout: 'default' },
    '/apply': { appLayout: 'default' },

    // Docs
    '/docs': { appLayout: 'docs' },
    '/docs/**': { appLayout: 'docs' },

    // Article-style pages
    '/mentorship': { appLayout: 'article' },
    '/insights/**': { appLayout: 'article' },
  },

  docs: { enabled: true },

  llms: {
    domain: SITE_URL,
    title: 'Incubrain',
    description:
      'AI-powered incubation hub empowering technical solopreneurs to outperform traditional teams',

    sections: [
      {
        title: 'Mentorship',
        description:
          'Monthly mentorship program for technical founders — pricing, benefits, and application process',
        contentCollection: 'pages',
        contentFilters: [
          { field: 'path', operator: '=', value: '/mentorship' },
        ],
      },
      {
        title: 'Sectors',
        description:
          '12 key sectors for exponential growth — AI, robotics, biotech, climate, neurotech, space, and more',
        contentCollection: 'pages',
        contentFilters: [
          { field: 'path', operator: '=', value: '/sectors' },
        ],
      },
      {
        title: 'Our Approach',
        description:
          'How the three pillars (Foundry, Founder, Builder) and mentorship work together',
        contentCollection: 'pages',
        contentFilters: [
          { field: 'path', operator: '=', value: '/approach' },
        ],
      },
      {
        title: 'Join Us',
        description:
          'Join the Incubrain team — culture, values, interview process, and open applications',
        contentCollection: 'pages',
        contentFilters: [
          { field: 'path', operator: '=', value: '/join-us' },
        ],
      },
      {
        title: 'AI Drivers',
        description:
          '13 compounding drivers of AI progress — hardware, algorithms, agents, investment, and more — with data-driven 2026-2028 projections',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/docs/ai-drivers%' },
        ],
      },
      {
        title: 'AI Empowerment Stories',
        description:
          'Real stories of solo founders, barrier-breaking builders, and impossible achievements — proving one person plus AI equals limitless',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/docs/stories%' },
        ],
      },
      {
        title: 'Overview',
        description: 'Incubrain homepage and value proposition',
        contentCollection: 'pages',
        contentFilters: [{ field: 'path', operator: '=', value: '/' }],
      },
    ],

    notes: [
      'Incubrain is headquartered in Pune, Maharashtra, India',
      'Maximum 10 local + 10 international mentees at any time',
      'Three open-source pillars: Foundry, Founder, Builder',
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
