import { defineContentConfig, defineCollection } from '@nuxt/content'

import {
  baseConfigSchema,
  baseFaqSchema,
  basePageSchema,
  baseReferencesSchema,
  baseGlossarySchema,
  baseChangelogSchema,
  baseNavigationSchema,
} from '@incubrain/foundry/content.collections'

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
