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
    routeMap: {
      '/docs': 'docs',
      '/decisions': 'decisions',
    },
    searchable: ['docs', 'pages', 'decisions'],
    pagesBackLabel: 'Back',
    defaultAuthor: 'drew-macgibbon',
    routing: {
      offers: '/offers',
      success: '/success',
    },
  },
})
