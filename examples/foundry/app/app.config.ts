export default defineAppConfig({
  title: 'IncuBrain Foundry',
  description:
    'Open-source product validator for technical founders validating product ideas',

  url: 'https://foundry.incubrain.org',

  aside: {
    level: 1,
    collapsed: false,
  },

  logo: {
    light: '/favicon-96x96.png',
    dark: '/favicon-96x96.png',
    alt: 'IncuBrain Foundry Logo',
  },

  content: {
    collections: {
      // Page collections (routable - type: 'page')
      docs: { name: 'docs', type: 'page', prefix: '/docs' },
      pages: {
        name: 'pages',
        type: 'page',
        prefix: '/',
        backLabel: 'Back to Articles',
      },
      // Data collections (not routable - type: 'data' or string shorthand)
      changelog: { name: 'decisions', type: 'page', prefix: '/decisions' },
      references: { name: 'references', type: 'data' },
      glossary: { name: 'glossary', type: 'data' },
      faq: { name: 'faq', type: 'data' },
      config: { name: 'config', type: 'data' },
      navigation: { name: 'navigation', type: 'data' },
      // Collections to include in search
      searchable: ['pages', 'decisions'],
    },
    defaultAuthor: 'drew-macgibbon',
    // Additional routing paths (not tied to a specific collection)
    routing: {
      sources: '/sources',
      offers: '/offers',
      success: '/success',
    },
  },
})
