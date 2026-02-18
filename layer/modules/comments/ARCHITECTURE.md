# Comment Module Architecture

Complete lifecycle walkthrough of the documentation review commenting system.

## System Overview

```
User selects text → Plugin detects selection → Popover appears → User submits →
API stores to JSONL → Overlay re-highlights → Panel lists comments
```

The comment module is **dev-only** (skipped in production). It is a Nuxt module registered in `layer/nuxt.config.ts` and auto-discovered by apps that extend the layer.

---

## 1. Module Registration (Build Time)

**File**: `layer/modules/comments/index.ts`

**When**: Nuxt build/dev startup, during module setup phase.

**What happens**:
1. Nuxt calls `setup(options, nuxt)` during the module registration phase
2. Guard: exits early if `!nuxt.options.dev || !options.enabled`
3. Stores `logFile` path in `runtimeConfig._comments` (available server-side only)
4. Registers:
   - **Auto-import**: `useDocComments` composable (available globally in `<script setup>`)
   - **Components dir**: all `.vue` files in `runtime/components/` become auto-imported components
   - **Client plugin**: `comments.client.ts` (mode: 'client' — never runs on server)
   - **Server handlers**: GET and POST at `/api/_comments`

**Key detail**: Because this is a Nuxt module in the layer, any app extending the layer gets these registrations automatically. No opt-in needed.

---

## 2. Server-Side Rendering (SSR Request)

**When**: User navigates to a `/docs/*` page (initial load or hard refresh).

**What happens on the server (Nitro)**:
1. Nitro receives the request, Nuxt SSR kicks in
2. `docs.vue` layout runs `<script setup>` on the server:
   - `useContentPage()` fetches the markdown page from Nuxt Content's SQLite database
   - `queryCollectionNavigation()` builds the sidebar nav
   - `queryCollectionItemSurroundings()` gets prev/next links
3. The `<slot />` inside `<div data-doc-content>` renders the parsed markdown as HTML
4. Comment components (`CommentPopover`, `CommentOverlay`, `CommentPanel`, `CommentSettings`) are wrapped in `<ClientOnly>` — they render nothing on the server, just placeholder comments
5. The SSR HTML is sent to the browser

**Key detail**: No comment logic runs on the server. The `comments.client.ts` plugin has `mode: 'client'`. The `<ClientOnly>` wrapper ensures components don't hydrate server-side.

---

## 3. Client Hydration & Plugin Initialization

**When**: Browser receives SSR HTML, Vue hydrates.

**File**: `runtime/plugins/comments.client.ts`

**What happens**:
1. Plugin runs `defineNuxtPlugin(() => { ... })`
2. Guard: `if (!import.meta.dev) return` — no-op in production
3. Calls `useDocComments()` to get shared state refs (`selection`, `loadComments`, `isEnabled`)
4. Sets up a `watch` on `route.path`:
   - When path changes AND starts with `/docs`, calls `loadComments(path)`
   - This fetches `GET /api/_comments?page=/docs/...` and populates the `comments` ref
   - Runs immediately (`{ immediate: true }`) so comments load on first render
5. Sets up `mouseup` event listener on `document`:
   - Guard: `if (!isDocsPage.value || !isEnabled.value) return` — only active when toggle is ON
   - 10ms delay (let browser finalize selection)
   - Gets `window.getSelection()`, validates: not collapsed, has range, text >= 3 chars
   - Validates selection is within `[data-doc-content]` element
   - Calls `computeAnchor(range, contentArea)` to compute the anchor
   - Sets `selection.value = { text, anchor, rect }`

---

## 4. Anchor Computation (Selection → Coordinates)

**File**: `runtime/plugins/comments.client.ts` → `computeAnchor()`

**Purpose**: Convert a DOM Range into a serializable anchor that can relocate the text later.

**Algorithm**:
```
1. Walk UP from range.startContainer to find the containing block element
   (P, DIV, LI, UL, OL, PRE, BLOCKQUOTE, TABLE, etc.)

2. Walk BACKWARD through siblings to find nearest preceding heading (H1-H6)
   - Record its `id` attribute as `headingId`
   - Count block elements between heading and selection block as `blockIndex`

3. Compute textOffset within the block:
   - Create TreeWalker(block, SHOW_TEXT)
   - Count characters until reaching range.startContainer
   - Add range.startOffset

4. Record textLength = range.toString().length

Result: { headingId, blockIndex, textOffset, textLength }
```

### Known Issues with Anchor Computation

**Bold/inline formatting**: When selected text crosses element boundaries (e.g., spans a `<strong>` tag), the Range's `startContainer` is a text node inside the `<strong>`. The TreeWalker counts text across ALL child text nodes of the block, but `range.surroundContents()` fails when the range crosses element boundaries — this is a DOM API limitation.

**Multiple identical text**: The anchor uses heading + blockIndex + textOffset which should be unique. But the *fallback* text search (`node.textContent.includes(comment.selectedText)`) finds the FIRST match, not the anchored one.

**Multi-element selection (e.g., across list items)**: The selection spans multiple block elements (multiple `<li>` nodes). The anchor only records the starting block, and `range.surroundContents()` throws because the range crosses element boundaries.

---

## 5. Comment Popover (User Input)

**File**: `runtime/components/CommentPopover.vue`

**Trigger**: `isOpen` computed = `!!selection.value` (set by plugin on text selection)

**Positioning**: Uses Nuxt UI's `UPopover` with a virtual `reference` computed from `selection.value.rect.getBoundingClientRect()`.

**State**:
- `commentText` (local ref)
- `category` (local ref, reset to `globalCategory` on each new selection)
- `priority` (local ref, reset to `'low'` on each new selection)

**Submit flow**:
1. Validates: `selection.value` exists AND `commentText` is not empty
2. Calls `addComment({ page, selectedText, anchor, comment, category, priority })`
3. The composable POSTs to `/api/_comments` with `author` from localStorage
4. Server validates via Zod schema, generates `id`, appends to JSONL file
5. Returns the created comment object
6. Composable pushes to `comments.value` array and clears `selection.value`
7. CommentOverlay watches `comments` and re-applies highlights

---

## 6. Server API (JSONL Storage)

**Files**: `server/handlers/comments.get.ts`, `server/handlers/comments.post.ts`

### GET /api/_comments?page=...

1. Guard: `if (!import.meta.dev)` → 404
2. Read `.comments/review.jsonl` (configurable path)
3. Split by newlines, parse each line as JSON
4. Filter by `page` query param if provided
5. Return `{ comments: [...] }`

### POST /api/_comments (create)

1. Validate body against `newCommentSchema` (Zod)
2. Generate ID: `c_${crypto.randomUUID().slice(0, 8)}`
3. Append `{ ...parsed, id, status: 'open', createdAt }` as JSON line
4. Return the created comment

### POST /api/_comments (resolve)

1. Body: `{ action: 'resolve', id }`
2. Read entire file, parse lines, find by ID
3. Set `status: 'resolved'`, `resolvedAt: ISO timestamp`
4. Rewrite entire file

### POST /api/_comments (update)

1. Body: `{ action: 'update', id, category?, priority? }`
2. Read entire file, parse lines, find by ID
3. Update fields if provided
4. Rewrite entire file

**Storage format**: JSONL (one JSON object per line), stored at `.comments/review.jsonl` relative to the app's working directory.

---

## 7. Highlight Application (Overlay)

**File**: `runtime/components/CommentOverlay.vue`

**Trigger**: Watches `[comments, route.path, isEnabled]` with `{ deep: true }`.

**Algorithm** (`applyHighlights → highlightComment → wrapText`):

```
For each open comment:

STRATEGY 1 — Anchor-based lookup:
  1. Find heading element by CSS selector: #${CSS.escape(headingId)}
  2. Get parent element, filter children to block elements only
  3. Filter blocks that come AFTER the heading in DOM order
  4. Pick block at `blockIndex`
  5. TreeWalker through block's text nodes
  6. Count characters to find `textOffset`, then set range end at `textOffset + textLength`
  7. Call wrapRange() → creates <mark> element

STRATEGY 2 — Full content text search (fallback):
  8. TreeWalker through entire [data-doc-content]
  9. Find first text node containing `selectedText`
  10. Wrap that occurrence

STRATEGY 3 — Block-level text search (fallback within wrapText):
  11. If character offset doesn't find the text in the target block
  12. TreeWalker through the block, find text node containing `selectedText`
```

### wrapRange()

```javascript
const mark = document.createElement('mark')
mark.className = 'doc-comment-highlight'
mark.dataset.commentId = commentId
mark.addEventListener('click', () => { ... open panel })
range.surroundContents(mark) // ← THIS THROWS if range crosses elements
```

**Critical limitation**: `Range.surroundContents()` throws `InvalidStateError` when the range partially selects non-text nodes. This happens when:
- Selection includes `<strong>`, `<em>`, `<code>`, `<a>` elements
- Selection spans multiple `<li>` items
- Selection crosses any element boundary

The `try/catch` silently swallows the error, so the highlight simply doesn't appear.

---

## 8. Comment Panel (Review Sidebar)

**File**: `runtime/components/CommentPanel.vue`

**Trigger**: `isPanelOpen` ref (set by CommentSettings button or highlight click)

**Features**:
- Lists open comments with category/priority badges
- URadioGroup for inline category/priority editing → calls `updateComment()`
- Resolve button → calls `resolveComment()`
- Collapsed "Resolved" section with `<details>`

---

## 9. Comment Settings (Toggle + Identity)

**File**: `runtime/components/CommentSettings.vue`

**Location**: Rendered inside `UPageHeader #links` slot in `docs.vue` layout

**Flow**:
1. USwitch toggles `isEnabled` (persisted in localStorage as `comments_enabled`)
2. When toggling ON, `enableCommenting()` checks if `author` is set
3. If no author → opens UModal for identity setup (name + default category)
4. After confirming → sets `author`, `globalCategory`, `isEnabled` in localStorage
5. When enabled, shows comment count button that opens the panel

---

## 10. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Browser (Client Only)                                  │
│                                                         │
│  ┌──────────┐    mouseup     ┌───────────────┐         │
│  │  Plugin   │──────────────►│ computeAnchor │         │
│  │(selection)│               └──────┬────────┘         │
│  └──────────┘                       │                   │
│       │                             ▼                   │
│       │ selection.value    ┌──────────────┐             │
│       └───────────────────►│ CommentPopover│            │
│                            │ (user input)  │            │
│                            └──────┬────────┘            │
│                                   │ addComment()        │
│                                   ▼                     │
│  ┌──────────────────┐    POST /api/_comments            │
│  │ useDocComments    │─────────────────────────►┌──────┐│
│  │ (composable)      │                          │Server││
│  │                   │◄─────────────────────────│(JSONL││
│  │ comments.value[]  │    { ...comment }        │ file)││
│  └────────┬─────────┘                           └──────┘│
│           │ watch                                        │
│           ▼                                              │
│  ┌────────────────┐     ┌──────────────┐                │
│  │ CommentOverlay │     │ CommentPanel │                │
│  │ (highlights)   │     │ (sidebar)    │                │
│  └────────────────┘     └──────────────┘                │
│                                                         │
│  ┌────────────────┐                                     │
│  │CommentSettings │ ← Toggle, identity, panel trigger   │
│  └────────────────┘                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 11. localStorage Keys

| Key | Type | Default | Purpose |
|-----|------|---------|---------|
| `comments_enabled` | boolean | `false` | Toggle state |
| `comments_author` | string | `''` | Reviewer name |
| `comments_category` | CommentCategory | `'docs'` | Default category |

---

## 12. Nuxt Content DOM Structure

When Nuxt Content renders markdown, the resulting DOM inside `[data-doc-content]` looks like:

```html
<div data-doc-content>
  <!-- Heading with auto-generated ID -->
  <h2 id="what-is-foundry">
    <a href="#what-is-foundry">What is Foundry?</a>
  </h2>

  <!-- Paragraph with inline formatting -->
  <p>
    Foundry is a
    <a href="...">Nuxt Layer</a>
    that gives
    <strong>technical founders</strong>   ← Bold creates child element
    everything they need.
  </p>

  <!-- List items are individual block elements -->
  <ul>
    <li>                                   ← Each <li> is a separate block
      <strong>Landing pages</strong>       ← Bold inside list item
      built from Markdown
    </li>
    <li>
      <strong>Signal capture</strong>
      via email forms
    </li>
  </ul>

  <!-- Code blocks -->
  <pre><code>npm install @incubrain/foundry</code></pre>
</div>
```

**Key observations for highlighting**:
- `<strong>`, `<em>`, `<code>`, `<a>` create child elements within text flow
- A selection spanning "gives **technical founders** everything" crosses 3 text nodes and a `<strong>` element
- `range.surroundContents()` cannot wrap a range that partially contains an element
- TreeWalker text offset counts are correct but the wrapping step fails

---

## 13. Known Issues & Improvement Areas

See the issue tracker for current bugs and UX improvements. Key areas:

1. **Cross-element highlighting** — `surroundContents()` fails on bold/inline formatted text
2. **Duplicate text matching** — Fallback search finds first occurrence, not anchored one
3. **Multi-block selection** — Selecting across list items fails for same reason as #1
4. **No hover preview** — Highlighted text doesn't show comment on hover
5. **No navigation from panel** — Clicking a comment in panel doesn't scroll to it on page
6. **Priority-based highlight colors** — All highlights are yellow regardless of priority
7. **Re-selection behavior** — Selecting already-commented text creates a new comment instead of opening the existing one
