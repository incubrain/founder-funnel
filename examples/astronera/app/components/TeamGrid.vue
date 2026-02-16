<script setup lang="ts">
const { data: team } = useAsyncData('team-grid', () =>
  queryCollection('team').all(),
)
</script>

<template>
  <div
    v-if="team?.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
  >
    <TeamCard
      v-for="member in team"
      :key="member.slug"
      :member="member"
    />
  </div>
</template>
