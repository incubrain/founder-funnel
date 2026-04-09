export default defineAppConfig({
  title: 'Incubrain',
  description:
    'Purpose-built Marathi OCR and data pipeline for digitizing Maharashtra\'s government records',

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
    searchable: ['pages'],
    pagesBackLabel: 'Back',
    defaultAuthor: 'drew-macgibbon',
  },

  ui: {
    colors: {
      primary: 'amber',
      secondary: 'stone',
    },
  },
})
