export default defineAppConfig({
  title: 'Founder Funnel',
  description:
    'Open-source funnel for technical founders validating product ideas',

  url: 'https://founderfunnel.dev',

  aside: {
    level: 1,
    collapsed: false,
  },

  logo: {
    light: '/favicon-96x96.png',
    dark: '/favicon-96x96.png',
    alt: 'Founder Funnel Logo',
  },

  content: {
    collections: {
      // Page collections (routable)
      decisions: { name: 'decisions', type: 'page', prefix: '/decisions' },
      pages: { name: 'pages', type: 'page', prefix: '/', backLabel: 'Back to Home' },
      // Data collections (not routable)
      faq: { name: 'faq', type: 'data' },
      config: { name: 'config', type: 'data' },
      navigation: { name: 'navigation', type: 'data' },
      searchable: ['pages', 'decisions'],
    },
    routing: {
      offers: '/offers',
      success: '/success',
    },
  },
})
