export default defineAppConfig({
  content: {
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
