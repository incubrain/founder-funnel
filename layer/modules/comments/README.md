# Comments Module

A dev-only review commenting system for Nuxt applications. Allows reviewers to annotate any page with text highlights or element selections, stored as JSONL files for easy integration with issue trackers and AI agents.

## Features

- **Text highlighting** — Select text on any page to leave contextual comments. Uses the CSS Custom Highlight API for non-destructive, cross-element highlighting.
- **Element selection** — Select Vue components to comment on layout and design. Uses `vue-tracer` to detect component boundaries, displaying names like `<SectionHero>` instead of raw `<div>`. Captures a screenshot via `html-to-image`.
- **Global scope** — Works on all pages (docs, landing, articles, etc.), not just documentation.
- **Priority-based colors** — Comments are color-coded by priority (yellow/orange/red).
- **JSONL storage** — Comments stored as one JSON object per line in `.comments/review.jsonl`. Easy to parse, diff, and integrate.
- **Dev-only** — Completely stripped from production builds. No runtime cost.

## Quick Start

The module is auto-registered by the Nuxt layer. No configuration needed.

1. Start dev server: `pnpm dev`
2. Click the **Review** toggle in the header navbar (top-right, next to color mode)
3. Enter your name when prompted
4. Select text or switch to Element mode to start commenting

## Review Modes

### Text Mode (default)

Select text on any page. A popover appears to add a comment with category and priority. The selected text is highlighted with the CSS Custom Highlight API.

- Works across block elements (headings, paragraphs, code blocks, lists)
- Cross-element selections are anchored using text-quote matching with prefix/suffix disambiguation
- Priority colors: yellow (low), orange (med), red (critical)

### Element Mode

Click the box-select icon in the header to switch. Hover over elements to see a dashed outline. Click to select and comment.

- Uses `vue-tracer` to detect Vue component boundaries — shows `<SectionHero>` not `<div>`
- Falls back to `data-testid` or CSS selector path when tracer data is unavailable
- Automatically captures a screenshot via `html-to-image` (SVG serialization, supports all CSS including `oklab()`/`oklch()`)
- Screenshots saved as PNG files in `.comments/images/`, served via `/api/_comments/image/:id`
- Selected elements get a solid outline matching their priority color

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  comments: {
    enabled: true,                    // default: true (only runs in dev)
    logFile: '.comments/review.jsonl' // default storage path
  }
})
```

### localStorage Keys

| Key | Type | Default | Purpose |
|-----|------|---------|---------|
| `comments_enabled` | boolean | `false` | Toggle state |
| `comments_author` | string | `''` | Reviewer name |
| `comments_category` | CommentCategory | `'docs'` | Default category |
| `comments_review_mode` | `'text' \| 'element'` | `'text'` | Active review mode |

## API

### Composable: `useDocComments()`

Auto-imported. Returns shared reactive state:

```typescript
const {
  comments,        // Ref<DocComment[]> — all comments for current page
  selection,       // Ref<SelectionState | null> — current pending selection
  isEnabled,       // Ref<boolean> — review toggle state
  reviewMode,      // Ref<ReviewMode> — 'text' or 'element'
  isPanelOpen,     // Ref<boolean> — review panel visibility
  activeCommentId, // Ref<string | null> — currently focused comment
  author,          // Ref<string> — reviewer name
  globalCategory,  // Ref<CommentCategory> — default category
  openComments,    // ComputedRef<DocComment[]> — filtered open comments
  resolvedComments,// ComputedRef<DocComment[]> — filtered resolved comments
  loadComments,    // (page: string) => Promise<void>
  addComment,      // (payload) => Promise<DocComment>
  updateComment,   // (id, fields) => Promise<void>
  resolveComment,  // (id: string) => Promise<void>
  enableCommenting,// () => void — opens identity modal if needed
} = useDocComments()
```

### Server Endpoints

- `GET /api/_comments?page=/path` — Fetch comments for a page
- `POST /api/_comments` — Create, update, resolve, or delete comments
- `GET /api/_comments/image/:id` — Serve screenshot PNG for element comments

### Storage Format

Each line in `.comments/review.jsonl` is a JSON object:

```json
{"id":"c_a1b2c3d4","page":"/docs/intro","selectedText":"example text","anchor":{"headingId":"intro","blockIndex":0,"textOffset":5,"textLength":12,"exact":"example text","prefix":"This is an ","suffix":" for testing."},"comment":"Needs clarification","author":"drew","category":"docs","priority":"low","status":"open","createdAt":"2026-02-18T00:00:00.000Z"}
```

Element comments include `type: 'element'` in the anchor, optional `componentName`/`filepath` fields, and a `screenshot` path (e.g. `/api/_comments/image/c_a1b2c3d4`).

## Components

| Component | Purpose |
|-----------|---------|
| `CommentSettings` | Header toggle, mode switch, identity modal |
| `CommentToggle` | Inline toggle button for enabling/disabling review |
| `CommentPopover` | Selection popover for adding comments |
| `CommentOverlay` | Highlight rendering + hover previews |
| `CommentPanel` | Right slideover for reviewing all comments |

## Categories

`bug` · `ui` · `chore` · `feature` · `docs` · `perf`

## Priorities

`low` (yellow) · `med` (orange) · `critical` (red)
