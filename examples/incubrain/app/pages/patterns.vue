<script setup lang="ts">
definePageMeta({ layout: false })

type PatternName = 'paithani-classic' | 'paithani-asawali' | 'paithani-lotus' | 'paithani-bangdi' | 'warli' | 'ajanta'

const patterns: Array<{ name: PatternName, label: string, usage: string }> = [
  { name: 'paithani-classic', label: 'Classic Peacock Pair', usage: 'Hero sections' },
  { name: 'paithani-asawali', label: 'Asawali (Flowering Vine)', usage: 'Problem / challenge grids' },
  { name: 'paithani-lotus', label: 'Lotus Medallion', usage: 'Metrics sections' },
  { name: 'paithani-bangdi', label: 'Bangdi Mor (Bangle Peacock)', usage: 'CTA sections' },
  { name: 'warli', label: 'Warli', usage: 'Pipeline / process sections' },
  { name: 'ajanta', label: 'Ajanta', usage: 'Platform / feature sections' },
]

const opacities = [0.1, 0.2, 0.3, 0.5]

const activePattern = ref(patterns[0]!)
const activeOpacity = ref(0.3)

const colorMode = useColorMode()
function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen bg-default relative">
    <BgPattern
      :name="activePattern.name"
      :opacity="activeOpacity"
    />

    <div class="relative z-10 p-8">
      <div class="max-w-5xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-heading font-bold text-highlighted">
            Maharashtrian Patterns
          </h1>
          <div class="flex items-center gap-3">
            <UButton
              to="/"
              label="Back to Home"
              variant="outline"
              color="neutral"
              size="sm"
            />
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              @click="toggle"
            >
              {{ colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }}
            </UButton>
          </div>
        </div>

        <p class="mb-6 text-muted">
          Active: <strong class="text-highlighted">{{ activePattern.label }}</strong>
          at opacity <strong class="text-highlighted">{{ activeOpacity }}</strong>
        </p>

        <div class="flex items-center gap-2 mb-6">
          <span class="text-sm text-muted">Opacity:</span>
          <UButton
            v-for="op in opacities"
            :key="op"
            size="xs"
            :variant="activeOpacity === op ? 'solid' : 'outline'"
            :color="activeOpacity === op ? 'primary' : 'neutral'"
            @click="activeOpacity = op"
          >
            {{ op }}
          </UButton>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            v-for="pat in patterns"
            :key="pat.name"
            class="p-4 text-left rounded-xl border transition-all"
            :class="activePattern.name === pat.name
              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
              : 'border-default bg-default hover:bg-muted/50'"
            @click="activePattern = pat"
          >
            <div class="text-sm font-medium text-highlighted">
              {{ pat.label }}
            </div>
            <div class="text-xs text-dimmed font-mono mt-1">
              {{ pat.name }}
            </div>
            <div class="text-[10px] text-primary mt-2">
              {{ pat.usage }}
            </div>
          </button>
        </div>

        <div class="mt-8 p-8 rounded-2xl bg-default/80 backdrop-blur-sm border border-default">
          <h2 class="text-xl font-heading font-bold text-highlighted mb-3">
            Sample Content
          </h2>
          <p class="text-muted leading-relaxed max-w-[60ch]">
            This card sits on top of the pattern to show how content looks with the background.
            The pattern should be visible behind this card's semi-transparent background.
            Use this page to choose which patterns work best for different sections of the website.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
