<script setup lang="ts">
import { CATEGORIES, PRIORITIES } from '../types'
import type { CommentCategory, CommentPriority, DocComment } from '../types'

const { isPanelOpen, openComments, resolvedComments, resolveComment, updateComment, activeCommentId } = useDocComments()

const categoryItems = CATEGORIES.map(c => ({ label: c, value: c }))
const priorityItems = PRIORITIES.map(p => ({ label: p, value: p }))

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

const priorityColor = (p: CommentPriority) => {
  if (p === 'critical') return 'error' as const
  if (p === 'med') return 'warning' as const
  return 'neutral' as const
}

function onCategoryChange(comment: DocComment, value: CommentCategory) {
  comment.category = value
  updateComment(comment.id, { category: value })
}

function onPriorityChange(comment: DocComment, value: CommentPriority) {
  comment.priority = value
  updateComment(comment.id, { priority: value })
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
      <div
        v-if="!openComments.length && !resolvedComments.length"
        class="text-center text-muted py-8"
      >
        <UIcon
          name="i-lucide-message-square-plus"
          class="size-8 mb-2"
        />
        <p class="text-sm">
          Select text in the docs to add a comment
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
          <p class="text-xs italic text-muted line-clamp-2">
            "{{ c.selectedText }}"
          </p>
          <p class="text-sm">
            {{ c.comment }}
          </p>

          <!-- Category & Priority editors -->
          <div class="flex flex-wrap items-center gap-2">
            <URadioGroup
              :model-value="c.category"
              :items="categoryItems"
              orientation="horizontal"
              size="xs"
              @update:model-value="(v: CommentCategory) => onCategoryChange(c, v)"
            />
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <URadioGroup
              :model-value="c.priority"
              :items="priorityItems"
              orientation="horizontal"
              size="xs"
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
              <UBadge
                :label="c.category"
                size="xs"
                color="primary"
                variant="subtle"
              />
              <UBadge
                :label="c.priority"
                size="xs"
                :color="priorityColor(c.priority)"
                variant="subtle"
              />
              <span class="text-xs text-muted">{{ formatDate(c.createdAt) }}</span>
            </div>
            <UButton
              label="Resolve"
              size="xs"
              color="success"
              variant="soft"
              icon="i-lucide-check"
              @click="resolveComment(c.id)"
            />
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
            <p class="text-xs italic text-muted line-clamp-1">
              "{{ c.selectedText }}"
            </p>
            <p class="text-sm line-through">
              {{ c.comment }}
            </p>
            <div class="flex items-center gap-1.5">
              <UBadge
                :label="c.author"
                size="xs"
                color="neutral"
                variant="soft"
              />
              <UBadge
                :label="c.category"
                size="xs"
                color="primary"
                variant="subtle"
              />
              <UBadge
                :label="c.priority"
                size="xs"
                :color="priorityColor(c.priority)"
                variant="subtle"
              />
              <span class="text-xs text-muted">{{ formatDate(c.createdAt) }}</span>
            </div>
          </div>
        </div>
      </details>
    </template>
  </USlideover>
</template>
