export default defineAppConfig({
  title: 'Foundry — Signal Station',
  description:
    'A Nuxt 4 layer that wraps your website in a recording instrument for the agent-first web.',

  url: 'https://foundry.incubrain.org',

  logo: {
    light: '/favicon-96x96.png',
    dark: '/favicon-96x96.png',
    alt: 'Foundry logo',
  },

  content: {
    routeMap: {},
    searchable: ['pages'],
    pagesBackLabel: 'Back',
    defaultAuthor: 'drew-macgibbon',
    routing: {},
  },
})
