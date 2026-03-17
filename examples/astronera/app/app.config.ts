export default defineAppConfig({
  title: 'AstronEra',
  description:
    'Authoritative resource on light pollution policy and dark sky preservation in Maharashtra, India',

  url: 'https://darksky.maharashtra.gov.in',

  logo: {
    light: '/icon-192x192.png',
    dark: '/icon-192x192.png',
    alt: 'AstronEra Logo',
  },

  aside: {
    level: 1,
    collapsed: false,
  },

  content: {
    routeMap: {
      '/darksky': 'docs',
    },
    searchable: ['docs'],
    defaultAuthor: 'shweta-kulkarni',
    routing: {
      sources: '/resources/references',
      glossary: '/resources/glossary',
    },
  },
})
