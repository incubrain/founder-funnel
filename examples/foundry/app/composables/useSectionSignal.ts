import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * Dogfood: every station section reports its own viewing as a signal row,
 * same vocabulary as the layer's SectionWrapper.
 */
export function useSectionSignal(sectionId: string) {
  const el = ref<HTMLElement | null>(null)
  const { trackEvent } = useEvents()
  const fired = ref(false)
  const { stop } = useIntersectionObserver(
    el,
    ([entry]) => {
      if (!entry?.isIntersecting || fired.value) return
      fired.value = true
      trackEvent({ id: `section_view_${sectionId}`, type: 'section_view', target: sectionId })
      stop()
    },
    { threshold: 0.2 },
  )
  return { el }
}
