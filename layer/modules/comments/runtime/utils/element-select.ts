import type { ElementAnchor } from '../types'

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
export function computeElementAnchor(el: Element, contentArea: Element): ElementAnchor {
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
export async function captureElementScreenshot(el: HTMLElement): Promise<string> {
  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(el, {
    scale: 1,
    useCORS: true,
    logging: false,
    backgroundColor: null,
  })
  return canvas.toDataURL('image/png', 0.8)
}
