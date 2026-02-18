import { useTextSelection } from '@vueuse/core'
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

  // Listen for text selection via useTextSelection (fires on selectionchange)
  const { text: selectedText, ranges, rects } = useTextSelection()

  watch(selectedText, (text) => {
    if (!text || text.trim().length < 3) return
    if (!isDocsPage.value || !isEnabled.value) return

    const range = ranges.value[0]
    if (!range) return

    const contentArea = document.querySelector('[data-doc-content]')
    if (!contentArea || !contentArea.contains(range.commonAncestorContainer)) return

    const trimmed = text.trim()

    // Check if selected text overlaps an existing open comment
    const existing = comments.value.find(c =>
      c.status === 'open'
      && c.page === route.path
      && (trimmed.includes(c.selectedText) || c.selectedText.includes(trimmed)),
    )
    if (existing) {
      activeCommentId.value = existing.id
      isPanelOpen.value = true
      window.getSelection()?.removeAllRanges()
      return
    }

    const anchor = computeAnchor(range, contentArea)
    const rect = rects.value[0] ?? range.getBoundingClientRect()

    selection.value = { text: trimmed, anchor, rect }
  })
})
