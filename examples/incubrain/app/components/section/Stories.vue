<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  items?: Array<{
    id: string
    title: string
    description: string
    icon: string
    to?: string
  }>
  cta?: {
    headline?: string
    message?: string
    label?: string
    to?: string
    icon?: string
  }
}>()
</script>

<template>
  <SectionWrapper
    section-id="stories"
    has-bottom
    :title="title"
    :description="description"
  >
    <UPageGrid class="mt-12 sm:mt-16">
      <UPageCard
        v-for="card in items"
        :key="card.id"
        :title="card.title"
        :description="card.description"
        :to="card.to"
        variant="soft"
        :ui="{
          description: 'text-pretty leading-relaxed text-dimmed',
        }"
      >
        <template #leading>
          <UIcon
            :name="card.icon"
            class="size-5 text-secondary"
          />
        </template>
      </UPageCard>
    </UPageGrid>

    <template
      v-if="cta"
      #cta
    >
      <NavCta
        :title="cta.headline"
        :description="cta.message"
      >
        <template #links>
          <UButton
            v-if="cta.label && cta.to"
            :label="cta.label"
            :to="cta.to"
            :icon="cta.icon"
            size="xl"
            color="primary"
            variant="solid"
            trailing
          />
        </template>
      </NavCta>
    </template>
  </SectionWrapper>
</template>
