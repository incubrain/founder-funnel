import { z } from '@nuxt/content'

export interface DocsModuleOptions {
  enabled?: boolean
  glossary?: boolean
  citations?: boolean
  search?: boolean
}

export const baseReferencesSchema = z.object({
  category: z.object({
    id: z.string(),
    label: z.string(),
  }),
  sources: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      author: z.string().optional(),
      date: z.string(),
      description: z.string().optional(),
      credibilityScore: z.number().min(1).max(10).optional(),
      affiliation: z.string().optional(),
      pdf: z.string().optional(),
      url: z.string().optional(),
    }),
  ),
})

export const baseGlossarySchema = z.object({
  category: z.object({
    id: z.string(),
    label: z.string(),
    color: z.string().optional(),
  }),
  terms: z.array(
    z.object({
      id: z.string(),
      term: z.string(),
      abbreviation: z.string().optional(),
      definition: z.string(),
    }),
  ),
})
