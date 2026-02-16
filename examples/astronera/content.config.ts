import { defineContentConfig, defineCollection } from '@nuxt/content'

import {
  baseTeamSchema,
  baseConfigSchema,
  baseFaqSchema,
  basePageSchema,
  baseReferencesSchema,
  baseGlossarySchema,
  baseNavigationSchema,
} from '@incubrain/foundry/content.collections'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: [
        {
          include: 'pages/**/*.md',
          prefix: '/',
        },
      ],
      schema: basePageSchema,
    }),

    docs: defineCollection({
      type: 'page',
      source: {
        include: 'docs/**/*.md',
        prefix: '/darksky',
      },
      schema: basePageSchema,
    }),

    references: defineCollection({
      type: 'data',
      source: {
        include: 'references/*.yml',
      },
      schema: baseReferencesSchema,
    }),

    glossary: defineCollection({
      type: 'data',
      source: {
        include: 'glossary/*.yml',
      },
      schema: baseGlossarySchema,
    }),

    // FAQ data
    faq: defineCollection({
      type: 'data',
      source: {
        include: 'faq/*.yml',
      },
      schema: baseFaqSchema,
    }),

    // Site configuration
    config: defineCollection({
      type: 'data',
      source: {
        include: 'config/site.yml',
      },
      schema: baseConfigSchema,
    }),

    navigation: defineCollection({
      type: 'data',
      source: {
        include: 'config/navigation.yml',
      },
      schema: baseNavigationSchema,
    }),

    team: defineCollection({
      type: 'data',
      source: {
        include: 'team/*.yml',
      },
      schema: baseTeamSchema,
    }),
  },
})
