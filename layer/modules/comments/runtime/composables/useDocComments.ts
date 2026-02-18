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
    const created = await $fetch<DocComment>('/api/_comments', {
      method: 'POST',
      body: { ...payload, author: author.value },
    })
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
    showUserPrompt,
    openComments,
    resolvedComments,
    loadComments,
    addComment,
    updateComment,
    resolveComment,
    enableCommenting,
  }
}
