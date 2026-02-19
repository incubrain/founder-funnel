# Comment Module Architecture

Complete lifecycle walkthrough of the review commenting system.

## System Overview

```
Text mode:    User selects text → Plugin detects mouseup → computeAnchor → Popover → API → JSONL → CSS Highlight API
Element mode: User clicks element → Plugin detects click → vue-tracer component detection → computeElementAnchor → html-to-image screenshot → Popover → API → JSONL + PNG file → Outline
```

The comment module is **dev-only** (skipped in production). It is a Nuxt module registered in `layer/nuxt.config.ts` and auto-discovered by apps that extend the layer. It works on **all pages** (docs, landing, articles, etc.).

---

## 1. Module Registration (Build Time)

**File**: `layer/modules/comments/index.ts`

**When**: Nuxt build/dev startup, during module setup phase.

**What happens**:
1. Nuxt calls `setup(options, nuxt)` during the module registration phase
2. Guard: exits early if `!nuxt.options.dev || !options.enabled`
3. Stores `logFile` path in `runtimeConfig._comments` (available server-side only)
4. Adds `html-to-image` to Vite's `optimizeDeps.include` (required for dynamic import at runtime)
5. Registers:
   - **Auto-import**: `useDocComments` composable (available globally in `<script setup>`)
   - **Components dir**: all `.vue` files in `runtime/components/` become auto-imported components
   - **Client plugin**: `comments.client.ts` (mode: 'client' — never runs on server)
   - **Server handlers**: GET and POST at `/api/_comments`, GET at `/api/_comments/image/:id`

---

## 2. Global Component Mounting

**Comment components are mounted in `app.vue`** (not in individual layouts), making them available on every page:

```
app.vue
├── NuxtLayout → NuxtPage
└── ClientOnly v-if="isDev"
    ├── CommentSettings (toggle + mode switch + identity modal)
    ├── CommentPopover
    ├── CommentOverlay
    └── CommentPanel
```

---

## 3. Client Plugin Initialization

**File**: `runtime/plugins/comments.client.ts`

**What happens**:
1. Guard: `if (!import.meta.dev) return`
2. Gets shared state: `selection`, `loadComments`, `isEnabled`, `reviewMode`, `comments`
3. Watches `route.path` — loads comments for **every page** (no path prefix restriction)
4. Sets up two mode-specific handlers:

### Text Mode (`reviewMode === 'text'`)
- `mouseup` listener on `document`
- 10ms delay to let browser finalize selection
- Validates: not collapsed, range count > 0, text >= 3 chars
- Validates selection is within `resolveContentArea()` result
- Calls `computeAnchor(range, contentArea)` → sets `selection.value`

### Element Mode (`reviewMode === 'element'`)
- `mousemove` listener — uses `findHoverElement()` (synchronous, cached tracer) to add `.comment-element-hover` class
- `click` listener (capture phase) — calls `findComponentElement()` (async, vue-tracer) to detect Vue component boundary, computes element anchor with `componentName`/`filepath`, captures screenshot via `html-to-image`, sets `selection.value`
- Display text priority: `componentName` (`<SectionHero>`) → `data-testid` → `<tagName>`
- Selectable elements: Vue components (via tracer), elements with `data-testid`, semantic elements (SECTION, ARTICLE, etc.), block elements (P, DIV, UL, etc.)

---

## 4. Content Area Resolution

**Function**: `resolveContentArea()` in `anchor.ts`

Fallback chain:
1. `document.querySelector('[data-doc-content]')` — docs layout
2. `document.querySelector('main')` — all layouts (UMain renders `<main>`)
3. `document.body` — last resort

For text mode, `findContentRoot()` additionally drills through single-child div chains (Nuxt Content's `[data-doc-content] > div > div > content` wrapper pattern).

---

## 5. Anchor Types

### TextAnchor (text selections)

```typescript
interface TextAnchor {
  type?: 'text'          // optional for backwards compat
  headingId: string | null
  blockIndex: number
  textOffset: number
  textLength: number
  exact?: string         // normalized text with \n at block boundaries
  prefix?: string        // ~32 chars before selection
  suffix?: string        // ~32 chars after selection
}
```

**Algorithm** (`computeAnchor` in `anchor.ts`):
1. Walk UP from range.startContainer to find containing block element
2. Walk BACKWARD through siblings to find nearest heading (H1-H6)
3. Count blocks between heading and selection block as `blockIndex`
4. Compute `textOffset` within the block via TreeWalker
5. Extract `exact` from normalized text (with `\n` at block boundaries)
6. Extract `prefix`/`suffix` context for disambiguation

### ElementAnchor (element selections)

```typescript
interface ElementAnchor {
  type: 'element'
  selector: string              // CSS selector path
  testId: string | null         // data-testid if available
  tagName: string
  rect: { top, left, width, height }
  componentName?: string | null // Vue SFC __name (e.g. "SectionHero")
  filepath?: string | null      // SFC source path (e.g. "layer/app/components/section/SectionHero.vue")
}
```

**Algorithm** (`findComponentElement` + `computeElementAnchor` in `element-select.ts`):
1. Use vue-tracer's `findTraceFromElement(target)` to find the nearest Vue component boundary
2. Extract `componentName` from `vnode.type.__name` and `filepath` from the trace
3. Fall back to DOM traversal (`findSelectableElement`) if tracer data is unavailable
4. Build CSS selector path: prefer `[data-testid]`, fall back to `tagName:nth-of-type`
5. Record `testId`, `tagName`, bounding rect (with scroll offset), `componentName`, `filepath`

---

## 6. Highlighting

### Text Highlights — CSS Custom Highlight API

**File**: `highlight.ts`

Uses the browser-native CSS Custom Highlight API (`CSS.highlights`):
- Groups comments by priority into `Highlight` objects (`comment-low`, `comment-med`, `comment-critical`)
- Active/hovered comment gets a separate `comment-active` highlight
- Styled via `::highlight()` CSS pseudo-elements in `CommentOverlay.vue`
- No DOM mutation — highlights are painted as an overlay

**Re-anchoring** (`findCommentRange`):
1. **Fast path**: heading → blockIndex → textOffset (single-block)
2. **Text-quote search**: `buildNormalizedText()` → `indexOf(exact)` with prefix/suffix disambiguation
3. **Whitespace-insensitive fallback**: collapses whitespace for old comments

### Element Highlights — CSS Outlines

**File**: `CommentOverlay.vue`

- Open element comments get `.comment-element-outline` + priority-specific class
- Elements are located via `findElementByAnchor()` (testId first, CSS selector fallback)
- Hover detection via `[data-comment-element-id]` data attribute

### Click/Hover Detection

For text highlights: `caretPositionFromPoint` / `caretRangeFromPoint` + `Range.isPointInRange`
For element highlights: `target.closest('[data-comment-element-id]')`

---

## 7. Screenshot Capture

**File**: `element-select.ts` (client) + `comments.post.ts` (server)

### Client-side capture
Uses `html-to-image` (dev dependency, lazily imported via dynamic `import()`) to capture selected elements:
- `captureElementScreenshot(el)` → base64 PNG data URL
- Validates element is `HTMLElement` with non-zero dimensions
- Options: `cacheBust: true`, `pixelRatio: 1`, max 1920x1080
- Uses SVG serialization (browser's own rendering) — supports all CSS including `oklab()`/`oklch()`
- Best-effort: returns `undefined` on failure with detailed console logging

**Why not html2canvas**: html2canvas v1.4.1 has a built-in CSS parser that cannot handle modern CSS color functions (`oklab`, `oklch`) used by Tailwind v4 / Nuxt UI.

### Server-side storage
- On comment creation, the server extracts base64 data from the data URL
- Saves as PNG file to `.comments/images/{commentId}.png`
- Stores API path (`/api/_comments/image/{commentId}`) in the JSONL instead of base64
- `comments.image.get.ts` serves the PNG files with proper content-type
- On comment deletion, the associated PNG file is also removed

---

## 8. Server API

**Files**: `server/handlers/comments.get.ts`, `server/handlers/comments.post.ts`

### Anchor Schema (Zod)

The server validates both anchor types via `z.union()`:
- `textAnchorSchema`: headingId, blockIndex, textOffset, textLength + optional exact/prefix/suffix
- `elementAnchorSchema`: type='element', selector, testId, tagName, rect + optional componentName/filepath

### Endpoints

- `GET /api/_comments?page=...` — Read JSONL, filter by page
- `GET /api/_comments/image/:id` — Serve screenshot PNG for a comment
- `POST /api/_comments` — Create (append to JSONL, save screenshot PNG)
- `POST /api/_comments { action: 'resolve', id }` — Resolve (rewrite JSONL)
- `POST /api/_comments { action: 'update', id, category?, priority? }` — Update fields
- `POST /api/_comments { action: 'delete', id }` — Delete comment + screenshot file

---

## 9. Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (Client Only)                                        │
│                                                               │
│  ┌──────────┐  Text: mouseup    ┌──────────────────┐         │
│  │  Plugin   │─────────────────►│ computeAnchor    │         │
│  │           │  Element: click  │ or               │         │
│  │           │─────────────────►│ findComponentElement        │
│  └──────────┘                   │ (vue-tracer) →             │
│                                 │ computeElementAnchor       │
│                                 │ + html-to-image screenshot │
│       │                          └──────┬───────────┘         │
│       │ selection.value                 │                     │
│       └────────────────────────────────►│                     │
│                                ┌────────▼────────┐            │
│                                │ CommentPopover   │            │
│                                │ (user input)     │            │
│                                └────────┬────────┘            │
│                                         │ addComment()        │
│                                         ▼                     │
│  ┌──────────────────┐      POST /api/_comments                │
│  │ useDocComments    │───────────────────────────►┌──────────┐│
│  │ (composable)      │                            │  Server  ││
│  │                   │◄───────────────────────────│  (JSONL) ││
│  │ comments.value[]  │    { ...comment }          │          ││
│  └────────┬─────────┘                             └──────────┘│
│           │ watch                                              │
│           ▼                                                    │
│  ┌────────────────┐     ┌──────────────┐                      │
│  │ CommentOverlay │     │ CommentPanel │                      │
│  │ (CSS highlights│     │ (sidebar)    │                      │
│  │  + outlines)   │     └──────────────┘                      │
│  └────────────────┘                                           │
│                                                               │
│  ┌────────────────┐                                           │
│  │CommentSettings │ ← Toggle, mode switch, identity           │
│  │ (in header)    │                                           │
│  └────────────────┘                                           │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. localStorage Keys

| Key | Type | Default | Purpose |
|-----|------|---------|---------|
| `comments_enabled` | boolean | `false` | Toggle state |
| `comments_author` | string | `''` | Reviewer name |
| `comments_category` | CommentCategory | `'docs'` | Default category |
| `comments_review_mode` | ReviewMode | `'text'` | Active review mode |
