import { z, property } from '@nuxt/content'

export interface ChangelogModuleOptions {
  enabled?: boolean
}

export const baseChangelogSchema = z.object({
  label: z.string(),
  version: z.string(),
  date: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  image: property(z.string().optional()).editor({ input: 'media' }),
  author: z.string().optional(), // team member slug
})
