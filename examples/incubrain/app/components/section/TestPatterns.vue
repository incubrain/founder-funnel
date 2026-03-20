<template>
  <div class="py-16 px-8 max-w-6xl mx-auto space-y-16">
    <div>
      <h2 class="text-3xl font-bold mb-2">
        Background Patterns
      </h2>
      <p class="text-dimmed mb-8">
        Theme-aware — colors follow primary/secondary/border tokens.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="p in patterns"
          :key="p.name"
          class="relative rounded-xl border overflow-hidden h-48"
        >
          <div class="absolute inset-0 bg-default" />
          <div
            class="absolute inset-0"
            :class="p.name"
          />
          <div class="relative z-10 p-4 flex flex-col justify-end h-full">
            <code class="text-xs bg-default/80 backdrop-blur px-2 py-1 rounded font-mono">{{ p.name }}</code>
            <span class="text-sm text-dimmed mt-1">{{ p.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-3xl font-bold mb-2">
        Background Gradients
      </h2>
      <p class="text-dimmed mb-8">
        Auto-adapt to your app's color tokens and dark mode.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="g in gradients"
          :key="g.name"
          class="relative rounded-xl border overflow-hidden h-48"
        >
          <div class="absolute inset-0 bg-default" />
          <div
            class="absolute inset-0"
            :class="g.name"
          />
          <div class="relative z-10 p-4 flex flex-col justify-end h-full">
            <code class="text-xs bg-default/80 backdrop-blur px-2 py-1 rounded font-mono">{{ g.name }}</code>
            <span class="text-sm text-dimmed mt-1">{{ g.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-3xl font-bold mb-2">
        Combined: Pattern + Gradient
      </h2>
      <p class="text-dimmed mb-8">
        Layer a pattern over a gradient for rich backgrounds.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="c in combos"
          :key="c.label"
          class="relative rounded-xl border overflow-hidden h-64"
        >
          <div class="absolute inset-0 bg-default" />
          <div
            class="absolute inset-0"
            :class="c.gradient"
          />
          <div
            class="absolute inset-0"
            :class="c.pattern"
          />
          <div class="relative z-10 p-6 flex flex-col justify-end h-full">
            <code class="text-xs bg-default/80 backdrop-blur px-2 py-1 rounded font-mono">{{ c.gradient }} + {{ c.pattern }}</code>
            <span class="text-sm text-dimmed mt-1">{{ c.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const patterns = [
  { name: 'bg-pattern-grid', label: 'Grid (60px)' },
  { name: 'bg-pattern-grid-sm', label: 'Grid Small (30px)' },
  { name: 'bg-pattern-grid-lg', label: 'Grid Large (90px)' },
  { name: 'bg-pattern-dots', label: 'Dots' },
  { name: 'bg-pattern-diagonal', label: 'Diagonal' },
  { name: 'bg-pattern-cross', label: 'Cross' },
]

const gradients = [
  { name: 'bg-gradient-radial-primary', label: 'Radial Primary' },
  { name: 'bg-gradient-radial-secondary', label: 'Radial Secondary' },
  { name: 'bg-gradient-fade-t', label: 'Fade Top' },
  { name: 'bg-gradient-fade-b', label: 'Fade Bottom' },
  { name: 'bg-gradient-spotlight', label: 'Spotlight' },
  { name: 'bg-gradient-mesh', label: 'Mesh' },
]

const combos = [
  { gradient: 'bg-gradient-radial-primary', pattern: 'bg-pattern-grid', label: 'Hero-style (homepage)' },
  { gradient: 'bg-gradient-mesh', pattern: 'bg-pattern-dots', label: 'Mesh + dots' },
  { gradient: 'bg-gradient-spotlight', pattern: 'bg-pattern-diagonal', label: 'Spotlight + diagonal' },
  { gradient: 'bg-gradient-radial-secondary', pattern: 'bg-pattern-cross', label: 'Secondary + cross' },
]
</script>
