import { useEventListener } from '@vueuse/core'
import { computeAnchor, resolveContentArea } from '../utils/anchor'
import { computeElementAnchor, captureElementScreenshot } from '../utils/element-select'

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

  function getSelectableElement(target: EventTarget | null): Element | null {
    if (!(target instanceof Element)) return null
    let el: Element | null = target
    const contentArea = resolveContentArea()
    if (!contentArea) return null

    while (el && el !== contentArea && el !== document.body) {
      if (
        el.hasAttribute('data-testid')
        || /^(?:SECTION|ARTICLE|HEADER|FOOTER|NAV|ASIDE)$/.test(el.tagName)
        || (el.tagName === 'DIV' && el.children.length > 0 && el.parentElement !== document.body)
      ) {
        return el
      }
      el = el.parentElement
    }
    // Fall back to the target if it's a meaningful block element
    if (target instanceof HTMLElement && /^(?:P|DIV|UL|OL|PRE|BLOCKQUOTE|TABLE|FIGURE|IMG|VIDEO|FORM)$/.test(target.tagName)) {
      return target
    }
    return null
  }

  useEventListener(document, 'mousemove', (e: MouseEvent) => {
    if (!isEnabled.value || reviewMode.value !== 'element') {
      clearElementHover()
      return
    }

    const el = getSelectableElement(e.target)
    if (el !== lastHoveredEl) {
      clearElementHover()
      if (el) {
        el.classList.add(ELEMENT_HOVER_CLASS)
        lastHoveredEl = el
      }
    }
  })

  useEventListener(document, 'click', async (e: MouseEvent) => {
    if (!isEnabled.value || reviewMode.value !== 'element') return

    const el = getSelectableElement(e.target)
    if (!el) return

    e.preventDefault()
    e.stopPropagation()
    clearElementHover()

    const contentArea = resolveContentArea()
    if (!contentArea) return

    const anchor = computeElementAnchor(el, contentArea)
    const rect = el.getBoundingClientRect()
    const displayText = el.getAttribute('data-testid')
      || `<${el.tagName.toLowerCase()}>`

    let screenshot: string | undefined
    try {
      screenshot = await captureElementScreenshot(el as HTMLElement)
    }
    catch {
      // Screenshot capture is best-effort
    }

    selection.value = {
      text: displayText,
      anchor,
      rect,
      screenshot,
    }
  }, { capture: true })

  // Clean up hover when mode changes or comments disabled
  watch([isEnabled, reviewMode], () => {
    clearElementHover()
  })
})
