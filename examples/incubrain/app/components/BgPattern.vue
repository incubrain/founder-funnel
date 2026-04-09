<script setup lang="ts">
/**
 * Switchable Marathi cultural background pattern.
 *
 * Usage:
 *   <BgPattern name="paithani" :opacity="0.15" />
 *
 * Props:
 *   name: 'paithani' | 'warli' | 'ajanta' | 'paithani-classic' |
 *         'paithani-asawali' | 'paithani-lotus' | 'paithani-bangdi' |
 *         'paithani-modern-geo' | 'paithani-modern-minimal' |
 *         'asawali-peacock' | 'asawali-lotus' | 'asawali-paisley' |
 *         'asawali-mixed' | 'asawali-dots'
 *   opacity: number (0-1, default 0.2)
 */

withDefaults(defineProps<{
  name?: 'paithani' | 'warli' | 'ajanta' | 'paithani-classic' | 'paithani-asawali' | 'paithani-lotus' | 'paithani-bangdi' | 'paithani-modern-geo' | 'paithani-modern-minimal' | 'asawali-peacock' | 'asawali-lotus' | 'asawali-paisley' | 'asawali-mixed' | 'asawali-dots'
  opacity?: number
  /** Use absolute instead of fixed positioning (for embedding inside masked containers) */
  absolute?: boolean
}>(), {
  name: 'paithani',
  opacity: 0.5,
  absolute: false
})

// Reactive stroke color based on color mode.
// Light: dark strokes on light bg. Dark: light strokes on dark bg.
const colorMode = useColorMode()
const C = computed(() => colorMode.value === 'dark' ? '#A8A29E' : '#44403C')
</script>

<template>
  <div
    class="pointer-events-none inset-0 z-0 overflow-hidden"
    :class="absolute ? 'absolute' : 'fixed'"
    aria-hidden="true"
  >
    <!-- ═══ PAITHANI — Paisley, rangoli dots, lotus, diamond borders ═══ -->
    <svg
      v-if="name === 'paithani'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-paithani"
          x="0"
          y="0"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="20"
            cy="20"
            r="1.8"
            :fill="C"
            opacity="0.7"
          />
          <circle
            cx="60"
            cy="20"
            r="1.8"
            :fill="C"
            opacity="0.7"
          />
          <circle
            cx="100"
            cy="20"
            r="1.8"
            :fill="C"
            opacity="0.7"
          />
          <circle
            cx="20"
            cy="60"
            r="2.2"
            :fill="C"
            opacity="0.85"
          />
          <circle
            cx="60"
            cy="60"
            r="2.8"
            :fill="C"
          />
          <circle
            cx="100"
            cy="60"
            r="2.2"
            :fill="C"
            opacity="0.85"
          />
          <circle
            cx="20"
            cy="100"
            r="1.8"
            :fill="C"
            opacity="0.7"
          />
          <circle
            cx="60"
            cy="100"
            r="1.8"
            :fill="C"
            opacity="0.7"
          />
          <circle
            cx="100"
            cy="100"
            r="1.8"
            :fill="C"
            opacity="0.7"
          />
          <path
            d="M58 28Q46 37 51 52Q56 60 65 55Q74 48 69 36Q64 26 58 28Z"
            fill="none"
            :stroke="C"
            stroke-width="1.2"
            opacity="0.6"
          />
          <path
            d="M59 35Q53 42 57 49Q61 54 64 49"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.5"
          />
          <path
            d="M60 56Q54 64 48 70Q54 68 60 70Q66 68 72 70Q66 64 60 56"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.5"
          />
          <path
            d="M20 20Q40 8 60 20"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.45"
          />
          <path
            d="M60 20Q80 8 100 20"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.45"
          />
          <path
            d="M20 100Q40 112 60 100"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.45"
          />
          <path
            d="M60 100Q80 112 100 100"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.45"
          />
          <path
            d="M8 60L20 48L32 60L20 72Z"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.45"
          />
          <path
            d="M88 60L100 48L112 60L100 72Z"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.45"
          />
        </pattern>
        <radialGradient
          id="fade-p"
          cx="50%"
          cy="40%"
          r="80%"
        >
          <stop
            offset="0%"
            stop-color="white"
            stop-opacity="1"
          />
          <stop
            offset="60%"
            stop-color="white"
            stop-opacity="0.8"
          />
          <stop
            offset="100%"
            stop-color="white"
            stop-opacity="0.1"
          />
        </radialGradient>
        <mask id="mask-p"><rect
          width="100%"
          height="100%"
          fill="url(#fade-p)"
        /></mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#p-paithani)"
        mask="url(#mask-p)"
      />
    </svg>

    <!-- ═══ WARLI — Tribal figures, sacred square, mountains, tree ═══ -->
    <svg
      v-else-if="name === 'warli'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-warli"
          x="0"
          y="0"
          width="140"
          height="140"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="45"
            y="45"
            width="50"
            height="50"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.6"
          />
          <circle
            cx="70"
            cy="70"
            r="8"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.6"
          />
          <circle
            cx="70"
            cy="70"
            r="3"
            :fill="C"
            opacity="0.5"
          />
          <polygon
            points="25,35 21,44 29,44"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.6"
          />
          <polygon
            points="25,44 21,53 29,53"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.6"
          />
          <circle
            cx="25"
            cy="32"
            r="3"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.6"
          />
          <line
            x1="21"
            y1="39"
            x2="15"
            y2="36"
            :stroke="C"
            stroke-width="0.7"
            opacity="0.5"
          />
          <line
            x1="29"
            y1="39"
            x2="35"
            y2="36"
            :stroke="C"
            stroke-width="0.7"
            opacity="0.5"
          />
          <polygon
            points="115,35 111,44 119,44"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.6"
          />
          <polygon
            points="115,44 111,53 119,53"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.6"
          />
          <circle
            cx="115"
            cy="32"
            r="3"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.6"
          />
          <polygon
            points="30,130 42,108 54,130"
            fill="none"
            :stroke="C"
            stroke-width="0.7"
            opacity="0.45"
          />
          <polygon
            points="86,130 98,108 110,130"
            fill="none"
            :stroke="C"
            stroke-width="0.7"
            opacity="0.45"
          />
          <polygon
            points="70,6 62,22 78,22"
            fill="none"
            :stroke="C"
            stroke-width="0.7"
            opacity="0.5"
          />
          <line
            x1="70"
            y1="22"
            x2="70"
            y2="32"
            :stroke="C"
            stroke-width="0.7"
            opacity="0.5"
          />
          <circle
            cx="40"
            cy="28"
            r="1.5"
            :fill="C"
            opacity="0.5"
          />
          <circle
            cx="100"
            cy="26"
            r="1.5"
            :fill="C"
            opacity="0.5"
          />
          <circle
            cx="35"
            cy="82"
            r="1.5"
            :fill="C"
            opacity="0.5"
          />
          <circle
            cx="105"
            cy="84"
            r="1.5"
            :fill="C"
            opacity="0.5"
          />
        </pattern>
        <radialGradient
          id="fade-w"
          cx="50%"
          cy="40%"
          r="80%"
        >
          <stop
            offset="0%"
            stop-color="white"
            stop-opacity="1"
          />
          <stop
            offset="60%"
            stop-color="white"
            stop-opacity="0.8"
          />
          <stop
            offset="100%"
            stop-color="white"
            stop-opacity="0.1"
          />
        </radialGradient>
        <mask id="mask-w"><rect
          width="100%"
          height="100%"
          fill="url(#fade-w)"
        /></mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#p-warli)"
        mask="url(#mask-w)"
      />
    </svg>

    <!-- ═══ AJANTA — Lotus medallion, vine scrolls, ceiling grid ═══ -->
    <svg
      v-else-if="name === 'ajanta'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-ajanta"
          x="0"
          y="0"
          width="130"
          height="130"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="65"
            cy="65"
            r="25"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.55"
          />
          <circle
            cx="65"
            cy="65"
            r="18"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.45"
          />
          <circle
            cx="65"
            cy="65"
            r="10"
            fill="none"
            :stroke="C"
            stroke-width="0.7"
            opacity="0.4"
          />
          <circle
            cx="65"
            cy="65"
            r="3.5"
            :fill="C"
            opacity="0.5"
          />
          <path
            d="M65 38Q59 43 57 50Q62 46 65 43Q68 46 73 50Q71 43 65 38"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.5"
          />
          <path
            d="M92 65Q87 59 80 57Q84 62 87 65Q84 68 80 73Q87 71 92 65"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.5"
          />
          <path
            d="M65 92Q71 87 73 80Q68 84 65 87Q62 84 57 80Q59 87 65 92"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.5"
          />
          <path
            d="M38 65Q43 71 50 73Q46 68 43 65Q46 62 50 57Q43 59 38 65"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.5"
          />
          <path
            d="M5 5Q16 9 22 20Q19 13 12 8"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.35"
          />
          <path
            d="M125 5Q114 9 108 20Q111 13 118 8"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.35"
          />
          <path
            d="M5 125Q16 121 22 110Q19 117 12 122"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.35"
          />
          <path
            d="M125 125Q114 121 108 110Q111 117 118 122"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.35"
          />
          <circle
            cx="10"
            cy="10"
            r="1.8"
            :fill="C"
            opacity="0.5"
          />
          <circle
            cx="120"
            cy="10"
            r="1.8"
            :fill="C"
            opacity="0.5"
          />
          <circle
            cx="10"
            cy="120"
            r="1.8"
            :fill="C"
            opacity="0.5"
          />
          <circle
            cx="120"
            cy="120"
            r="1.8"
            :fill="C"
            opacity="0.5"
          />
          <line
            x1="30"
            y1="30"
            x2="100"
            y2="30"
            :stroke="C"
            stroke-width="0.5"
            opacity="0.3"
            stroke-dasharray="4 8"
          />
          <line
            x1="30"
            y1="100"
            x2="100"
            y2="100"
            :stroke="C"
            stroke-width="0.5"
            opacity="0.3"
            stroke-dasharray="4 8"
          />
          <line
            x1="30"
            y1="30"
            x2="30"
            y2="100"
            :stroke="C"
            stroke-width="0.5"
            opacity="0.3"
            stroke-dasharray="4 8"
          />
          <line
            x1="100"
            y1="30"
            x2="100"
            y2="100"
            :stroke="C"
            stroke-width="0.5"
            opacity="0.3"
            stroke-dasharray="4 8"
          />
        </pattern>
        <radialGradient
          id="fade-a"
          cx="50%"
          cy="40%"
          r="80%"
        >
          <stop
            offset="0%"
            stop-color="white"
            stop-opacity="1"
          />
          <stop
            offset="60%"
            stop-color="white"
            stop-opacity="0.8"
          />
          <stop
            offset="100%"
            stop-color="white"
            stop-opacity="0.1"
          />
        </radialGradient>
        <mask id="mask-a"><rect
          width="100%"
          height="100%"
          fill="url(#fade-a)"
        /></mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#p-ajanta)"
        mask="url(#mask-a)"
      />
    </svg>

    <!-- ═══ PAITHANI-CLASSIC — Peacock pair with fanned tails, vine border ═══ -->
    <svg
      v-else-if="name === 'paithani-classic'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-paithani-classic"
          x="0"
          y="0"
          width="180"
          height="180"
          patternUnits="userSpaceOnUse"
        >
          <!-- Left peacock body -->
          <path
            d="M62 100Q58 92 55 84Q54 78 58 74Q62 70 66 74L68 80"
            fill="none"
            :stroke="C"
            stroke-width="1.2"
            opacity="0.65"
          />
          <!-- Left peacock head and crest -->
          <circle cx="55" cy="73" r="3.5" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <path d="M53 70L50 64M55 69L54 63M57 70L59 64" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <!-- Left peacock fanned tail feathers (arcing left) -->
          <path d="M68 80Q52 68 38 50" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M68 80Q56 64 48 42" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M68 80Q60 60 58 36" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M68 80Q65 56 68 32" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M68 80Q70 54 78 36" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <!-- Feather "eyes" on left tail — oval + inner dot -->
          <ellipse cx="38" cy="48" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="38" cy="48" r="1.3" :fill="C" opacity="0.55" />
          <ellipse cx="47" cy="40" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="47" cy="40" r="1.3" :fill="C" opacity="0.55" />
          <ellipse cx="57" cy="34" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="57" cy="34" r="1.3" :fill="C" opacity="0.55" />
          <ellipse cx="68" cy="31" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="68" cy="31" r="1.3" :fill="C" opacity="0.55" />
          <ellipse cx="78" cy="34" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="78" cy="34" r="1.3" :fill="C" opacity="0.55" />

          <!-- Right peacock body (mirror) -->
          <path
            d="M118 100Q122 92 125 84Q126 78 122 74Q118 70 114 74L112 80"
            fill="none"
            :stroke="C"
            stroke-width="1.2"
            opacity="0.65"
          />
          <!-- Right peacock head and crest -->
          <circle cx="125" cy="73" r="3.5" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <path d="M127 70L130 64M125 69L126 63M123 70L121 64" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <!-- Right peacock fanned tail feathers (arcing right) -->
          <path d="M112 80Q128 68 142 50" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M112 80Q124 64 132 42" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M112 80Q120 60 122 36" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M112 80Q115 56 112 32" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M112 80Q110 54 102 36" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <!-- Feather "eyes" on right tail -->
          <ellipse cx="142" cy="48" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="142" cy="48" r="1.3" :fill="C" opacity="0.55" />
          <ellipse cx="133" cy="40" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="133" cy="40" r="1.3" :fill="C" opacity="0.55" />
          <ellipse cx="123" cy="34" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="123" cy="34" r="1.3" :fill="C" opacity="0.55" />
          <ellipse cx="112" cy="31" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="112" cy="31" r="1.3" :fill="C" opacity="0.55" />
          <ellipse cx="102" cy="34" rx="3.5" ry="5" fill="none" :stroke="C" stroke-width="0.9" opacity="0.6" />
          <circle cx="102" cy="34" r="1.3" :fill="C" opacity="0.55" />

          <!-- Peacock legs -->
          <line x1="62" y1="100" x2="58" y2="110" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <line x1="62" y1="100" x2="66" y2="110" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <line x1="118" y1="100" x2="114" y2="110" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <line x1="118" y1="100" x2="122" y2="110" :stroke="C" stroke-width="0.8" opacity="0.5" />

          <!-- Vine border along bottom -->
          <path
            d="M0 140Q15 130 30 140Q45 150 60 140Q75 130 90 140Q105 150 120 140Q135 130 150 140Q165 150 180 140"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.5"
          />
          <!-- Small leaves on vine -->
          <path d="M15 135Q18 130 22 133" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M45 145Q48 140 52 143" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M75 135Q78 130 82 133" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M105 145Q108 140 112 143" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M135 135Q138 130 142 133" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M165 145Q168 140 172 143" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />

          <!-- Decorative dots between peacocks -->
          <circle cx="90" cy="90" r="2" :fill="C" opacity="0.5" />
          <circle cx="90" cy="80" r="1.2" :fill="C" opacity="0.4" />
          <circle cx="90" cy="70" r="1.2" :fill="C" opacity="0.4" />

          <!-- Corner accent dots for tile continuity -->
          <circle cx="5" cy="5" r="1.5" :fill="C" opacity="0.4" />
          <circle cx="175" cy="5" r="1.5" :fill="C" opacity="0.4" />
          <circle cx="5" cy="175" r="1.5" :fill="C" opacity="0.4" />
          <circle cx="175" cy="175" r="1.5" :fill="C" opacity="0.4" />

          <!-- Top vine border (seamless with bottom of tile above) -->
          <path
            d="M0 0Q15 10 30 0Q45 -10 60 0Q75 10 90 0Q105 -10 120 0Q135 10 150 0Q165 -10 180 0"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.5"
          />
          <!-- Top vine leaves -->
          <path d="M15 5Q18 10 22 7" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M75 5Q78 10 82 7" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M135 5Q138 10 142 7" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
        </pattern>
        <radialGradient id="fade-pc" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-pc"><rect width="100%" height="100%" fill="url(#fade-pc)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-paithani-classic)" mask="url(#mask-pc)" />
    </svg>

    <!-- ═══ PAITHANI-ASAWALI — Diagonal flowering vine with lotus buds ═══ -->
    <svg
      v-else-if="name === 'paithani-asawali'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-paithani-asawali"
          x="0"
          y="0"
          width="140"
          height="140"
          patternUnits="userSpaceOnUse"
        >
          <!-- Primary diagonal vine (bottom-left to top-right) -->
          <path
            d="M0 140Q20 120 35 105Q50 85 70 70Q85 55 105 35Q120 20 140 0"
            fill="none"
            :stroke="C"
            stroke-width="1.1"
            opacity="0.55"
          />
          <!-- Secondary diagonal vine (top-left to bottom-right, offset) -->
          <path
            d="M0 0Q20 20 35 35Q50 55 70 70Q85 85 105 105Q120 120 140 140"
            fill="none"
            :stroke="C"
            stroke-width="1.1"
            opacity="0.55"
          />

          <!-- Curling tendrils off primary vine -->
          <path d="M20 120Q12 115 16 108" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <path d="M50 88Q42 83 46 76" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <path d="M90 48Q82 43 86 36" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <path d="M120 18Q112 13 116 6" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />

          <!-- Curling tendrils off secondary vine -->
          <path d="M20 20Q28 15 24 8" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <path d="M50 52Q58 47 54 40" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <path d="M90 92Q98 87 94 80" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <path d="M120 122Q128 117 124 110" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />

          <!-- Lotus bud at center intersection -->
          <path
            d="M65 66Q67 58 70 55Q73 58 75 66"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.65"
          />
          <path
            d="M62 70Q66 62 70 59Q74 62 78 70"
            fill="none"
            :stroke="C"
            stroke-width="0.9"
            opacity="0.55"
          />
          <circle cx="70" cy="70" r="2" :fill="C" opacity="0.5" />

          <!-- Lotus bud at top-left corner (tiles to complete) -->
          <path d="M-5 -4Q-2 -12 0 -15Q2 -12 5 -4" fill="none" :stroke="C" stroke-width="1" opacity="0.65" />
          <circle cx="0" cy="0" r="1.5" :fill="C" opacity="0.5" />

          <!-- Lotus bud at bottom-right corner (tiles to complete) -->
          <path d="M135 136Q138 128 140 125Q142 128 145 136" fill="none" :stroke="C" stroke-width="1" opacity="0.65" />
          <circle cx="140" cy="140" r="1.5" :fill="C" opacity="0.5" />

          <!-- Small leaves along vines -->
          <path d="M34 106Q30 100 36 98" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M106 34Q102 28 108 26" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M34 34Q38 28 34 26" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M106 106Q110 100 106 98" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />

          <!-- Small flower blooms at vine midpoints -->
          <!-- Bloom near (35, 105) -->
          <circle cx="35" cy="105" r="4" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="35" cy="105" r="1.5" :fill="C" opacity="0.4" />
          <!-- Bloom near (105, 35) -->
          <circle cx="105" cy="35" r="4" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="105" cy="35" r="1.5" :fill="C" opacity="0.4" />
          <!-- Bloom near (35, 35) -->
          <circle cx="35" cy="35" r="4" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="35" cy="35" r="1.5" :fill="C" opacity="0.4" />
          <!-- Bloom near (105, 105) -->
          <circle cx="105" cy="105" r="4" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="105" cy="105" r="1.5" :fill="C" opacity="0.4" />

          <!-- Tiny accent dots -->
          <circle cx="20" cy="70" r="1" :fill="C" opacity="0.35" />
          <circle cx="70" cy="20" r="1" :fill="C" opacity="0.35" />
          <circle cx="120" cy="70" r="1" :fill="C" opacity="0.35" />
          <circle cx="70" cy="120" r="1" :fill="C" opacity="0.35" />
        </pattern>
        <radialGradient id="fade-pa" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-pa"><rect width="100%" height="100%" fill="url(#fade-pa)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-paithani-asawali)" mask="url(#mask-pa)" />
    </svg>

    <!-- ═══ ASAWALI-PEACOCK — 2x2 vine trellis with peacock collage in diamond windows ═══ -->
    <svg
      v-else-if="name === 'asawali-peacock'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-asawali-peacock"
          x="0"
          y="0"
          width="280"
          height="280"
          patternUnits="userSpaceOnUse"
        >
          <!-- ── Vine lattice (2x2 diamond grid) ── -->
          <path d="M0 280Q35 245 70 210Q105 175 140 140Q175 105 210 70Q245 35 280 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 0Q35 35 70 70Q105 105 140 140Q175 175 210 210Q245 245 280 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 105 70 70Q105 35 140 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 280Q175 245 210 210Q245 175 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 175 70 210Q105 245 140 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 0Q175 35 210 70Q245 105 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />

          <!-- Tendrils curling off vines -->
          <path d="M40 240Q32 235 36 228" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M100 180Q92 175 96 168" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M180 100Q188 95 184 88" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 40Q248 35 244 28" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M40 40Q32 45 36 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 240Q248 245 244 252" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M50 110Q42 108 45 102" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M230 170Q238 172 235 178" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- Tiny leaves -->
          <path d="M60 220Q56 214 62 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 60Q216 54 222 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M60 60Q64 54 60 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 220Q224 214 220 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M30 140Q26 134 32 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M250 140Q254 134 250 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- ── Diamond A (140,70): Full peacock in profile ── -->
          <!-- Body — curved oval -->
          <ellipse cx="140" cy="74" rx="8" ry="12" fill="none" :stroke="C" stroke-width="0.9" opacity="0.55" transform="rotate(-10 140 74)" />
          <!-- Head — small circle with neck line -->
          <path d="M140 62Q138 56 136 52" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <circle cx="135" cy="50" r="3.5" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <!-- Beak -->
          <path d="M131.5 49L128 48" fill="none" :stroke="C" stroke-width="0.7" opacity="0.5" />
          <!-- Crest — 3 tiny dots above head -->
          <circle cx="134" cy="45.5" r="0.8" :fill="C" opacity="0.45" />
          <circle cx="136.5" cy="44.5" r="0.8" :fill="C" opacity="0.45" />
          <circle cx="139" cy="45" r="0.8" :fill="C" opacity="0.45" />
          <!-- Tail feathers — 3 elegant curves fanning right -->
          <path d="M148 74Q158 60 162 48" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M148 76Q160 68 168 58" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M147 78Q162 76 170 68" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <!-- Feather eyes at tips (oval + inner dot) -->
          <ellipse cx="162" cy="47" rx="3" ry="4" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="162" cy="47" r="1" :fill="C" opacity="0.4" />
          <ellipse cx="168.5" cy="57" rx="3" ry="4" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="168.5" cy="57" r="1" :fill="C" opacity="0.4" />
          <ellipse cx="170.5" cy="67.5" rx="3" ry="3.5" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="170.5" cy="67.5" r="1" :fill="C" opacity="0.4" />
          <!-- Legs -->
          <path d="M138 86L136 94" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <path d="M142 86L144 94" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />

          <!-- ── Diamond B (70,140): EMPTY — tiny accent dot ── -->
          <circle cx="70" cy="140" r="1" :fill="C" opacity="0.35" />

          <!-- ── Diamond C (210,140): Single large peacock feather ── -->
          <!-- Feather shaft -->
          <path d="M210 118L210 162" fill="none" :stroke="C" stroke-width="0.7" opacity="0.5" />
          <!-- Feather eye at top — large oval + inner ellipse + center dot -->
          <ellipse cx="210" cy="125" rx="8" ry="11" fill="none" :stroke="C" stroke-width="0.9" opacity="0.55" />
          <ellipse cx="210" cy="125" rx="5" ry="7" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <ellipse cx="210" cy="124" rx="2.5" ry="3.5" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <circle cx="210" cy="124" r="1.5" :fill="C" opacity="0.5" />
          <!-- Feather barbs (wispy lines off shaft) -->
          <path d="M210 140Q205 138 202 135" fill="none" :stroke="C" stroke-width="0.5" opacity="0.35" />
          <path d="M210 140Q215 138 218 135" fill="none" :stroke="C" stroke-width="0.5" opacity="0.35" />
          <path d="M210 150Q204 148 200 146" fill="none" :stroke="C" stroke-width="0.5" opacity="0.35" />
          <path d="M210 150Q216 148 220 146" fill="none" :stroke="C" stroke-width="0.5" opacity="0.35" />

          <!-- ── Diamond D (140,210): EMPTY ── -->

          <!-- Corner texture dots -->
          <circle cx="0" cy="0" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="280" cy="0" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="0" cy="280" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="280" cy="280" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="140" cy="0" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="140" cy="280" r="0.8" :fill="C" opacity="0.3" />
        </pattern>
        <radialGradient id="fade-apk" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-apk"><rect width="100%" height="100%" fill="url(#fade-apk)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-asawali-peacock)" mask="url(#mask-apk)" />
    </svg>

    <!-- ═══ ASAWALI-LOTUS — 2x2 vine trellis with lotus garden in diamond windows ═══ -->
    <svg
      v-else-if="name === 'asawali-lotus'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-asawali-lotus"
          x="0"
          y="0"
          width="280"
          height="280"
          patternUnits="userSpaceOnUse"
        >
          <!-- ── Vine lattice (2x2 diamond grid) ── -->
          <path d="M0 280Q35 245 70 210Q105 175 140 140Q175 105 210 70Q245 35 280 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 0Q35 35 70 70Q105 105 140 140Q175 175 210 210Q245 245 280 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 105 70 70Q105 35 140 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 280Q175 245 210 210Q245 175 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 175 70 210Q105 245 140 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 0Q175 35 210 70Q245 105 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />

          <!-- Tendrils -->
          <path d="M40 240Q32 235 36 228" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M100 180Q92 175 96 168" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M180 100Q188 95 184 88" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 40Q248 35 244 28" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M40 40Q32 45 36 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 240Q248 245 244 252" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M50 110Q42 108 45 102" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M230 170Q238 172 235 178" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- Tiny leaves -->
          <path d="M60 220Q56 214 62 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 60Q216 54 222 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M60 60Q64 54 60 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 220Q224 214 220 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M30 140Q26 134 32 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M250 140Q254 134 250 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- ── Diamond A (140,70): EMPTY — single dot ── -->
          <circle cx="140" cy="70" r="1" :fill="C" opacity="0.35" />

          <!-- ── Diamond B (70,140): Full 8-petal lotus ── -->
          <!-- 8 petals radiating from center -->
          <!-- N petal -->
          <path d="M70 125Q64 132 70 140Q76 132 70 125" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <!-- NE petal -->
          <path d="M80.6 129.4Q78 133 70 140Q77 137 80.6 129.4" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <!-- E petal -->
          <path d="M85 140Q78 134 70 140Q78 146 85 140" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <!-- SE petal -->
          <path d="M80.6 150.6Q78 147 70 140Q77 143 80.6 150.6" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <!-- S petal -->
          <path d="M70 155Q76 148 70 140Q64 148 70 155" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <!-- SW petal -->
          <path d="M59.4 150.6Q62 147 70 140Q63 143 59.4 150.6" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <!-- W petal -->
          <path d="M55 140Q62 146 70 140Q62 134 55 140" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <!-- NW petal -->
          <path d="M59.4 129.4Q62 133 70 140Q63 137 59.4 129.4" fill="none" :stroke="C" stroke-width="0.8" opacity="0.55" />
          <!-- Concentric rings -->
          <circle cx="70" cy="140" r="12" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <circle cx="70" cy="140" r="7" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <circle cx="70" cy="140" r="3" fill="none" :stroke="C" stroke-width="0.5" opacity="0.35" />
          <!-- Center dot -->
          <circle cx="70" cy="140" r="1.5" :fill="C" opacity="0.5" />

          <!-- ── Diamond C (210,140): EMPTY ── -->

          <!-- ── Diamond D (140,210): Smaller 4-petal lotus bud (half-opened) ── -->
          <!-- 4 petals, slightly closed/cupped -->
          <path d="M140 198Q136 203 140 210Q144 203 140 198" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M150 210Q144 206 140 210Q144 214 150 210" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M140 222Q144 217 140 210Q136 217 140 222" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M130 210Q136 214 140 210Q136 206 130 210" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <!-- Bud calyx (two small curves below) -->
          <path d="M136 220Q140 224 144 220" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <!-- Center -->
          <circle cx="140" cy="210" r="1.2" :fill="C" opacity="0.45" />

          <!-- Corner texture dots -->
          <circle cx="0" cy="0" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="280" cy="0" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="0" cy="280" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="280" cy="280" r="0.8" :fill="C" opacity="0.3" />
        </pattern>
        <radialGradient id="fade-alt" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-alt"><rect width="100%" height="100%" fill="url(#fade-alt)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-asawali-lotus)" mask="url(#mask-alt)" />
    </svg>

    <!-- ═══ ASAWALI-PAISLEY — 2x2 vine trellis with paisley tapestry in diamond windows ═══ -->
    <svg
      v-else-if="name === 'asawali-paisley'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-asawali-paisley"
          x="0"
          y="0"
          width="280"
          height="280"
          patternUnits="userSpaceOnUse"
        >
          <!-- ── Vine lattice (2x2 diamond grid) ── -->
          <path d="M0 280Q35 245 70 210Q105 175 140 140Q175 105 210 70Q245 35 280 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 0Q35 35 70 70Q105 105 140 140Q175 175 210 210Q245 245 280 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 105 70 70Q105 35 140 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 280Q175 245 210 210Q245 175 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 175 70 210Q105 245 140 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 0Q175 35 210 70Q245 105 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />

          <!-- Tendrils -->
          <path d="M40 240Q32 235 36 228" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M100 180Q92 175 96 168" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M180 100Q188 95 184 88" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 40Q248 35 244 28" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M40 40Q32 45 36 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 240Q248 245 244 252" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M50 110Q42 108 45 102" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M230 170Q238 172 235 178" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- Tiny leaves -->
          <path d="M60 220Q56 214 62 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 60Q216 54 222 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M60 60Q64 54 60 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 220Q224 214 220 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M30 140Q26 134 32 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M250 140Q254 134 250 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- ── Diamond A (140,70): Large paisley/ambi teardrop ── -->
          <!-- Outer teardrop shape -->
          <path
            d="M140 48Q128 52 125 65Q126 78 140 85Q154 78 155 65Q154 56 148 50Q144 48 140 48Z"
            fill="none" :stroke="C" stroke-width="0.9" opacity="0.55"
          />
          <!-- Inner parallel curve -->
          <path
            d="M140 54Q132 57 130 66Q131 75 140 79"
            fill="none" :stroke="C" stroke-width="0.7" opacity="0.45"
          />
          <!-- Curling tip at top -->
          <path d="M140 48Q137 43 133 44Q130 46 131 50" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <!-- 3 dots inside -->
          <circle cx="140" cy="62" r="1" :fill="C" opacity="0.4" />
          <circle cx="140" cy="68" r="1" :fill="C" opacity="0.4" />
          <circle cx="140" cy="74" r="1" :fill="C" opacity="0.4" />

          <!-- ── Diamond B (70,140): EMPTY — single dot ── -->
          <circle cx="70" cy="140" r="1" :fill="C" opacity="0.35" />

          <!-- ── Diamond C (210,140): Two small opposing paisleys ── -->
          <!-- Left-facing paisley -->
          <path
            d="M204 134Q198 136 197 140Q198 144 204 145Q207 143 207 140Q207 137 205 135Z"
            fill="none" :stroke="C" stroke-width="0.7" opacity="0.5"
          />
          <circle cx="202" cy="140" r="0.7" :fill="C" opacity="0.4" />
          <!-- Right-facing paisley -->
          <path
            d="M216 146Q222 144 223 140Q222 136 216 135Q213 137 213 140Q213 143 215 145Z"
            fill="none" :stroke="C" stroke-width="0.7" opacity="0.5"
          />
          <circle cx="218" cy="140" r="0.7" :fill="C" opacity="0.4" />

          <!-- ── Diamond D (140,210): EMPTY ── -->

          <!-- Accent dots scattered -->
          <circle cx="0" cy="0" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="280" cy="0" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="0" cy="280" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="280" cy="280" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="140" cy="140" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="0" cy="140" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="280" cy="140" r="0.8" :fill="C" opacity="0.3" />
        </pattern>
        <radialGradient id="fade-aps" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-aps"><rect width="100%" height="100%" fill="url(#fade-aps)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-asawali-paisley)" mask="url(#mask-aps)" />
    </svg>

    <!-- ═══ ASAWALI-MIXED — 2x2 vine trellis with cultural collage (Warli + Paithani + Ajanta) ═══ -->
    <svg
      v-else-if="name === 'asawali-mixed'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-asawali-mixed"
          x="0"
          y="0"
          width="280"
          height="280"
          patternUnits="userSpaceOnUse"
        >
          <!-- ── Vine lattice (2x2 diamond grid) ── -->
          <path d="M0 280Q35 245 70 210Q105 175 140 140Q175 105 210 70Q245 35 280 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 0Q35 35 70 70Q105 105 140 140Q175 175 210 210Q245 245 280 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 105 70 70Q105 35 140 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 280Q175 245 210 210Q245 175 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 175 70 210Q105 245 140 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 0Q175 35 210 70Q245 105 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />

          <!-- Tendrils -->
          <path d="M40 240Q32 235 36 228" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M100 180Q92 175 96 168" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M180 100Q188 95 184 88" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 40Q248 35 244 28" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M40 40Q32 45 36 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 240Q248 245 244 252" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M50 110Q42 108 45 102" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M230 170Q238 172 235 178" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- Tiny leaves -->
          <path d="M60 220Q56 214 62 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 60Q216 54 222 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M60 60Q64 54 60 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 220Q224 214 220 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M30 140Q26 134 32 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M250 140Q254 134 250 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- ── Diamond A (140,70): Warli-style dancing scene ── -->
          <!-- Left dancer: triangle body + circle head + stick arms/legs -->
          <polygon points="130,82 124,62 136,62" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <circle cx="130" cy="58" r="3" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M124 68L118 62" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M136 68L140 63" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M127 82L124 90" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <path d="M133 82L136 90" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <!-- Right dancer -->
          <polygon points="152,82 146,62 158,62" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <circle cx="152" cy="58" r="3" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M146 68L142 63" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M158 68L162 62" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <path d="M149 82L146 90" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <path d="M155 82L158 90" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <!-- Small tree between dancers -->
          <path d="M141 90L141 74" fill="none" :stroke="C" stroke-width="0.6" opacity="0.45" />
          <path d="M141 78L137 72" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <path d="M141 78L145 72" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <path d="M141 82L138 77" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <path d="M141 82L144 77" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />

          <!-- ── Diamond B (70,140): Paithani peacock feather eye ── -->
          <ellipse cx="70" cy="140" rx="9" ry="13" fill="none" :stroke="C" stroke-width="0.9" opacity="0.55" />
          <ellipse cx="70" cy="140" rx="5.5" ry="8" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <ellipse cx="70" cy="139" rx="2.5" ry="4" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <circle cx="70" cy="139" r="1.5" :fill="C" opacity="0.5" />

          <!-- ── Diamond C (210,140): Ajanta-style lotus medallion ── -->
          <!-- Concentric circles -->
          <circle cx="210" cy="140" r="15" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <circle cx="210" cy="140" r="10" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="210" cy="140" r="5" fill="none" :stroke="C" stroke-width="0.6" opacity="0.4" />
          <!-- 4 petal curves at cardinal points -->
          <path d="M210 125Q204 130 210 140Q216 130 210 125" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M225 140Q220 134 210 140Q220 146 225 140" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M210 155Q216 150 210 140Q204 150 210 155" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <path d="M195 140Q200 146 210 140Q200 134 195 140" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <!-- Center dot -->
          <circle cx="210" cy="140" r="2" :fill="C" opacity="0.5" />

          <!-- ── Diamond D (140,210): EMPTY — just a dot ── -->
          <circle cx="140" cy="210" r="1" :fill="C" opacity="0.35" />

          <!-- Corner dots -->
          <circle cx="0" cy="0" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="280" cy="0" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="0" cy="280" r="0.8" :fill="C" opacity="0.3" />
          <circle cx="280" cy="280" r="0.8" :fill="C" opacity="0.3" />
        </pattern>
        <radialGradient id="fade-amx" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-amx"><rect width="100%" height="100%" fill="url(#fade-amx)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-asawali-mixed)" mask="url(#mask-amx)" />
    </svg>

    <!-- ═══ ASAWALI-DOTS — 2x2 vine trellis with rangoli dot compositions in diamond windows ═══ -->
    <svg
      v-else-if="name === 'asawali-dots'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-asawali-dots"
          x="0"
          y="0"
          width="280"
          height="280"
          patternUnits="userSpaceOnUse"
        >
          <!-- ── Vine lattice (2x2 diamond grid) ── -->
          <path d="M0 280Q35 245 70 210Q105 175 140 140Q175 105 210 70Q245 35 280 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 0Q35 35 70 70Q105 105 140 140Q175 175 210 210Q245 245 280 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 105 70 70Q105 35 140 0" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 280Q175 245 210 210Q245 175 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M0 140Q35 175 70 210Q105 245 140 280" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />
          <path d="M140 0Q175 35 210 70Q245 105 280 140" fill="none" :stroke="C" stroke-width="1.2" opacity="0.5" />

          <!-- Tendrils -->
          <path d="M40 240Q32 235 36 228" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M100 180Q92 175 96 168" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M180 100Q188 95 184 88" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 40Q248 35 244 28" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M40 40Q32 45 36 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M240 240Q248 245 244 252" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M50 110Q42 108 45 102" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M230 170Q238 172 235 178" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- Tiny leaves -->
          <path d="M60 220Q56 214 62 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 60Q216 54 222 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M60 60Q64 54 60 52" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M220 220Q224 214 220 212" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M30 140Q26 134 32 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <path d="M250 140Q254 134 250 132" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />

          <!-- ── Diamond A (140,70): Large rangoli — center dot + inner ring of 8 + outer ring of 8 ── -->
          <!-- Center dot -->
          <circle cx="140" cy="70" r="2" :fill="C" opacity="0.5" />
          <!-- Inner ring: 8 dots at 20px radius -->
          <circle cx="160" cy="70" r="1.5" :fill="C" opacity="0.45" />
          <circle cx="154.14" cy="55.86" r="1.5" :fill="C" opacity="0.45" />
          <circle cx="140" cy="50" r="1.5" :fill="C" opacity="0.45" />
          <circle cx="125.86" cy="55.86" r="1.5" :fill="C" opacity="0.45" />
          <circle cx="120" cy="70" r="1.5" :fill="C" opacity="0.45" />
          <circle cx="125.86" cy="84.14" r="1.5" :fill="C" opacity="0.45" />
          <circle cx="140" cy="90" r="1.5" :fill="C" opacity="0.45" />
          <circle cx="154.14" cy="84.14" r="1.5" :fill="C" opacity="0.45" />
          <!-- Outer ring: 8 smaller dots at 30px radius, offset 22.5 degrees -->
          <circle cx="167.72" cy="58.52" r="1" :fill="C" opacity="0.4" />
          <circle cx="151.48" cy="42.28" r="1" :fill="C" opacity="0.4" />
          <circle cx="128.52" cy="42.28" r="1" :fill="C" opacity="0.4" />
          <circle cx="112.28" cy="58.52" r="1" :fill="C" opacity="0.4" />
          <circle cx="112.28" cy="81.48" r="1" :fill="C" opacity="0.4" />
          <circle cx="128.52" cy="97.72" r="1" :fill="C" opacity="0.4" />
          <circle cx="151.48" cy="97.72" r="1" :fill="C" opacity="0.4" />
          <circle cx="167.72" cy="81.48" r="1" :fill="C" opacity="0.4" />

          <!-- ── Diamond B (70,140): EMPTY ── -->

          <!-- ── Diamond C (210,140): Smaller rangoli — center dot + ring of 5 ── -->
          <circle cx="210" cy="140" r="1.5" :fill="C" opacity="0.5" />
          <!-- 5 dots in a ring at 14px radius -->
          <circle cx="224" cy="140" r="1.2" :fill="C" opacity="0.4" />
          <circle cx="214.33" cy="126.68" r="1.2" :fill="C" opacity="0.4" />
          <circle cx="201.38" cy="130.64" r="1.2" :fill="C" opacity="0.4" />
          <circle cx="201.38" cy="149.36" r="1.2" :fill="C" opacity="0.4" />
          <circle cx="214.33" cy="153.32" r="1.2" :fill="C" opacity="0.4" />

          <!-- ── Diamond D (140,210): 3 dots in triangle ── -->
          <circle cx="140" cy="203" r="1.2" :fill="C" opacity="0.4" />
          <circle cx="135" cy="213" r="1.2" :fill="C" opacity="0.4" />
          <circle cx="145" cy="213" r="1.2" :fill="C" opacity="0.4" />
        </pattern>
        <radialGradient id="fade-adt" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-adt"><rect width="100%" height="100%" fill="url(#fade-adt)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-asawali-dots)" mask="url(#mask-adt)" />
    </svg>

    <!-- ═══ PAITHANI-LOTUS — Eight-petaled lotus medallions in grid ═══ -->
    <svg
      v-else-if="name === 'paithani-lotus'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-paithani-lotus"
          x="0"
          y="0"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          <!-- Central lotus medallion -->
          <!-- Outer concentric ring -->
          <circle cx="80" cy="80" r="32" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />
          <!-- Inner concentric ring -->
          <circle cx="80" cy="80" r="24" fill="none" :stroke="C" stroke-width="0.7" opacity="0.35" />
          <!-- Center circles -->
          <circle cx="80" cy="80" r="8" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <circle cx="80" cy="80" r="4" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <circle cx="80" cy="80" r="1.8" :fill="C" opacity="0.55" />

          <!-- 8 lotus petals (N, NE, E, SE, S, SW, W, NW) -->
          <!-- North petal -->
          <path d="M80 48Q76 56 74 62Q80 58 86 62Q84 56 80 48Z" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <!-- NE petal -->
          <path d="M103 57Q98 62 96 67Q100 66 105 69Q104 63 103 57Z" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <!-- East petal -->
          <path d="M112 80Q104 76 98 74Q102 80 98 86Q104 84 112 80Z" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <!-- SE petal -->
          <path d="M103 103Q98 98 96 93Q100 94 105 91Q104 97 103 103Z" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <!-- South petal -->
          <path d="M80 112Q76 104 74 98Q80 102 86 98Q84 104 80 112Z" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <!-- SW petal -->
          <path d="M57 103Q62 98 64 93Q60 94 55 91Q56 97 57 103Z" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <!-- West petal -->
          <path d="M48 80Q56 76 62 74Q58 80 62 86Q56 84 48 80Z" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <!-- NW petal -->
          <path d="M57 57Q62 62 64 67Q60 66 55 69Q56 63 57 57Z" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />

          <!-- Small diamonds between medallions at tile corners -->
          <!-- Top-left diamond -->
          <path d="M0 12L12 0L24 12L12 24Z" fill="none" :stroke="C" stroke-width="0.9" opacity="0.45" />
          <circle cx="12" cy="12" r="1.5" :fill="C" opacity="0.4" />
          <!-- Top-right diamond -->
          <path d="M136 12L148 0L160 12L148 24Z" fill="none" :stroke="C" stroke-width="0.9" opacity="0.45" />
          <circle cx="148" cy="12" r="1.5" :fill="C" opacity="0.4" />
          <!-- Bottom-left diamond -->
          <path d="M0 148L12 136L24 148L12 160Z" fill="none" :stroke="C" stroke-width="0.9" opacity="0.45" />
          <circle cx="12" cy="148" r="1.5" :fill="C" opacity="0.4" />
          <!-- Bottom-right diamond -->
          <path d="M136 148L148 136L160 148L148 160Z" fill="none" :stroke="C" stroke-width="0.9" opacity="0.45" />
          <circle cx="148" cy="148" r="1.5" :fill="C" opacity="0.4" />

          <!-- Small dot accents at midpoints of tile edges -->
          <circle cx="80" cy="4" r="1.2" :fill="C" opacity="0.35" />
          <circle cx="80" cy="156" r="1.2" :fill="C" opacity="0.35" />
          <circle cx="4" cy="80" r="1.2" :fill="C" opacity="0.35" />
          <circle cx="156" cy="80" r="1.2" :fill="C" opacity="0.35" />

          <!-- Tiny diamond shapes at grid midpoints -->
          <path d="M80 16L84 12L80 8L76 12Z" fill="none" :stroke="C" stroke-width="0.7" opacity="0.35" />
          <path d="M80 152L84 148L80 144L76 148Z" fill="none" :stroke="C" stroke-width="0.7" opacity="0.35" />
          <path d="M16 80L12 84L8 80L12 76Z" fill="none" :stroke="C" stroke-width="0.7" opacity="0.35" />
          <path d="M152 80L148 84L144 80L148 76Z" fill="none" :stroke="C" stroke-width="0.7" opacity="0.35" />
        </pattern>
        <radialGradient id="fade-pl" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-pl"><rect width="100%" height="100%" fill="url(#fade-pl)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-paithani-lotus)" mask="url(#mask-pl)" />
    </svg>

    <!-- ═══ PAITHANI-BANGDI — Bangdi Mor (bangle peacock) with circular tail ═══ -->
    <svg
      v-else-if="name === 'paithani-bangdi'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-paithani-bangdi"
          x="0"
          y="0"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          <!-- Peacock body (center-bottom of tile) -->
          <path
            d="M80 115Q76 108 74 100Q73 94 76 90Q80 86 84 90Q87 94 86 100Q84 108 80 115Z"
            fill="none"
            :stroke="C"
            stroke-width="1.2"
            opacity="0.65"
          />
          <!-- Peacock head -->
          <circle cx="80" cy="86" r="4" fill="none" :stroke="C" stroke-width="1" opacity="0.6" />
          <circle cx="80" cy="85" r="1.2" :fill="C" opacity="0.5" />
          <!-- Peacock crest -->
          <path d="M78 82L76 76M80 81L80 75M82 82L84 76" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <!-- Crest dots -->
          <circle cx="76" cy="75" r="1" :fill="C" opacity="0.45" />
          <circle cx="80" cy="74" r="1" :fill="C" opacity="0.45" />
          <circle cx="84" cy="75" r="1" :fill="C" opacity="0.45" />

          <!-- Peacock legs -->
          <line x1="78" y1="115" x2="74" y2="125" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <line x1="82" y1="115" x2="86" y2="125" :stroke="C" stroke-width="0.8" opacity="0.5" />

          <!-- Bangle/circular tail feathers arranged in arc -->
          <!-- Center bangle (topmost) -->
          <circle cx="80" cy="42" r="12" fill="none" :stroke="C" stroke-width="1" opacity="0.55" />
          <ellipse cx="80" cy="42" rx="5" ry="7" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <circle cx="80" cy="42" r="2" :fill="C" opacity="0.5" />

          <!-- Left bangles -->
          <circle cx="54" cy="50" r="11" fill="none" :stroke="C" stroke-width="1" opacity="0.55" />
          <ellipse cx="54" cy="50" rx="4.5" ry="6.5" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <circle cx="54" cy="50" r="1.8" :fill="C" opacity="0.5" />

          <circle cx="34" cy="66" r="10" fill="none" :stroke="C" stroke-width="1" opacity="0.5" />
          <ellipse cx="34" cy="66" rx="4" ry="6" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <circle cx="34" cy="66" r="1.6" :fill="C" opacity="0.45" />

          <!-- Right bangles -->
          <circle cx="106" cy="50" r="11" fill="none" :stroke="C" stroke-width="1" opacity="0.55" />
          <ellipse cx="106" cy="50" rx="4.5" ry="6.5" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <circle cx="106" cy="50" r="1.8" :fill="C" opacity="0.5" />

          <circle cx="126" cy="66" r="10" fill="none" :stroke="C" stroke-width="1" opacity="0.5" />
          <ellipse cx="126" cy="66" rx="4" ry="6" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <circle cx="126" cy="66" r="1.6" :fill="C" opacity="0.45" />

          <!-- Connecting arcs from body to bangles -->
          <path d="M76 90Q68 78 54 62" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />
          <path d="M76 90Q72 74 68 56Q66 48 58 42" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />
          <path d="M80 86Q78 70 80 54" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />
          <path d="M84 90Q88 74 92 56Q94 48 102 42" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />
          <path d="M84 90Q92 78 106 62" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />

          <!-- Small decorative elements at corners for tiling -->
          <!-- Small paisley at corners -->
          <path d="M8 8Q14 4 16 10Q12 14 8 8Z" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />
          <path d="M152 8Q146 4 144 10Q148 14 152 8Z" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />
          <path d="M8 152Q14 156 16 150Q12 146 8 152Z" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />
          <path d="M152 152Q146 156 144 150Q148 146 152 152Z" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />

          <!-- Bottom border dots -->
          <circle cx="40" cy="145" r="1.2" :fill="C" opacity="0.35" />
          <circle cx="80" cy="148" r="1.2" :fill="C" opacity="0.35" />
          <circle cx="120" cy="145" r="1.2" :fill="C" opacity="0.35" />
        </pattern>
        <radialGradient id="fade-pb" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-pb"><rect width="100%" height="100%" fill="url(#fade-pb)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-paithani-bangdi)" mask="url(#mask-pb)" />
    </svg>

    <!-- ═══ PAITHANI-MODERN-GEO — Geometric peacock feather eyes in honeycomb/scale ═══ -->
    <svg
      v-else-if="name === 'paithani-modern-geo'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-paithani-modern-geo"
          x="0"
          y="0"
          width="120"
          height="140"
          patternUnits="userSpaceOnUse"
        >
          <!-- Row 1: Feather eye scale shapes -->
          <!-- Scale 1 -->
          <path
            d="M0 35Q15 5 30 0Q45 5 60 35"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.5"
          />
          <!-- Feather eye inside scale 1 -->
          <ellipse cx="30" cy="18" rx="8" ry="12" fill="none" :stroke="C" stroke-width="0.9" opacity="0.55" />
          <ellipse cx="30" cy="18" rx="4" ry="7" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="30" cy="17" r="2" :fill="C" opacity="0.5" />

          <!-- Scale 2 -->
          <path
            d="M60 35Q75 5 90 0Q105 5 120 35"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.5"
          />
          <!-- Feather eye inside scale 2 -->
          <ellipse cx="90" cy="18" rx="8" ry="12" fill="none" :stroke="C" stroke-width="0.9" opacity="0.55" />
          <ellipse cx="90" cy="18" rx="4" ry="7" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="90" cy="17" r="2" :fill="C" opacity="0.5" />

          <!-- Row 2 (offset by half): Feather eye scale shapes -->
          <!-- Scale 3 (offset) -->
          <path
            d="M-30 105Q-15 75 0 70Q15 75 30 105"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.5"
          />
          <!-- Feather eye inside scale 3 (wraps at left edge) -->
          <ellipse cx="0" cy="88" rx="8" ry="12" fill="none" :stroke="C" stroke-width="0.9" opacity="0.55" />
          <ellipse cx="0" cy="88" rx="4" ry="7" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="0" cy="87" r="2" :fill="C" opacity="0.5" />

          <!-- Scale 4 (offset center) -->
          <path
            d="M30 105Q45 75 60 70Q75 75 90 105"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.5"
          />
          <!-- Feather eye inside scale 4 -->
          <ellipse cx="60" cy="88" rx="8" ry="12" fill="none" :stroke="C" stroke-width="0.9" opacity="0.55" />
          <ellipse cx="60" cy="88" rx="4" ry="7" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="60" cy="87" r="2" :fill="C" opacity="0.5" />

          <!-- Scale 5 (offset, wraps at right edge) -->
          <path
            d="M90 105Q105 75 120 70Q135 75 150 105"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.5"
          />
          <!-- Feather eye inside scale 5 -->
          <ellipse cx="120" cy="88" rx="8" ry="12" fill="none" :stroke="C" stroke-width="0.9" opacity="0.55" />
          <ellipse cx="120" cy="88" rx="4" ry="7" fill="none" :stroke="C" stroke-width="0.7" opacity="0.45" />
          <circle cx="120" cy="87" r="2" :fill="C" opacity="0.5" />

          <!-- Thin horizontal spine lines through each row -->
          <line x1="0" y1="35" x2="120" y2="35" :stroke="C" stroke-width="0.5" opacity="0.3" />
          <line x1="0" y1="105" x2="120" y2="105" :stroke="C" stroke-width="0.5" opacity="0.3" />

          <!-- Subtle center vein lines in each feather eye -->
          <line x1="30" y1="6" x2="30" y2="30" :stroke="C" stroke-width="0.5" opacity="0.3" />
          <line x1="90" y1="6" x2="90" y2="30" :stroke="C" stroke-width="0.5" opacity="0.3" />
          <line x1="0" y1="76" x2="0" y2="100" :stroke="C" stroke-width="0.5" opacity="0.3" />
          <line x1="60" y1="76" x2="60" y2="100" :stroke="C" stroke-width="0.5" opacity="0.3" />
          <line x1="120" y1="76" x2="120" y2="100" :stroke="C" stroke-width="0.5" opacity="0.3" />
        </pattern>
        <radialGradient id="fade-pmg" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-pmg"><rect width="100%" height="100%" fill="url(#fade-pmg)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-paithani-modern-geo)" mask="url(#mask-pmg)" />
    </svg>

    <!-- ═══ PAITHANI-MODERN-MINIMAL — Abstracted peacock silhouettes and paisley ═══ -->
    <svg
      v-else-if="name === 'paithani-modern-minimal'"
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ opacity }"
    >
      <defs>
        <pattern
          id="p-paithani-modern-minimal"
          x="0"
          y="0"
          width="180"
          height="180"
          patternUnits="userSpaceOnUse"
        >
          <!-- Abstracted peacock silhouette (top-left area) -->
          <!-- Body curve -->
          <path
            d="M40 55Q36 65 38 75Q40 82 45 80Q48 76 46 70Q44 62 40 55"
            fill="none"
            :stroke="C"
            stroke-width="1.2"
            opacity="0.6"
          />
          <!-- Head dot -->
          <circle cx="39" cy="53" r="2.5" fill="none" :stroke="C" stroke-width="1" opacity="0.55" />
          <!-- Simplified crest (single line with dot) -->
          <line x1="39" y1="50" x2="39" y2="44" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <circle cx="39" cy="43" r="1" :fill="C" opacity="0.45" />
          <!-- Simplified fan tail (3 elegant curves) -->
          <path d="M45 70Q52 56 48 40" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <path d="M45 70Q58 60 58 42" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <path d="M45 70Q62 66 68 50" fill="none" :stroke="C" stroke-width="0.8" opacity="0.45" />
          <!-- Single feather eye on middle curve -->
          <ellipse cx="54" cy="48" rx="3" ry="4.5" fill="none" :stroke="C" stroke-width="0.8" opacity="0.5" />
          <circle cx="54" cy="48" r="1.2" :fill="C" opacity="0.45" />

          <!-- Large paisley teardrop (right area) -->
          <path
            d="M130 70Q118 82 120 100Q122 115 135 118Q148 115 150 100Q152 82 140 68Q136 64 130 70Z"
            fill="none"
            :stroke="C"
            stroke-width="1.1"
            opacity="0.55"
          />
          <!-- Inner paisley curve -->
          <path
            d="M133 78Q126 88 128 100Q130 108 135 110Q140 108 142 100Q144 88 137 78"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.4"
          />
          <!-- Paisley center dot -->
          <circle cx="135" cy="96" r="2" :fill="C" opacity="0.45" />
          <!-- Paisley tip curl -->
          <path d="M130 70Q126 66 128 62" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />

          <!-- Small paisley teardrop (bottom-left) -->
          <path
            d="M60 140Q54 146 55 155Q56 162 62 164Q68 162 69 155Q70 146 64 140Q62 138 60 140Z"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.5"
          />
          <circle cx="62" cy="152" r="1.2" :fill="C" opacity="0.4" />

          <!-- Thin connecting lines (scattered, elegant) -->
          <line x1="48" y1="80" x2="60" y2="140" :stroke="C" stroke-width="0.5" opacity="0.25" />
          <line x1="68" y1="50" x2="120" y2="72" :stroke="C" stroke-width="0.5" opacity="0.25" />
          <line x1="70" y1="155" x2="120" y2="118" :stroke="C" stroke-width="0.5" opacity="0.25" />

          <!-- Scattered accent dots -->
          <circle cx="90" cy="30" r="1.5" :fill="C" opacity="0.35" />
          <circle cx="20" cy="120" r="1.2" :fill="C" opacity="0.3" />
          <circle cx="160" cy="40" r="1.2" :fill="C" opacity="0.3" />
          <circle cx="100" cy="150" r="1" :fill="C" opacity="0.25" />
          <circle cx="15" cy="20" r="1" :fill="C" opacity="0.25" />
          <circle cx="170" cy="160" r="1" :fill="C" opacity="0.25" />

          <!-- Small abstracted peacock (bottom-right, facing left for variety) -->
          <path
            d="M150 130Q152 138 150 145Q148 150 144 148Q142 144 144 140Q146 134 150 130"
            fill="none"
            :stroke="C"
            stroke-width="1"
            opacity="0.45"
          />
          <circle cx="150" cy="128" r="2" fill="none" :stroke="C" stroke-width="0.8" opacity="0.4" />
          <path d="M143 140Q138 132 140 122" fill="none" :stroke="C" stroke-width="0.7" opacity="0.35" />
          <path d="M143 140Q134 136 130 126" fill="none" :stroke="C" stroke-width="0.7" opacity="0.35" />
          <ellipse cx="136" cy="128" rx="2.5" ry="3.5" fill="none" :stroke="C" stroke-width="0.7" opacity="0.4" />
          <circle cx="136" cy="128" r="1" :fill="C" opacity="0.35" />

          <!-- Tiny paisley near top-right for balance -->
          <path
            d="M160 15Q156 18 157 24Q158 28 162 28Q166 27 166 24Q166 18 163 15Q161 14 160 15Z"
            fill="none"
            :stroke="C"
            stroke-width="0.8"
            opacity="0.4"
          />
        </pattern>
        <radialGradient id="fade-pmm" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="60%" stop-color="white" stop-opacity="0.8" />
          <stop offset="100%" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <mask id="mask-pmm"><rect width="100%" height="100%" fill="url(#fade-pmm)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-paithani-modern-minimal)" mask="url(#mask-pmm)" />
    </svg>
  </div>
</template>
