# Incubrain Design System (v2)

## Color Palette

### Rationale
The generic AI blue/purple gradient is banned. This palette uses warm stone neutrals with a single saffron-amber accent — connecting to Paithani gold thread and Maharashtra's cultural identity.

### Dark Mode (Primary)

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Background | `#0c0a09` | `stone-950` | Page background |
| Surface | `#1c1917` | `stone-900` | Elevated containers |
| Surface Raised | `#292524` | `stone-800` | Hover states, borders |
| Border | `#44403c` / 30% | `stone-700/30` | Subtle dividers |
| Text Primary | `#fafaf9` | `stone-50` | Headlines, primary copy |
| Text Secondary | `#a8a29e` | `stone-400` | Body text, descriptions |
| Text Muted | `#78716c` | `stone-500` | Labels, captions |
| Accent | `#d97706` | `amber-600` | CTAs, highlights, links |
| Accent Hover | `#f59e0b` | `amber-500` | Hover states |
| Accent Subtle | `#d97706` / 10% | `amber-600/10` | Accent backgrounds |

### Accent Usage
- Max **one** accent color (amber-600)
- Saturation kept below 80%
- Used for: CTA buttons, active states, key data points, links
- Never used for: backgrounds (except at ~10% opacity), body text

## Typography

### Font Stack
- **Headlines**: `Outfit` (weight 700-800, tracking -0.025em)
- **Body**: System sans-serif stack
- **Data/Numbers**: `font-variant-numeric: tabular-nums` on all metrics

### Scale
| Element | Classes |
|---------|---------|
| Display (H1) | `text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.05] font-bold` |
| Section Title | `text-2xl md:text-4xl tracking-tight leading-tight font-bold` |
| Subtitle | `text-lg md:text-xl text-stone-400 leading-relaxed max-w-[55ch]` |
| Body | `text-base text-stone-400 leading-relaxed max-w-[65ch]` |
| Caption/Label | `text-xs uppercase tracking-widest text-stone-500 font-medium` |
| Metric Value | `text-4xl md:text-5xl font-bold tabular-nums` |

### Rules
- `text-wrap: balance` on all headlines
- No orphaned words (`text-pretty` on body)
- No gradient text fills on large headers
- Letter-spacing: tight on headlines, wide on labels

## Layout

### DESIGN_VARIANCE: 8 (Asymmetric)
- Hero: Split screen (60/40 or 55/45), text left-aligned
- Feature sections: 2-column zig-zag, NOT 3-equal-card rows
- Metrics: Bento grid with `grid-template-columns: 2fr 1fr` asymmetry
- Lists: Clean dividers (`border-t`), no cards unless elevation needed

### Spacing
- Section gaps: `py-24 md:py-32` (generous, art-gallery feel)
- Container: `max-w-6xl mx-auto px-6`
- Inner card padding: `p-8 md:p-10`
- Between items: `gap-8 md:gap-12`

### Responsive
- All asymmetric layouts collapse to single-column on mobile (`< md:`)
- Mobile: `w-full px-5 py-16`
- No horizontal scroll on any viewport

## Motion (MOTION_INTENSITY: 6)

### Transitions
- All interactive elements: `transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`
- Hover: `translateY(-2px)` + tinted shadow
- Active/press: `scale(0.98)`

### Scroll Reveals
- Elements enter with: `opacity 0 → 1` + `translateY(24px → 0)`
- Duration: 600ms with stagger delay of 100ms per item
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- One-shot (don't re-animate on scroll back up)

## Surfaces & Shadows

- Shadows are tinted warm: `rgba(12, 10, 9, 0.3)` not pure black
- Cards use `border border-stone-800/30` not heavy borders
- Glassmorphism (if used): `backdrop-blur-xl` + `border-white/5` + inner shadow
- Noise texture overlay at 2-3% opacity on muted backgrounds

## Icons
- Lucide via Nuxt UI (already installed)
- Consistent stroke width
- Avoid cliche metaphors (no rocket = launch, no shield = security)

## Patterns

**Rule: Never two patterned sections adjacent.** Patterns alternate with clean sections — pattern, clean, pattern, clean. This prevents a tacky, overdecorated look.

### Pattern Assignment (consistent across all pages)
| Section Type | Pattern | Opacity |
|---|---|---|
| Hero | `paithani-classic` | 0.5 |
| Metrics | `paithani-lotus` | 0.5 |
| CTA | `paithani-bangdi` | 0.5 |

Only 3 section types get patterns. All other sections (problem grids, pipeline rows, platform features, document showcases) remain clean.

### Available Patterns
- `paithani-classic` — Classic Peacock Pair
- `paithani-asawali` — Flowering Vine
- `paithani-lotus` — Lotus Medallion
- `paithani-bangdi` — Bangdi Mor (Bangle Peacock)
- `warli` — Warli tribal art
- `ajanta` — Ajanta cave paintings
