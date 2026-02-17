export default defineAppConfig({
  title: 'My Product',
  description: 'One-sentence value proposition for your product',

  url: 'http://localhost:3000',

  logo: {
    light: '/favicon-96x96.png',
    dark: '/favicon-96x96.png',
    alt: 'My Product Logo',
  },

  content: {
    collections: {
      // Page collections (routable)
      pages: { name: 'pages', type: 'page', prefix: '/', backLabel: 'Back' },

      // Data collections (not routable)
      faq: { name: 'faq', type: 'data' },
      navigation: { name: 'navigation', type: 'data' },
      config: { name: 'config', type: 'data' },
      team: { name: 'team', type: 'data' },

      // Collections included in search
      searchable: ['pages'],
    },
    routing: {
      offers: '/offers',
      success: '/success',
    },
  },
})
