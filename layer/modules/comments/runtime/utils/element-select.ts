import type { ElementAnchor } from '../types'

// ── Vue Tracer integration ──

export interface ComponentMatch {
  el: Element
  componentName: string | null
  filepath: string | null
}

// Cached reference to vue-tracer client module (loaded once)
let _tracerModule: typeof import('vite-plugin-vue-tracer/client/record') | null | false = null

async function loadTracer() {
  if (_tracerModule === false) return null // previously failed
  if (_tracerModule) return _tracerModule
  try {
    _tracerModule = await import('vite-plugin-vue-tracer/client/record')
    return _tracerModule
  }
  catch {
    _tracerModule = false // don't retry
    return null
  }
}

/**
 * Check if vue-tracer has recorded any data (synchronous check via global store).
 */
function tracerHasData(): boolean {
  const store = (globalThis as Record<string, unknown>).__vue_tracer__ as
    { hasData?: boolean } | undefined
  return !!store?.hasData
}

/**
 * Find the Vue component element for a given DOM target using vue-tracer.
 * Walks up the trace tree to find the nearest Vue component boundary.
 * Falls back to DOM traversal if tracer data is unavailable.
 */
export async function findComponentElement(target: Element, contentArea: Element): Promise<ComponentMatch | null> {
  // Never capture toolbar or popover elements
  if (target.closest('[data-comment-toolbar]') || target.closest('[data-comment-popover]')) return null

  if (tracerHasData()) {
    const tracer = await loadTracer()
    if (tracer) {
      const match = resolveComponentFromTracer(tracer, target, contentArea)
      if (match) return match
    }
  }

  // Fallback: DOM traversal
  const el = findSelectableElement(target, contentArea)
  if (!el) return null
  return { el, componentName: null, filepath: null }
}

/**
 * Synchronous version for hover (mousemove) — uses cached tracer module.
 * Returns the element to highlight. Falls back to DOM traversal.
 */
export function findHoverElement(target: Element, contentArea: Element): Element | null {
  // Never capture toolbar or popover elements
  if (target.closest('[data-comment-toolbar]') || target.closest('[data-comment-popover]')) return null

  if (tracerHasData() && _tracerModule) {
    const match = resolveComponentFromTracer(_tracerModule, target, contentArea)
    if (match) return match.el
  }

  return findSelectableElement(target, contentArea)
}

/**
 * Use vue-tracer to find the nearest Vue component for a DOM element.
 */
function resolveComponentFromTracer(
  tracer: typeof import('vite-plugin-vue-tracer/client/record'),
  target: Element,
  contentArea: Element,
): ComponentMatch | null {
  let trace = tracer.findTraceFromElement(target)

  // Walk up to the nearest Vue component (not a native HTML element)
  while (trace) {
    const vnodeType = trace.vnode?.type
    if (vnodeType && typeof vnodeType !== 'string') {
      const el = trace.el
      if (el && contentArea.contains(el)) {
        const name = (vnodeType as { __name?: string, name?: string }).__name
          ?? (vnodeType as { name?: string }).name
          ?? null
        return {
          el,
          componentName: name,
          filepath: trace.filepath ?? null,
        }
      }
    }
    trace = trace.getParent()
  }

  // If we found a trace but no component, use the direct element
  const directTrace = tracer.findTraceFromElement(target)
  if (directTrace?.el && contentArea.contains(directTrace.el)) {
    return {
      el: directTrace.el,
      componentName: null,
      filepath: directTrace.filepath ?? null,
    }
  }

  return null
}

/**
 * DOM-based fallback for finding a selectable element.
 * Walks up looking for data-testid, semantic elements, or meaningful divs.
 */
function findSelectableElement(target: Element, contentArea: Element): Element | null {
  let el: Element | null = target

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
  if (target instanceof HTMLElement && /^(?:P|DIV|UL|OL|PRE|BLOCKQUOTE|TABLE|FIGURE|IMG|VIDEO|FORM)$/.test(target.tagName)) {
    return target
  }
  return null
}

// ── CSS selector + anchor computation ──

/**
 * Build a CSS selector path from an element up to a root container.
 * Prefers data-testid when available, falls back to tagName:nth-of-type.
 */
export function computeCssSelector(el: Element, root: Element): string {
  const parts: string[] = []
  let current: Element | null = el

  while (current && current !== root && current !== document.body) {
    if (current.hasAttribute('data-testid')) {
      parts.unshift(`[data-testid="${current.getAttribute('data-testid')}"]`)
      break
    }

    const tag = current.tagName.toLowerCase()
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName)
      if (siblings.length > 1) {
        const idx = siblings.indexOf(current) + 1
        parts.unshift(`${tag}:nth-of-type(${idx})`)
      }
      else {
        parts.unshift(tag)
      }
    }
    else {
      parts.unshift(tag)
    }

    current = parent
  }

  return parts.join(' > ')
}

/**
 * Compute an element anchor for element-mode selections.
 */
export function computeElementAnchor(
  el: Element,
  contentArea: Element,
  meta?: { componentName?: string | null, filepath?: string | null },
): ElementAnchor {
  const rect = el.getBoundingClientRect()

  return {
    type: 'element',
    selector: computeCssSelector(el, contentArea),
    testId: el.getAttribute('data-testid'),
    tagName: el.tagName.toLowerCase(),
    rect: {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    },
    componentName: meta?.componentName ?? null,
    filepath: meta?.filepath ?? null,
  }
}

/**
 * Re-locate an element from a stored ElementAnchor.
 * Tries data-testid first, then CSS selector.
 */
export function findElementByAnchor(anchor: ElementAnchor, contentArea: Element): Element | null {
  // Prefer testId lookup (most stable)
  if (anchor.testId) {
    const el = contentArea.querySelector(`[data-testid="${anchor.testId}"]`)
      ?? document.querySelector(`[data-testid="${anchor.testId}"]`)
    if (el) return el
  }

  // Fall back to CSS selector
  if (anchor.selector) {
    try {
      const el = contentArea.querySelector(anchor.selector)
        ?? document.querySelector(anchor.selector)
      if (el) return el
    }
    catch {
      // Invalid selector — fall through
    }
  }

  return null
}

/**
 * Capture a screenshot of an HTML element using html2canvas.
 * Returns a base64 data URL. Lazily imports html2canvas to keep it out of
 * the main bundle (dev-only feature).
 */
export async function captureElementScreenshot(el: HTMLElement): Promise<string | undefined> {
  try {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(el, {
      scale: 1,
      useCORS: true,
      logging: false,
      backgroundColor: null,
    })
    const dataUrl = canvas.toDataURL('image/png', 0.8)
    if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
      console.warn('[comments] html2canvas produced invalid data URL:', dataUrl?.slice(0, 60))
      return undefined
    }
    console.debug('[comments] Screenshot captured:', dataUrl.length, 'chars')
    return dataUrl
  }
  catch (err) {
    console.error('[comments] Screenshot capture failed:', err)
    return undefined
  }
}
