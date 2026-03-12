export default defineAppConfig({
  title: 'Incubrain',
  description:
    'AI-powered incubation hub for technical solopreneurs — outperform 20-person teams with AI, compute, and mentorship',

  url: 'https://incubrain.org',

  aside: {
    level: 1,
    collapsed: false,
  },

  logo: {
    light: '/favicon-96x96.png',
    dark: '/favicon-96x96.png',
    alt: 'Incubrain Logo',
  },

  content: {
    collections: {
      pages: {
        name: 'pages',
        type: 'page',
        prefix: '/',
        backLabel: 'Back',
      },
      faq: { name: 'faq', type: 'data' },
      config: { name: 'config', type: 'data' },
      navigation: { name: 'navigation', type: 'data' },
      team: { name: 'team', type: 'data' },
      searchable: ['pages'],
    },
    defaultAuthor: 'drew-macgibbon',
  },
})
