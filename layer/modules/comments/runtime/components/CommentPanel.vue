<script setup lang="ts">
import { CATEGORIES, PRIORITIES, isElementAnchor } from '../types'
import type { CommentCategory, CommentPriority, DocComment } from '../types'

const { isPanelOpen, openComments, resolvedComments, resolveComment, deleteComment, updateComment, activeCommentId, author, globalCategory, reviewMode } = useDocComments()

const tabItems = [
  { label: 'Comments', value: 'comments', icon: 'i-lucide-message-square' },
  { label: 'Settings', value: 'settings', icon: 'i-lucide-settings' },
]

const categoryItems = CATEGORIES.map(c => ({ label: c, value: c }))
const priorityItems = PRIORITIES.map(p => ({ label: p, value: p }))

const modeItems = [
  { label: 'Text', value: 'text' as const },
  { label: 'Element', value: 'element' as const },
]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

const truncate = (text: string, max = 120) =>
  text.length > max ? `${text.slice(0, max)}...` : text

function onCategoryChange(comment: DocComment, value: CommentCategory) {
  comment.category = value
  updateComment(comment.id, { category: value })
}

function onPriorityChange(comment: DocComment, value: CommentPriority) {
  comment.priority = value
  updateComment(comment.id, { priority: value })
}

function scrollToComment(id: string) {
  // Reset first to ensure the watcher fires even if clicking the same comment
  activeCommentId.value = null
  nextTick(() => {
    activeCommentId.value = id
  })
}
</script>

<template>
  <!-- Review panel -->
  <USlideover
    v-model:open="isPanelOpen"
    :modal="false"
    title="Review Comments"
    side="right"
  >
    <!-- hidden trigger — we control open state programmatically -->
    <span class="hidden" />

    <template #body>
      <UTabs
        :items="tabItems"
        default-value="comments"
        class="w-full"
      >
        <template #content="{ item }">
          <!-- Comments tab -->
          <div
            v-if="item.value === 'comments'"
            class="pt-3"
          >
            <div
              v-if="!openComments.length && !resolvedComments.length"
              class="text-center text-muted py-8"
            >
              <UIcon
                name="i-lucide-message-square-plus"
                class="size-8 mb-2"
              />
              <p class="text-sm">
                Select text or elements to add a comment
              </p>
            </div>

            <!-- Open comments -->
            <div
              v-if="openComments.length"
              class="space-y-3"
            >
              <h4 class="text-xs font-semibold text-muted uppercase tracking-wider">
                Open ({{ openComments.length }})
              </h4>
              <div
                v-for="c in openComments"
                :key="c.id"
                class="rounded-lg border border-default p-3 space-y-2 transition-colors"
                :class="{ 'ring-2 ring-primary': activeCommentId === c.id }"
              >
                <!-- Element comment: show screenshot + element info -->
                <template v-if="isElementAnchor(c.anchor)">
                  <button
                    class="flex items-center gap-1.5 text-xs text-muted hover:text-primary cursor-pointer transition-colors"
                    title="Scroll to element"
                    @click="scrollToComment(c.id)"
                  >
                    <UIcon
                      name="i-lucide-box-select"
                      class="size-3.5"
                    />
                    <span class="font-mono">{{ c.anchor.testId || c.anchor.selector }}</span>
                  </button>
                  <img
                    v-if="c.screenshot"
                    :src="c.screenshot"
                    alt="Element screenshot"
                    class="w-full rounded border border-default max-h-24 object-contain object-top cursor-pointer"
                    title="Scroll to element"
                    @click="scrollToComment(c.id)"
                  >
                </template>

                <!-- Text comment: show quoted text -->
                <button
                  v-else
                  class="text-xs italic text-muted line-clamp-2 text-left hover:text-primary cursor-pointer transition-colors"
                  title="Scroll to highlight"
                  @click="scrollToComment(c.id)"
                >
                  "{{ truncate(c.selectedText) }}"
                </button>

                <p class="text-sm">
                  {{ c.comment }}
                </p>

                <!-- Category & Priority editors -->
                <div class="flex items-center gap-2">
                  <USelect
                    :model-value="c.category"
                    :items="categoryItems"
                    size="xs"
                    class="flex-1"
                    @update:model-value="(v: CommentCategory) => onCategoryChange(c, v)"
                  />
                  <USelect
                    :model-value="c.priority"
                    :items="priorityItems"
                    size="xs"
                    class="flex-1"
                    @update:model-value="(v: CommentPriority) => onPriorityChange(c, v)"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <UBadge
                      :label="c.author"
                      size="xs"
                      color="neutral"
                      variant="soft"
                    />
                    <span class="text-xs text-muted">{{ formatDate(c.createdAt) }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <UButton
                      label="Resolve"
                      size="xs"
                      color="success"
                      variant="soft"
                      icon="i-lucide-check"
                      @click="resolveComment(c.id)"
                    />
                    <UButton
                      size="xs"
                      color="error"
                      variant="ghost"
                      icon="i-lucide-trash-2"
                      title="Delete comment"
                      @click="deleteComment(c.id)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Resolved comments -->
            <details
              v-if="resolvedComments.length"
              class="mt-4"
            >
              <summary class="text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer">
                Resolved ({{ resolvedComments.length }})
              </summary>
              <div class="space-y-2 mt-2">
                <div
                  v-for="c in resolvedComments"
                  :key="c.id"
                  class="rounded-lg border border-default p-3 space-y-1 opacity-60"
                >
                  <template v-if="isElementAnchor(c.anchor)">
                    <div class="flex items-center gap-1.5 text-xs text-muted">
                      <UIcon
                        name="i-lucide-box-select"
                        class="size-3.5"
                      />
                      <span class="font-mono line-clamp-1">{{ c.anchor.testId || c.anchor.selector }}</span>
                    </div>
                  </template>
                  <p
                    v-else
                    class="text-xs italic text-muted line-clamp-1"
                  >
                    "{{ truncate(c.selectedText) }}"
                  </p>
                  <p class="text-sm line-through">
                    {{ c.comment }}
                  </p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <UBadge
                        :label="c.author"
                        size="xs"
                        color="neutral"
                        variant="soft"
                      />
                      <span class="text-xs text-muted">{{ formatDate(c.createdAt) }}</span>
                    </div>
                    <UButton
                      size="xs"
                      color="error"
                      variant="ghost"
                      icon="i-lucide-trash-2"
                      title="Delete comment"
                      @click="deleteComment(c.id)"
                    />
                  </div>
                </div>
              </div>
            </details>
          </div>

          <!-- Settings tab -->
          <div
            v-else-if="item.value === 'settings'"
            class="pt-3 space-y-4"
          >
            <div class="space-y-2">
              <label class="text-xs font-semibold text-muted uppercase tracking-wider">
                Reviewer Name
              </label>
              <UInput
                v-model="author"
                placeholder="Your name"
                size="sm"
              />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-semibold text-muted uppercase tracking-wider">
                Default Category
              </label>
              <USelect
                v-model="globalCategory"
                :items="categoryItems"
                size="sm"
              />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-semibold text-muted uppercase tracking-wider">
                Review Mode
              </label>
              <USelect
                v-model="reviewMode"
                :items="modeItems"
                size="sm"
              />
            </div>
          </div>
        </template>
      </UTabs>
    </template>
  </USlideover>
</template>
