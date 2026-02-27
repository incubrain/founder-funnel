<script setup lang="ts">
const { data: team } = useAsyncData('team-grid', () =>
  queryCollection('team').all(),
)

const sortedTeam = computed(() => {
  if (!team.value) return []
  return [...team.value].sort((a, b) => {
    if (a.isFounder && !b.isFounder) return -1
    if (!a.isFounder && b.isFounder) return 1
    return 0
  })
})
</script>

<template>
  <div
    v-if="sortedTeam.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
  >
    <TeamCard
      v-for="member in sortedTeam"
      :key="member.slug"
      :member="member"
    />
  </div>
</template>
