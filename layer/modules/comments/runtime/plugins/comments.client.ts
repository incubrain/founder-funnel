import { useEventListener } from '@vueuse/core'
import { computeAnchor, resolveContentArea } from '../utils/anchor'
import { computeElementAnchor, findComponentElement, findHoverElement } from '../utils/element-select'

const ELEMENT_HOVER_CLASS = 'comment-element-hover'

export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return

  const { selection, loadComments, isEnabled, comments, activeCommentId, isPanelOpen, reviewMode } = useDocComments()
  const route = useRoute()

  // Load comments on every route change (all pages, not just /docs)
  watch(
    () => route.path,
    (path) => {
      loadComments(path)
    },
    { immediate: true },
  )

  // --- Text mode: process selection on mouseup ---
  useEventListener(document, 'mouseup', () => {
    if (!isEnabled.value || reviewMode.value !== 'text') return

    setTimeout(() => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !sel.rangeCount) return

      const text = sel.toString().trim()
      if (text.length < 3) return

      const range = sel.getRangeAt(0)
      const contentArea = resolveContentArea()
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

  // --- Element mode: hover outline + click to select ---
  let lastHoveredEl: Element | null = null

  function clearElementHover() {
    if (lastHoveredEl) {
      lastHoveredEl.classList.remove(ELEMENT_HOVER_CLASS)
      lastHoveredEl = null
    }
  }

  useEventListener(document, 'mousemove', (e: MouseEvent) => {
    if (!isEnabled.value || reviewMode.value !== 'element' || selection.value) {
      clearElementHover()
      return
    }

    if (!(e.target instanceof Element)) return
    const contentArea = resolveContentArea()
    if (!contentArea) return

    const el = findHoverElement(e.target, contentArea)
    if (el !== lastHoveredEl) {
      clearElementHover()
      if (el) {
        el.classList.add(ELEMENT_HOVER_CLASS)
        lastHoveredEl = el
      }
    }
  })

  useEventListener(document, 'click', async (e: MouseEvent) => {
    if (!isEnabled.value || reviewMode.value !== 'element' || selection.value) return
    if (!(e.target instanceof Element)) return

    const contentArea = resolveContentArea()
    if (!contentArea) return

    const match = await findComponentElement(e.target, contentArea)
    if (!match) return

    e.preventDefault()
    e.stopPropagation()
    clearElementHover()

    const { el, componentName, filepath } = match
    const anchor = computeElementAnchor(el, contentArea, { componentName, filepath })
    const rect = el.getBoundingClientRect()
    const displayText = componentName
      ? `<${componentName}>`
      : el.getAttribute('data-testid')
        || `<${el.tagName.toLowerCase()}>`

    console.debug('[comments] Element selected:', displayText, {
      tagName: el.tagName,
      componentName,
      filepath,
      rect: { w: rect.width, h: rect.height, t: rect.top, l: rect.left },
    })

    selection.value = {
      text: displayText,
      anchor,
      rect,
      element: el instanceof HTMLElement ? el : undefined,
    }
  }, { capture: true })

  // Clean up hover when mode changes or comments disabled
  watch([isEnabled, reviewMode], () => {
    clearElementHover()
  })
})
