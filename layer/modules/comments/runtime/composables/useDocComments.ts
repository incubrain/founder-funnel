import { useLocalStorage } from '@vueuse/core'
import type { DocComment, SelectionState } from '../types'

const comments = ref<DocComment[]>([])
const selection = ref<SelectionState | null>(null)
const isLoading = ref(false)
const isPanelOpen = ref(false)
const activeCommentId = ref<string | null>(null)

export const useDocComments = () => {
  const author = useLocalStorage('comments_author', '')

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
  }) => {
    const created = await $fetch<DocComment>('/api/_comments', {
      method: 'POST',
      body: { ...payload, author: author.value },
    })
    comments.value.push(created)
    selection.value = null
    return created
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

  const openComments = computed(() => comments.value.filter(c => c.status === 'open'))
  const resolvedComments = computed(() => comments.value.filter(c => c.status === 'resolved'))

  return {
    comments,
    selection,
    isLoading,
    isPanelOpen,
    activeCommentId,
    author,
    openComments,
    resolvedComments,
    loadComments,
    addComment,
    resolveComment,
  }
}
