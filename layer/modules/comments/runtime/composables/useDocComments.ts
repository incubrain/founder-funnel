import { useLocalStorage } from '@vueuse/core'
import type { CommentCategory, CommentPriority, DocComment, ReviewMode, SelectionState } from '../types'

const comments = ref<DocComment[]>([])
const selection = ref<SelectionState | null>(null)
const isLoading = ref(false)
const isPanelOpen = ref(false)
const activeCommentId = ref<string | null>(null)

export const useDocComments = () => {
  const isEnabled = useLocalStorage('comments_enabled', false)
  const author = useLocalStorage('comments_author', '')
  const globalCategory = useLocalStorage<CommentCategory>('comments_category', 'docs')
  const reviewMode = useLocalStorage<ReviewMode>('comments_review_mode', 'text')
  const toolbarPosition = useLocalStorage<{ x: number, y: number }>('comments_toolbar_pos', { x: -1, y: -1 })
  const isToolbarExpanded = ref(false)
  const showUserPrompt = ref(false)

  const loadComments = async (page: string) => {
    isLoading.value = true
    try {
      const { comments: data } = await $fetch<{ comments: DocComment[] }>('/api/_comments', {
        params: { page },
      })
      comments.value = data
    }
    catch {
      comments.value = []
    }
    finally {
      isLoading.value = false
    }
  }

  const addComment = async (payload: {
    page: string
    selectedText: string
    anchor: SelectionState['anchor']
    comment: string
    category: CommentCategory
    priority: CommentPriority
    screenshot?: string
  }) => {
    if (payload.screenshot) {
      console.debug('[comments] Sending screenshot with comment:', payload.screenshot.length, 'chars')
    }
    const created = await $fetch<DocComment>('/api/_comments', {
      method: 'POST',
      body: { ...payload, author: author.value },
    })
    if (created.screenshot) {
      console.debug('[comments] Comment created with screenshot:', created.screenshot)
    }
    comments.value.push(created)
    selection.value = null
    return created
  }

  const updateComment = async (id: string, fields: { category?: CommentCategory, priority?: CommentPriority }) => {
    await $fetch('/api/_comments', {
      method: 'POST',
      body: { action: 'update', id, ...fields },
    })
    const comment = comments.value.find(c => c.id === id)
    if (comment) {
      if (fields.category) comment.category = fields.category
      if (fields.priority) comment.priority = fields.priority
    }
  }

  const resolveComment = async (id: string) => {
    await $fetch('/api/_comments', {
      method: 'POST',
      body: { action: 'resolve', id },
    })
    const comment = comments.value.find(c => c.id === id)
    if (comment) {
      comment.status = 'resolved'
      comment.resolvedAt = new Date().toISOString()
    }
  }

  const deleteComment = async (id: string) => {
    await $fetch('/api/_comments', {
      method: 'POST',
      body: { action: 'delete', id },
    })
    comments.value = comments.value.filter(c => c.id !== id)
  }

  const enableCommenting = () => {
    if (!author.value.trim()) {
      showUserPrompt.value = true
      return
    }
    isEnabled.value = true
  }

  const openComments = computed(() => comments.value.filter(c => c.status === 'open'))
  const resolvedComments = computed(() => comments.value.filter(c => c.status === 'resolved'))

  return {
    comments,
    selection,
    isLoading,
    isPanelOpen,
    activeCommentId,
    isEnabled,
    author,
    globalCategory,
    reviewMode,
    toolbarPosition,
    isToolbarExpanded,
    showUserPrompt,
    openComments,
    resolvedComments,
    loadComments,
    addComment,
    updateComment,
    resolveComment,
    deleteComment,
    enableCommenting,
  }
}
