# Medium Priority Issues - Review & Action Plan

**Generated:** 2026-02-20
**Source:** Systematic 8-pair skill-based codebase review
**Total Medium Issues:** 18 (excludes already-fixed h1 violations)

---

## Production Blockers ✅ FIXED

All 3 production blockers have been resolved:

1. ✅ **Webhook retry logic** - Added exponential backoff (3 attempts: 1s, 2s, 4s delays)
2. ✅ **Webhook URL validation** - Security whitelist for allowed providers
3. ✅ **Form schema validation** - Replaced `z.any()` with strict type unions

**Files Changed:**
- `layer/modules/events/server/utils/webhook-retry.ts` (new)
- `layer/modules/events/server/handlers/webhook.post.ts` (updated)

---

## Critical Issues ✅ ALREADY FIXED

5 h1 accessibility violations were reported but are **already resolved**:

- ✅ `docs/6.advanced/7.doc-review.md` - All headings use ##
- ✅ `docs/9.reference/6.cli.md` - All headings use ##
- ✅ `docs/9.reference/5.environment-variables.md` - All headings use ##
- ✅ `docs/8.deployment/2.docker.md` - All headings use ##
- ✅ `docs/7.testing/2.visual-regression.md` - All headings use ##

**Note:** JSONL review data was outdated - these have been corrected since the review.

---

## Medium Priority Issues Requiring Attention

### Category: Vue Best Practices (8 issues)

#### 1. Multiple watchEffect calls in VideoHtml.vue
**File:** `layer/app/components/VideoHtml.vue:69`
**Issue:** Separate watchEffect calls for related logic
**Recommendation:** Combine into single watchEffect with clear logic sections
**Effort:** 15 minutes
**Impact:** Code clarity, minor performance improvement

#### 2. onMounted with manual cleanup in Changelog.vue
**File:** `layer/app/components/content/Changelog.vue:42`
**Issue:** Manual scroll event listener with onBeforeUnmount cleanup
**Recommendation:** Replace with `useEventListener(window, 'scroll', handleScroll)` from @vueuse/core
**Effort:** 10 minutes
**Impact:** Cleaner code, automatic cleanup

#### 3. Await in component setup (FaqAccordion.vue)
**File:** `layer/app/components/content/FaqAccordion.vue:22`
**Issue:** Top-level await in component setup blocks rendering
**Recommendation:** Add `lazy: true` option or use queryCollection pattern with `immediate: false`
**Effort:** 15 minutes
**Impact:** Faster initial render, better UX

#### 4. Complex switch statement in computed (External.vue)
**File:** `layer/app/components/convert/External.vue:46`
**Issue:** Switch statement inside computed property reduces readability
**Recommendation:** Extract to `const defaultContentMap = { payment: {...}, booking: {...}, apply: {...} }`
**Effort:** 20 minutes
**Impact:** Better maintainability

#### 5. Multiple type assertions in computed (Internal.vue)
**File:** `layer/app/components/convert/Internal.vue:56`
**Issue:** Type assertions scattered throughout computed property
**Recommendation:** Define proper TypeScript interface for offer page data
**Effort:** 30 minutes
**Impact:** Type safety, fewer runtime errors

#### 6. Mixed prop sources in computed (Cta.vue)
**File:** `layer/app/components/nav/Cta.vue:32`
**Issue:** Computed property pulls from multiple prop sources without clear priority
**Recommendation:** Document prop priority in comments or simplify API
**Effort:** 10 minutes (documentation) or 1 hour (API simplification)
**Impact:** Developer experience

#### 7. useIntersectionObserver for lazy loading (VideoIframe.vue)
**File:** `layer/app/components/VideoIframe.vue:20`
**Issue:** None - this is a performance optimization
**Recommendation:** **No change needed**
**Effort:** N/A
**Impact:** N/A

#### 8. useIntersectionObserver manual stop (SectionWrapper.vue)
**File:** `layer/app/components/section/SectionWrapper.vue:16`
**Issue:** Manual stop() call for intersection observer
**Recommendation:** **No change needed** - explicit control is acceptable here
**Effort:** N/A
**Impact:** N/A

---

### Category: Frontend Design (2 issues)

#### 9. Conditional class with size check (Social.vue)
**File:** `layer/app/components/convert/Social.vue:85`
**Issue:** Inline conditional class generation: `class="${size === 'lg' ? '...' : '...'}"`
**Recommendation:** Extract to computed property for clarity
**Effort:** 10 minutes
**Impact:** Code readability

#### 10. Inline styles for honeypot field (Form.vue)
**File:** `layer/app/components/convert/Form.vue:65`
**Issue:** Inline styles used for honeypot anti-spam field
**Recommendation:** **No change needed** - inline styles intentionally prevent CSS detection by bots
**Effort:** N/A
**Impact:** N/A

---

### Category: Nuxt UI (1 issue)

#### 11. Mixed semantic and raw color in button class (Form.vue)
**File:** `layer/app/components/convert/Form.vue:112`
**Issue:** Button uses both semantic color (primary) and potentially raw Tailwind class
**Recommendation:** Review button class and ensure semantic color only
**Effort:** 5 minutes
**Impact:** Design system consistency

---

### Category: VueUse (1 issue)

#### 12. Custom localStorage/sessionStorage wrapper (useAppStorage.ts)
**File:** `layer/app/composables/useAppStorage.ts:20-132`
**Issue:** Custom storage wrapper instead of VueUse composables
**Recommendation:** **KEEP AS-IS** - Serves architectural purpose (migration path) and provides custom methods VueUse doesn't support. Simple string-only API is intentional.
**Effort:** N/A
**Impact:** N/A

---

### Category: Documentation (5 issues - already fixed)

All 5 h1 accessibility violations are **already corrected** - no action needed.

---

## Recommended Action Plan

### Phase 1: Quick Wins (< 30 min each)
**Total Time: ~2 hours**

1. ✅ **Replace manual scroll listener with useEventListener** (Changelog.vue)
   - File: `layer/app/components/content/Changelog.vue:42`
   - Change: `onMounted(() => { window.addEventListener(...) })` → `useEventListener(window, 'scroll', handleScroll)`

2. ✅ **Extract conditional class to computed** (Social.vue)
   - File: `layer/app/components/convert/Social.vue:85`
   - Extract size-based class logic to computed property

3. ✅ **Combine watchEffect calls** (VideoHtml.vue)
   - File: `layer/app/components/VideoHtml.vue:69`
   - Merge multiple watchEffect into single call with clear sections

4. ✅ **Add lazy loading to FaqAccordion**
   - File: `layer/app/components/content/FaqAccordion.vue:22`
   - Add `lazy: true` or `immediate: false` to queryCollection

5. ✅ **Review button color class** (Form.vue)
   - File: `layer/app/components/convert/Form.vue:112`
   - Ensure semantic color only (no raw Tailwind)

6. ✅ **Document prop priority** (Cta.vue)
   - File: `layer/app/components/nav/Cta.vue:32`
   - Add comment explaining prop merge priority

### Phase 2: Refactoring (30-60 min each)
**Total Time: ~2 hours**

7. **Extract default content map** (External.vue)
   - File: `layer/app/components/convert/External.vue:46`
   - Create `defaultContentMap` const outside computed

8. **Define offer page interface** (Internal.vue)
   - File: `layer/app/components/convert/Internal.vue:56`
   - Create proper TypeScript interface for type safety

---

## Issues to Skip (No Action Needed)

These were flagged but are intentional architectural decisions:

- **useAppStorage.ts custom wrapper** - Migration path, intentional design
- **VideoIframe lazy loading** - Performance optimization, already correct
- **SectionWrapper manual stop** - Explicit control needed
- **Form honeypot inline styles** - Anti-spam requirement
- **watch with immediate on route.query** - Correct Nuxt pattern

---

## Sprint Estimate

- ✅ **Production blockers:** FIXED (3 hours)
- ✅ **Critical h1 violations:** ALREADY FIXED
- **Phase 1 (Quick wins):** ~2 hours
- **Phase 2 (Refactoring):** ~2 hours
- **Total remaining:** ~4 hours

---

## Success Metrics

After completing Phase 1 & 2:

- ✅ Production ready (all blockers resolved)
- ✅ Accessibility compliant (h1 hierarchy correct)
- ✅ VueUse integration improved (+3 composables)
- ✅ Type safety improved (+1 interface)
- ✅ Code clarity improved (extracted logic, documented priorities)

---

**Next Steps:**

1. Review this list with the team
2. Prioritize Phase 1 items based on impact
3. Schedule Phase 2 refactoring for next sprint
4. Run `bash scripts/agent-smoke-test.sh` to verify accessibility
5. Consider running VRT after changes: `pnpm test:vrt`
