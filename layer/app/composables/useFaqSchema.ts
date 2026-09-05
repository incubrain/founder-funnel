interface FaqSchemaItem {
  label: string
  content: string
}

/**
 * Emits FAQPage JSON-LD (schema.org) for a resolved list of FAQ items, via
 * @nuxtjs/seo's schema-org integration.
 *
 * nuxt-schema-org has no dedicated `defineFAQPage` helper — the documented
 * equivalent is a WebPage node typed `FAQPage` plus one `defineQuestion` per
 * item; each question self-registers into the page's `mainEntity` array
 * (see nuxt-schema-org's `questionResolver.resolveRootNode`).
 *
 * Extracts schema emission out of FaqAccordion.vue so the component stays
 * focused on rendering (matches the useSocialLinks/useFormCapture pattern).
 */
export function useFaqSchema(items: Ref<FaqSchemaItem[]> | ComputedRef<FaqSchemaItem[]>) {
  const list = unref(items)
  if (!list.length) return

  useSchemaOrg([
    defineWebPage({ '@type': 'FAQPage' }),
    ...list.map(item => defineQuestion({
      question: item.label,
      answer: item.content,
    })),
  ])
}
