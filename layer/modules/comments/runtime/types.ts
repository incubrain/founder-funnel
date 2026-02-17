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
  status: 'open' | 'resolved'
  createdAt: string
  resolvedAt?: string
}

export interface SelectionState {
  text: string
  anchor: CommentAnchor
  rect: DOMRect
}
