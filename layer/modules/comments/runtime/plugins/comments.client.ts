import { useEventListener } from '@vueuse/core'
import { computeAnchor } from '../utils/anchor'

export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return

  const { selection, loadComments, isEnabled, comments, activeCommentId, isPanelOpen } = useDocComments()
  const route = useRoute()

  const isDocsPage = computed(() =>
    route.path.startsWith('/docs'),
  )

  // Load comments on route change
  watch(
    () => route.path,
    (path) => {
      if (isDocsPage.value) loadComments(path)
    },
    { immediate: true },
  )

  // Process selection only on mouseup — avoids triggering during drag-to-select
  useEventListener(document, 'mouseup', () => {
    if (!isDocsPage.value || !isEnabled.value) return

    // Small delay to let the selection finalize
    setTimeout(() => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !sel.rangeCount) return

      const text = sel.toString().trim()
      if (text.length < 3) return

      const range = sel.getRangeAt(0)
      const contentArea = document.querySelector('[data-doc-content]')
      if (!contentArea || !contentArea.contains(range.commonAncestorContainer)) return

      // Check if selected text overlaps an existing open comment
      const existing = comments.value.find(c =>
        c.status === 'open'
        && c.page === route.path
        && (text.includes(c.selectedText) || c.selectedText.includes(text)),
      )
      if (existing) {
        activeCommentId.value = existing.id
        isPanelOpen.value = true
        sel.removeAllRanges()
        return
      }

      const anchor = computeAnchor(range, contentArea)
      const rect = range.getBoundingClientRect()

      selection.value = { text, anchor, rect }
    }, 10)
  })
})
