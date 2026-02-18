export type CommentCategory = 'bug' | 'ui' | 'chore' | 'feature' | 'docs' | 'perf'
export type CommentPriority = 'low' | 'med' | 'critical'
export type ReviewMode = 'text' | 'element'

export const CATEGORIES: CommentCategory[] = ['bug', 'ui', 'chore', 'feature', 'docs', 'perf']
export const PRIORITIES: CommentPriority[] = ['low', 'med', 'critical']

/** Anchor for text selections (existing) */
export interface TextAnchor {
  type?: 'text'
  headingId: string | null
  blockIndex: number
  textOffset: number
  textLength: number
  /** Selected text with normalized whitespace */
  exact?: string
  /** ~32 chars before selection for disambiguation */
  prefix?: string
  /** ~32 chars after selection for disambiguation */
  suffix?: string
}

/** Anchor for element selections (new) */
export interface ElementAnchor {
  type: 'element'
  /** CSS selector path to the element */
  selector: string
  /** data-testid if available */
  testId: string | null
  /** Tag name for display */
  tagName: string
  /** Bounding rect at capture time */
  rect: { top: number, left: number, width: number, height: number }
}

export type CommentAnchor = TextAnchor | ElementAnchor

export interface DocComment {
  id: string
  page: string
  selectedText: string
  anchor: CommentAnchor
  comment: string
  author: string
  category: CommentCategory
  priority: CommentPriority
  status: 'open' | 'resolved'
  createdAt: string
  resolvedAt?: string
  /** Base64 screenshot for element selections */
  screenshot?: string
}

export interface SelectionState {
  text: string
  anchor: CommentAnchor
  rect: DOMRect
  /** Base64 screenshot for element selections */
  screenshot?: string
}

export function isElementAnchor(anchor: CommentAnchor): anchor is ElementAnchor {
  return anchor.type === 'element'
}

export function isTextAnchor(anchor: CommentAnchor): anchor is TextAnchor {
  return !anchor.type || anchor.type === 'text'
}
