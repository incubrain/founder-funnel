<script setup lang="ts">
const { stars, shootingStars, isClient } = useStarfield(80, 3)
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <div
    v-if="isClient && isDark"
    class="absolute inset-0 z-0 pointer-events-none overflow-hidden"
    aria-hidden="true"
  >
    <div
      v-for="star in stars"
      :key="star.id"
      class="absolute rounded-full bg-white"
      :style="star.style"
    />
    <div
      v-for="ss in shootingStars"
      :key="`ss-${ss.id}`"
      class="shooting-star"
      :style="ss.style"
    />
  </div>
</template>

<style scoped>
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.shooting-star {
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: shoot var(--duration) linear var(--delay) infinite;
  opacity: 0;
}

.shooting-star::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 1px;
  background: linear-gradient(to left, white, transparent);
  transform: rotate(-45deg);
  transform-origin: right;
}

@keyframes shoot {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  20% {
    transform: translate(-200px, 200px);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
