<!-- apps/docs/app/components/content/CaseStudy.vue -->
<!--
  Also the layer's named-expert-quote pattern (product-validator-m0f.7):
  omit `client.company` and `partner`/`website` for a bare attributed quote
  from a subject-matter expert. `sourceUrl` (where the quote was published)
  renders as a visible citation and backs the semantic `<blockquote cite>`.
-->
<script setup lang="ts">
interface Client {
  name: string
  role: string
  company?: string
  avatar?: string
  website?: string
  action?: string
}

interface Props {
  client: Client
  quote: string
  sourceUrl?: string
  partner?: {
    label?: string
    logos?: Array<{ src: string, alt: string }>
  }
}

defineProps<Props>()
</script>

<template>
  <section class="my-12 lg:my-16">
    <div class="max-w-4xl space-y-6">
      <div
        class="p-5 rounded-lg bg-muted/10 border border-default space-y-4"
      >
        <div class="flex items-start gap-4">
          <NuxtImg
            v-if="client.avatar"
            :src="client.avatar"
            :alt="client.name"
            class="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
          />
          <div class="flex-1">
            <h3 class="text-lg font-bold text-highlighted">
              {{ client.name }}
            </h3>
            <p class="text-sm text-muted">
              {{ client.role }}<span v-if="client.company"> • {{ client.company }}</span>
            </p>
          </div>
        </div>

        <!-- Quote -->
        <div class="pt-3 border-t border-default">
          <blockquote
            :cite="sourceUrl"
            class="text-base italic text-highlighted leading-relaxed m-0"
          >
            "{{ quote }}"
          </blockquote>
          <p
            v-if="sourceUrl"
            class="text-xs text-muted mt-2"
          >
            Source:
            <a
              :href="sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:text-primary"
            ><cite>{{ client.name }}</cite></a>
          </p>
        </div>

        <!-- Trust Signals -->
        <div
          v-if="partner?.logos?.length"
          class="flex items-center gap-3 pt-2"
        >
          <span class="text-xs text-muted">{{ partner?.label }}</span>
          <div class="flex gap-3">
            <NuxtImg
              v-for="logo in partner?.logos"
              :key="logo.alt"
              :src="logo.src"
              :alt="logo.alt"
              class="h-4 opacity-60"
            />
          </div>
        </div>

        <!-- Visit Website -->
        <div
          v-if="client.website"
          class="flex justify-end"
        >
          <UButton
            :to="client.website"
            :label="client.action || 'Visit Website'"
            variant="link"
            color="primary"
            size="sm"
            trailing-icon="i-lucide-external-link"
            target="_blank"
          />
        </div>
      </div>
    </div>
  </section>
</template>
