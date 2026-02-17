<script setup lang="ts">
const { isPanelOpen, openComments, resolvedComments, resolveComment, activeCommentId } = useDocComments()

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <!-- Floating trigger -->
  <div class="fixed bottom-6 right-6 z-50">
    <UButton
      icon="i-lucide-message-square"
      size="lg"
      :color="openComments.length ? 'primary' : 'neutral'"
      variant="solid"
      class="rounded-full shadow-lg"
      @click="isPanelOpen = true"
    >
      <template
        v-if="openComments.length"
        #trailing
      >
        <UBadge
          :label="String(openComments.length)"
          size="xs"
          color="error"
          variant="solid"
        />
      </template>
    </UButton>
  </div>

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
              <span class="text-xs text-muted">{{ formatDate(c.createdAt) }}</span>
            </div>
          </div>
        </div>
      </details>
    </template>
  </USlideover>
</template>
