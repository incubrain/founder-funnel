export default defineAppConfig({
  content: {
    // Route prefix → collection. Read by useContentConfig.getCollectionForRoute.
    // Sorted by prefix length descending at runtime for specificity.
    routeMap: {
      '/docs': 'docs',
      '/': 'pages',
    },

    // Legacy keys retained for existing composable tests.
    collections: {
      docs: { name: 'docs', type: 'page', prefix: '/docs' },
      articles: { name: 'pages', type: 'page', prefix: '/articles' },
      references: { name: 'references', type: 'data' },
      searchable: ['docs', 'articles'],
    },
    routing: {
      custom: '/custom-path',
    },
  },
})
