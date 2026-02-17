import { defineContentConfig, defineCollection } from '@nuxt/content'

import {
  baseConfigSchema,
  baseFaqSchema,
  basePageSchema,
  baseChangelogSchema,
  baseNavigationSchema,
} from '@incubrain/foundry/schemas'

export default defineContentConfig({
  collections: {
    // Pages collection
    pages: defineCollection({
      type: 'page',
      source: {
        include: 'pages/**/*.md',
        prefix: '/',
      },
      schema: basePageSchema,
    }),

    // Documentation
    docs: defineCollection({
      type: 'page',
      source: {
        include: 'docs/**/*.md',
        prefix: '/docs',
      },
      schema: basePageSchema,
    }),

    decisions: defineCollection({
      type: 'page',
      source: {
        include: 'decisions/**/*.md',
        prefix: '/decisions',
      },
      schema: baseChangelogSchema,
    }),

    // FAQ data
    faq: defineCollection({
      type: 'data',
      source: {
        include: 'faq/*.yml',
      },
      schema: baseFaqSchema,
    }),

    // Site config
    config: defineCollection({
      type: 'data',
      source: {
        include: 'config/site.yml',
      },
      schema: baseConfigSchema,
    }),

    // Navigation
    navigation: defineCollection({
      type: 'data',
      source: {
        include: 'config/navigation.yml',
      },
      schema: baseNavigationSchema,
    }),
  },
})
