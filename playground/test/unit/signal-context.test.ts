import { describe, it, expect, beforeEach } from 'vitest'
import { pageContext } from '@incubrain/foundry/modules/events/runtime/utils/signal'

const visit = (url: string) => window.history.replaceState({}, '', url)

describe('pageContext: polaris_review binding', () => {
  beforeEach(() => visit('/'))

  it('stamps review as its own top-level field', () => {
    visit('/pricing?polaris_review=rev_abc123')

    expect(pageContext().review).toBe('rev_abc123')
  })

  it('never squats the review tag into utm', () => {
    visit('/pricing?polaris_review=rev_abc123&utm_source=x')

    const context = pageContext()

    expect(context.utm).toEqual({ utm_source: 'x' })
    expect(JSON.stringify(context.utm)).not.toContain('rev_abc123')
  })

  it('leaves review unset when the param is absent', () => {
    visit('/pricing?utm_source=newsletter')

    expect(pageContext().review).toBeUndefined()
  })

  it('leaves review unset when the param is empty or blank', () => {
    visit('/pricing?polaris_review=')
    expect(pageContext().review).toBeUndefined()

    visit('/pricing?polaris_review=%20%20')
    expect(pageContext().review).toBeUndefined()
  })

  it('does not carry the tag to the next page (no persistence)', () => {
    visit('/?polaris_review=rev_abc123')
    expect(pageContext().review).toBe('rev_abc123')

    visit('/pricing')
    expect(pageContext().review).toBeUndefined()

    // Nothing was written anywhere that a later page could read back.
    expect(JSON.stringify(localStorage)).not.toContain('rev_abc123')
    expect(document.cookie).not.toContain('rev_abc123')
  })

  it('truncates an oversized tag to 128 chars', () => {
    visit(`/?polaris_review=${'r'.repeat(300)}`)

    expect(pageContext().review).toHaveLength(128)
  })

  it('still reports page and referrer alongside the tag', () => {
    visit('/deep/page?polaris_review=rev_1')

    expect(pageContext().page).toBe('/deep/page')
  })
})
