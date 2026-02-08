import { defineContentConfig, z, defineCollection } from '@nuxt/content'
import {
  baseConfigSchema,
  baseFaqSchema,
  baseNavigationSchema,
  basePageSchema,
} from '../../layer/content.collections'

// Extend base schema for pages
const extendedPagesSchema = basePageSchema.merge(
  z.object({
    testMergeField: z.string().optional(),
  }),
)

export default defineContentConfig({
  collections: {
    // Pages collection
    pages: defineCollection({
      type: 'page',
      source: {
        include: 'pages/**/*.md',
        prefix: '/',
      },
      schema: extendedPagesSchema,
    }),

    // Decisions collection (documentation)
    decisions: defineCollection({
      type: 'page',
      source: {
        include: 'decisions/**/*.md',
        prefix: '/decisions',
      },
      schema: basePageSchema,
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
