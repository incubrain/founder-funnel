# Upstream Docus Sync — Full Change List

**Baseline:** docus `v5.4.4` (2026-01-19) — pinned to our hard-fork commit `97ecc15` (2026-01-25).
**Upstream HEAD:** `v5.11.0` (2026-05-07).
**Releases reviewed:** 11 (v5.5.0 → v5.11.0).
**Source:** `/Users/mac/.opensrc/repos/github.com/nuxt-content/docus/main/CHANGELOG.md`.

## How to use this list

Every feature/fix from the 11 releases is listed below, grouped by release. **i18n-related changes have been excluded** per your instruction. Nothing else has been pre-filtered.

Mark each row by replacing `[ ]` with one of:

- `[x]` — **adopt**
- `[~]` — **investigate first** (need to look at code before deciding)
- `[-]` — **skip** (with optional one-line reason)

When done, hand the file back and I'll plan the adoption order + cherry-pick approach.

---

## v5.11.0 (2026-05-07)

### Features
- [x] **css:** add support for `app/app.css` to avoid duplicate tailwind ([#1364](https://github.com/nuxt-content/docus/issues/1364))
- [x] **layer:** set `ContentTOC` default variant to `circuit` ([#1360](https://github.com/nuxt-content/docus/issues/1360))
- [x] **toc:** improve main grid to make it wider ([#1363](https://github.com/nuxt-content/docus/issues/1363))

### Bug Fixes
- [x] **css:** don't use `@layer base` for prod hydration ([73606b7](https://github.com/nuxt-content/docus/commit/73606b7))
- [~] **layer:** incorrect MCP tools when `app.baseURL` is set ([#1361](https://github.com/nuxt-content/docus/issues/1361))
- [~] **mcp:** respect `mcp.route` in page header dropdown ([#1362](https://github.com/nuxt-content/docus/issues/1362))

---

## v5.10.1 (2026-05-05)

### Bug Fixes
- [~] **ai:** make sure to set markdown headers as response ([#1348](https://github.com/nuxt-themes/docus/issues/1348))
- [~] **assistant:** use internal fetch for MCP on workers ([#1309](https://github.com/nuxt-themes/docus/issues/1309))

---

## v5.10.0 (2026-04-17)

### Features
- [~] **customization:** add `AppHeaderLeft` component ([#1332](https://github.com/nuxt-content/docus/issues/1332))
- [x] **layer:** forward app config defaultVariants to subcomponents ([#1338](https://github.com/nuxt-content/docus/issues/1338))
- [~] **skills:** make directory configurable via module options ([#1341](https://github.com/nuxt-content/docus/issues/1341))

### Bug Fixes
- [-] **.starters:** accurate folder prefix ([#1334](https://github.com/nuxt-content/docus/issues/1334))
- [~] **build:** remove noisy vite warns ([#1344](https://github.com/nuxt-content/docus/issues/1344))

> i18n entries (#1335, #1336) excluded per instruction.

---

## v5.9.0 (2026-04-02)

### Features
- [~] **assistant:** accept OIDC or API key ([#1323](https://github.com/nuxt-content/docus/issues/1323))
- [~] **assistant:** improve mcp page tools ([#1326](https://github.com/nuxt-content/docus/issues/1326))
- [x] **layer:** add option to force color-mode ([#1310](https://github.com/nuxt-content/docus/issues/1310))
- [x] **ogImage:** upgrade to v6 and use primary color ([#1312](https://github.com/nuxt-content/docus/issues/1312))
- [~] **skills:** add agent skills discovery via `.well-known` ([#1297](https://github.com/nuxt-content/docus/issues/1297))

### Bug Fixes
- [-] **layer:** do not display edit page if github url missing ([#1327](https://github.com/nuxt-content/docus/issues/1327))
- [x] **og:** limit description size ([#1325](https://github.com/nuxt-content/docus/issues/1325))
- [x] **og:** set og image as static ([#1324](https://github.com/nuxt-content/docus/issues/1324))
- [x] **starters:** use extend in nuxt config ([#1328](https://github.com/nuxt-content/docus/issues/1328))

---

## v5.8.1 (2026-03-14)

### Bug Fixes
- [x] **import:** relative path ([#1307](https://github.com/nuxt-content/docus/issues/1307))

---

## v5.8.0 (2026-03-12)

### Features
- [x] **nav:** add opt-in sub-navigation ([#1298](https://github.com/nuxt-content/docus/issues/1298))
- [~] **skills:** add `/review-docs` ([#1265](https://github.com/nuxt-content/docus/issues/1265))

### Bug Fixes
- [~] **assistant:** use `baseURL` for api call ([#1295](https://github.com/nuxt-content/docus/issues/1295))
- [x] **mcp:** derive Docus MCP page URLs from request origin ([#1302](https://github.com/nuxt-content/docus/issues/1302))
- [x] **mcp:** use request fetch for raw page content ([#1304](https://github.com/nuxt-content/docus/issues/1304))
- [x] **typescript:** support `nuxt typecheck` in apps extending docus ([#1300](https://github.com/nuxt-content/docus/issues/1300))

> i18n entry (#1305) excluded per instruction.

---

## v5.7.0 (2026-02-27)

### Features
- [x] **customization:** native support for custom icons ([#1288](https://github.com/nuxt-content/docus/issues/1288))

### Bug Fixes
- [x] **layer:** improve og image generation ([#1286](https://github.com/nuxt-content/docus/issues/1286))

---

## v5.6.1 (2026-02-19)

### Features
- [x] **layer:** improve right-click and logo handling ([#1281](https://github.com/nuxt-content/docus/issues/1281))

### Bug Fixes
- [x] **layer:** root docs prefix ([#1283](https://github.com/nuxt-content/docus/issues/1283))

---

## v5.6.0 (2026-02-17)

### Features
- [x] **landing:** make it optional ([#1274](https://github.com/nuxt-content/docus/issues/1274))
- [x] **layer:** handle docs prefix & folder ([#1275](https://github.com/nuxt-content/docus/issues/1275))

### Bug Fixes
- [~] **assistant:** stop floating input overlay from intercepting clicks ([#1277](https://github.com/nuxt-content/docus/issues/1277))
- [x] **layer:** reduce noisy dev warnings for optional AI assistant ([#1276](https://github.com/nuxt-content/docus/issues/1276))
- [x] **layer:** use native sqlite connector ([33334ce](https://github.com/nuxt-content/docus/commit/33334ce))

> i18n entry (7a48865) excluded per instruction.

---

## v5.5.1 (2026-02-13)

### Features
- [x] **layer:** add more seo optimization ([#1267](https://github.com/nuxt-content/docus/issues/1267))

### Bug Fixes
- [~] **assistant:** improves assistant UI/UX and responsiveness ([#1268](https://github.com/nuxt-content/docus/issues/1268))
- [~] **docs:** do not show separator if github is disabled ([#1270](https://github.com/nuxt-content/docus/issues/1270))
- [~] **logs:** remove extra title ([7adad7c](https://github.com/nuxt-content/docus/commit/7adad7c))
- [x] **theme:** don't use `@theme` static for priority ([#1271](https://github.com/nuxt-content/docus/issues/1271))

### Reverts
- [-] Revert "chore: make sure to use Nuxt 4.3.0 everywhere" ([f40ac5e](https://github.com/nuxt-content/docus/commit/f40ac5e))

---

## v5.5.0 (2026-02-04)

### Features
- [~] add skills folder with first skill `/create-docs` ([#1257](https://github.com/nuxt-content/docus/issues/1257))
- [x] **layer:** add `sitemap.xml` generation ([#1259](https://github.com/nuxt-content/docus/issues/1259))
- [~] **layer:** add ai assistant module ([#1241](https://github.com/nuxt-content/docus/issues/1241))
- [x] **llms:** add docs page redirection to raw markdown for agents ([#1264](https://github.com/nuxt-content/docus/issues/1264))
- [x] **llms:** redirect homepage to `/llms.txt` ([#1263](https://github.com/nuxt-content/docus/issues/1263))

### Bug Fixes
- [x] **.starters:** prerendering issues ([8fe3796](https://github.com/nuxt-content/docus/commit/8fe3796))
- [x] **.starters:** prerendering issues ([edab8bf](https://github.com/nuxt-content/docus/commit/edab8bf))
- [~] **assistant:** do not trigger panel when opening Studio ([6199d95](https://github.com/nuxt-content/docus/commit/6199d95))
- [x] **build:** remove warnings ([845e4c8](https://github.com/nuxt-content/docus/commit/845e4c8))
- [x] **layer:** add `@vercel/oidc` to optimizeDeps ([#1262](https://github.com/nuxt-content/docus/issues/1262))
- [x] **layer:** enhance sitemap generation, exclude navigation files ([#1261](https://github.com/nuxt-content/docus/issues/1261))
- [x] **llms:** default domain ([d7ff04a](https://github.com/nuxt-content/docus/commit/d7ff04a))
- [x] **llms:** infer vercel urls ([6d437cc](https://github.com/nuxt-content/docus/commit/6d437cc))
- [~] **logs:** use nuxt logger ([e6be163](https://github.com/nuxt-content/docus/commit/e6be163))

> i18n-template prerendering fix (251b962) + locale lazy import (#1266) excluded per instruction.

---

## Totals

- **Features:** 22 (excluding i18n)
- **Bug fixes:** 33 (excluding i18n)
- **Reverts:** 1
- **Total to triage:** 56

## After you mark this file

Hand it back and I will:
1. Group `[x]` items by theme + dependency order.
2. For each, fetch the upstream commit (`opensrc fetch` + read), map it onto our `layer/modules/docs/` structure, and produce a per-change implementation note.
3. For `[~]` items, do the code-level lookup first and produce a one-paragraph adopt/skip recommendation.
4. Apply changes in small focused commits — one change per commit, easy to revert.
