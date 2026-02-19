# Comments Module — AI Agent Instructions

Instructions for AI agents working on the comments module.

## Module File Map

```
layer/modules/comments/
├── index.ts                          # Nuxt module setup (dev-only guard, auto-imports, Vite optimizeDeps)
├── ARCHITECTURE.md                   # Detailed lifecycle walkthrough
├── README.md                         # User-facing documentation
├── AGENTS.md                         # This file
├── runtime/
│   ├── types.ts                      # All type definitions (CommentAnchor union, ReviewMode, etc.)
│   ├── components/
│   │   ├── CommentSettings.vue       # Header toggle + mode switch + identity modal
│   │   ├── CommentToggle.vue         # Inline toggle button for enabling/disabling review
│   │   ├── CommentPopover.vue        # Selection popover for creating comments
│   │   ├── CommentOverlay.vue        # CSS Highlight API + element outlines + hover previews
│   │   └── CommentPanel.vue          # Right slideover for reviewing comments
│   ├── composables/
│   │   └── useDocComments.ts         # Shared state (singleton refs, API calls)
│   ├── plugins/
│   │   └── comments.client.ts        # Selection detection (text mode + element mode via vue-tracer)
│   └── utils/
│       ├── anchor.ts                 # Text anchor computation, resolveContentArea, buildNormalizedText
│       ├── highlight.ts              # CSS Custom Highlight API, findCommentRange, text-quote search
│       └── element-select.ts         # Vue component detection (vue-tracer), element anchor, screenshot (html-to-image)
└── server/
    └── handlers/
        ├── comments.get.ts           # GET /api/_comments — read JSONL
        ├── comments.image.get.ts     # GET /api/_comments/image/:id — serve screenshot PNGs
        └── comments.post.ts          # POST /api/_comments — create/update/resolve/delete (Zod validation)
```

## Key Architecture Decisions

### Why CSS Custom Highlight API (not DOM mutation)
- `Range.surroundContents()` fails when crossing element boundaries
- DOM mutation conflicts with Vue's VDOM reconciliation
- CSS Custom Highlight API is non-destructive — paints via `::highlight()` pseudo-elements
- Dev-only, so browser support (Chrome 105+, Safari 17.2+) is acceptable

### Why JSONL (not database)
- Zero setup — just a file
- Easy to diff in git
- Easy to parse line-by-line
- Easy to integrate with external tools

### Why resolveContentArea() fallback chain
- `[data-doc-content]` exists in docs layout but not landing/default/article layouts
- `<main>` (from `UMain`) exists on all pages
- Fallback chain: `[data-doc-content]` → `<main>` → `document.body`

### Why two anchor types (TextAnchor | ElementAnchor)
- Text selections need heading/block/offset positioning + text-quote matching
- Element selections need CSS selector path + testId + bounding rect + optional `componentName`/`filepath`
- Discriminated union via `type` field (`'text' | 'element'`)
- Legacy anchors (no `type` field) are treated as text anchors

### Why vue-tracer for element selection (not DOM traversal)
- Naive DOM traversal (`getSelectableElement`) almost always hits a generic `<div>` wrapper
- `vite-plugin-vue-tracer` (activated by Nuxt DevTools) provides `findTraceFromElement(el)` — returns the Vue SFC source, component name, and VNode
- Walks up the trace tree to find the nearest Vue component boundary
- Falls back to DOM traversal if tracer data is unavailable (graceful degradation)
- Synchronous `findHoverElement()` variant for mousemove (uses cached tracer module)

### Why html-to-image (not html2canvas)
- html2canvas v1.4.1 has a built-in CSS parser that cannot handle `oklab()`/`oklch()` colors used by Tailwind v4 / Nuxt UI
- `html-to-image` uses SVG serialization (browser's own rendering engine) — supports all CSS
- Lazily imported to keep out of the main bundle
- Must be in Vite's `optimizeDeps.include` for the bare specifier to resolve at runtime

## How to Modify

### Add a new comment type/field
1. Update `types.ts` — add field to `DocComment` or relevant anchor type
2. Update `comments.post.ts` — add to Zod schema
3. Update `CommentPopover.vue` — add UI for the new field
4. Update `CommentPanel.vue` — display the new field
5. Add tests in `comments-types.test.ts` and `comments-dom.nuxt.spec.ts`

### Add a new review mode
1. Add to `ReviewMode` union in `types.ts`
2. Add mode-specific handler in `comments.client.ts` plugin
3. Add mode button in `CommentSettings.vue`
4. Handle the new mode's highlights in `CommentOverlay.vue`
5. Handle display in `CommentPanel.vue`

### Modify anchor computation
- **Text anchors**: Edit `anchor.ts` — `computeAnchor()` builds `TextAnchor`
- **Element anchors**: Edit `element-select.ts` — `findComponentElement()` detects Vue component via tracer, `computeElementAnchor()` builds `ElementAnchor` with `componentName`/`filepath`
- **Re-anchoring**: Edit `highlight.ts` — `findCommentRange()` for text, `findElementByAnchor()` for elements

### Modify element selection pipeline
- **Component detection**: `findComponentElement()` in `element-select.ts` — vue-tracer integration with DOM fallback
- **Hover detection**: `findHoverElement()` — synchronous variant using cached tracer module
- **Screenshots**: `captureElementScreenshot()` in `element-select.ts` — uses `html-to-image`'s `toPng()`
- **Screenshot storage**: `comments.post.ts` saves PNGs to `.comments/images/`, `comments.image.get.ts` serves them

### Modify highlighting
- **Text highlights**: Edit `highlight.ts` — `applyHighlights()` uses CSS Custom Highlight API
- **Element outlines**: Edit `CommentOverlay.vue` — `applyElementOutlines()` adds CSS classes
- **CSS colors**: Edit `CommentOverlay.vue` — `::highlight()` rules and `.comment-element-outline-*` classes

## Testing Patterns

Tests are in `playground/test/comments/`:

- `comments-types.test.ts` — Type constants, type guards, discriminated union checks
- `comments-dom.nuxt.spec.ts` — DOM-level tests (anchor computation, range finding, element selection)
- `comments-server.test.ts` — Server handler tests (JSONL read/write, Zod validation)

### DOM test helpers
The test file provides helpers for building Nuxt Content-like DOM structures:
- `createContentArea()` — creates `[data-doc-content]` div
- `addHeading()`, `addParagraph()`, `addList()` — build content blocks
- `bold()`, `code()`, `link()` — inline formatting elements
- `addShikiCodeBlock()`, `addWrappedCodeBlock()` — code blocks with syntax highlighting
- `makeComment()` — factory for `DocComment` objects with defaults

### Running tests
```bash
pnpm test                    # All tests
pnpm test -- comments        # Just comment module tests
```

## Content Area Detection

The module uses `resolveContentArea()` to find the page content:

1. `document.querySelector('[data-doc-content]')` — docs layout
2. `document.querySelector('main')` — all other layouts (UMain renders `<main>`)
3. `document.body` — last resort fallback

For text mode, anchoring uses `findContentRoot()` which additionally drills through single-child div chains (Nuxt Content's rendering wrapper pattern).

## Global Component Locations

Components are mounted in `app.vue` (global scope):
- `CommentPopover`, `CommentOverlay`, `CommentPanel` — wrapped in `<ClientOnly v-if="isDev">`

`CommentSettings` is in `app.vue`. `CommentToggle` can be placed in any header component.

The client plugin (`comments.client.ts`) runs globally and loads comments for every route.
