export type CommentCategory = 'bug' | 'ui' | 'chore' | 'feature' | 'docs' | 'perf'
export type CommentPriority = 'low' | 'med' | 'critical'

export const CATEGORIES: CommentCategory[] = ['bug', 'ui', 'chore', 'feature', 'docs', 'perf']
export const PRIORITIES: CommentPriority[] = ['low', 'med', 'critical']

export interface CommentAnchor {
  headingId: string | null
  blockIndex: number
  textOffset: number
  textLength: number
}

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
}

export interface SelectionState {
  text: string
  anchor: CommentAnchor
  rect: DOMRect
}
