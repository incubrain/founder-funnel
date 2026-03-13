import { defineContentConfig, defineCollection } from '@nuxt/content'

import {
  baseConfigSchema,
  baseFaqSchema,
  basePageSchema,
  baseNavigationSchema,
  baseTeamSchema,
} from '@incubrain/foundry/schemas'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        include: 'docs/**/*.md',
        prefix: '/docs',
      },
      schema: basePageSchema,
    }),

    pages: defineCollection({
      type: 'page',
      source: {
        include: 'pages/**/*.md',
        prefix: '/',
      },
      schema: basePageSchema,
    }),

    faq: defineCollection({
      type: 'data',
      source: {
        include: 'faq/*.yml',
      },
      schema: baseFaqSchema,
    }),

    team: defineCollection({
      type: 'data',
      source: {
        include: 'team/*.yml',
      },
      schema: baseTeamSchema,
    }),

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
  },
})
