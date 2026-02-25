<script setup lang="ts">
interface TeamMember {
  slug: string
  isFounder?: boolean
  givenName: string
  surname: string
  email?: string
  role?: string
  bio?: string
  avatar: {
    src: string
    alt: string
  }
  links?: Array<{
    label: string
    url: string
    icon?: string
  }>
}

interface Props {
  member: TeamMember
}

defineProps<Props>()
</script>

<template>
  <UCard
    :variant="member.isFounder ? 'soft' : 'subtle'"
    :ui="{
      root: `overflow-hidden transition-all duration-300 hover:shadow-xl ${member.isFounder ? 'ring-2 ring-primary/30' : ''}`,
      body: 'p-6 space-y-4',
    }"
  >
    <div class="flex flex-col items-center text-center space-y-3">
      <div class="relative">
        <UAvatar
          :src="member.avatar.src"
          :alt="member.avatar.alt"
          size="3xl"
          :ui="{ root: `ring-4 ${member.isFounder ? 'ring-primary/30' : 'ring-primary-500/10'}` }"
        />
        <UBadge
          v-if="member.isFounder"
          color="primary"
          variant="solid"
          size="xs"
          class="absolute -bottom-1 left-1/2 -translate-x-1/2"
        >
          Founder
        </UBadge>
      </div>
      <div>
        <h3 class="text-xl font-bold text-foreground">
          {{ member.givenName }} {{ member.surname }}
        </h3>
        <p
          v-if="member.role"
          class="text-sm text-muted mt-1"
        >
          {{ member.role }}
        </p>
      </div>
    </div>

    <p
      v-if="member.bio"
      class="text-sm text-muted-foreground leading-relaxed"
    >
      {{ member.bio }}
    </p>

    <template #footer>
      <div
        v-if="member.links?.length"
        class="flex justify-center gap-2"
      >
        <UButton
          v-for="link in member.links"
          :key="link.url"
          :to="link.url"
          :icon="link.icon"
          :aria-label="`${member.givenName}'s ${link.label}`"
          color="neutral"
          variant="ghost"
          size="sm"
          target="_blank"
        />
      </div>
    </template>
  </UCard>
</template>
