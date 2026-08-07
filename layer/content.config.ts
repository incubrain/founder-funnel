import { defineContentConfig, defineCollection } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'
import { joinURL } from 'ufo'
import {
  basePageSchema,
  baseNavigationSchema,
  baseConfigSchema,
  baseFaqSchema,
  baseTeamSchema,
} from './content.collections'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: [
        {
          include: 'pages/**/*.md',
          prefix: '/',
          cwd,
        },
      ],
      schema: basePageSchema,
    }),

    // FAQ data
    faq: defineCollection({
      type: 'data',
      source: {
        include: 'faq/*.yml',
        cwd,
      },
      schema: baseFaqSchema,
    }),

    // Site configuration
    config: defineCollection({
      type: 'data',
      source: {
        include: 'config/site.yml',
        cwd,
      },
      schema: baseConfigSchema,
    }),

    navigation: defineCollection({
      type: 'data',
      source: {
        include: 'config/navigation.yml',
        cwd,
      },
      schema: baseNavigationSchema,
    }),

    team: defineCollection({
      type: 'data',
      source: {
        include: 'team/*.yml',
        cwd,
      },
      schema: baseTeamSchema,
    }),
  },
})
