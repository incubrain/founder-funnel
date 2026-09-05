import { describe, it, expect } from 'vitest'
import {
  classifyVisitor,
  describeVisitor,
} from '@incubrain/foundry/modules/events/server/utils/visitor-class'

describe('classifyVisitor', () => {
  it('classifies a desktop browser as human', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      + '(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

    expect(classifyVisitor(ua)).toBe('human')
  })

  it('classifies Googlebot as a classic bot', () => {
    const ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

    expect(classifyVisitor(ua)).toBe('bot')
  })

  it('classifies GPTBot as an agent', () => {
    const ua = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2'

    expect(classifyVisitor(ua)).toBe('agent')
  })

  it('classifies ClaudeBot as an agent', () => {
    const ua = 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)'

    expect(classifyVisitor(ua)).toBe('agent')
  })

  it('classifies PerplexityBot as an agent', () => {
    const ua = 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/bot)'

    expect(classifyVisitor(ua)).toBe('agent')
  })

  it('classifies a headless browser as an agent', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      + '(KHTML, like Gecko) HeadlessChrome/128.0.0.0 Safari/537.36'

    expect(classifyVisitor(ua)).toBe('agent')
  })

  it('classifies a missing User-Agent as a bot', () => {
    expect(classifyVisitor(undefined)).toBe('bot')
    expect(classifyVisitor(null)).toBe('bot')
    expect(classifyVisitor('')).toBe('bot')
    expect(classifyVisitor('   ')).toBe('bot')
  })

  it('prefers agent over bot when a UA matches both patterns', () => {
    // Hypothetical UA carrying both a classic crawler keyword and an
    // AI-associated string — agent must win per the classification order.
    const ua = 'Mozilla/5.0 (compatible; GPTBot-crawler/1.0)'

    expect(classifyVisitor(ua)).toBe('agent')
  })

  it('classifies the 2026 crawler additions as agents', () => {
    const uas = [
      'Mozilla/5.0 (compatible; Meta-ExternalAgent/1.1; +https://developers.facebook.com/docs/sharing/webmasters/crawler)',
      'Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)',
      'Mozilla/5.0 (compatible; Claude-SearchBot/1.0; +https://www.anthropic.com)',
      'Mozilla/5.0 (compatible; MistralAI-User/1.0)',
      'Mozilla/5.0 (compatible; Ai2Bot-Dolma/1.0)',
      'Mozilla/5.0 (compatible; Diffbot/0.1)',
      'Mozilla/5.0 (compatible; YouBot/1.0)',
      'Mozilla/5.0 (compatible; ImagesiftBot)',
    ]

    for (const ua of uas) expect(classifyVisitor(ua), ua).toBe('agent')
  })
})

describe('describeVisitor — agent sub-classes', () => {
  it('reports answer-engine crawlers as search', () => {
    expect(describeVisitor('Mozilla/5.0 (compatible; OAI-SearchBot/1.0)'))
      .toEqual({ class: 'agent', subclass: 'search' })
    expect(describeVisitor('Mozilla/5.0 (compatible; PerplexityBot/1.0)').subclass)
      .toBe('search')
  })

  it('reports the *-User family as live-user-fetch', () => {
    expect(describeVisitor('Mozilla/5.0 (compatible; ChatGPT-User/1.0)'))
      .toEqual({ class: 'agent', subclass: 'live-user-fetch' })
    expect(describeVisitor('Mozilla/5.0 (compatible; Claude-User/1.0)').subclass)
      .toBe('live-user-fetch')
    expect(describeVisitor('Mozilla/5.0 (compatible; Meta-ExternalFetcher/1.1)').subclass)
      .toBe('live-user-fetch')
  })

  it('reports corpus crawlers as training', () => {
    expect(describeVisitor('Mozilla/5.0 (compatible; GPTBot/1.2)'))
      .toEqual({ class: 'agent', subclass: 'training' })
    expect(describeVisitor('Mozilla/5.0 (compatible; ClaudeBot/1.0)').subclass)
      .toBe('training')
    expect(describeVisitor('Mozilla/5.0 (compatible; Meta-ExternalAgent/1.1)').subclass)
      .toBe('training')
  })

  it('reports headless browsers as automation', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      + '(KHTML, like Gecko) HeadlessChrome/128.0.0.0 Safari/537.36'

    expect(describeVisitor(ua)).toEqual({ class: 'agent', subclass: 'automation' })
  })

  it('separates the search and training crawlers of the same vendor', () => {
    expect(describeVisitor('Claude-SearchBot/1.0').subclass).toBe('search')
    expect(describeVisitor('ClaudeBot/1.0').subclass).toBe('training')
    expect(describeVisitor('Claude-User/1.0').subclass).toBe('live-user-fetch')
  })

  it('prefers the longer token when one contains another', () => {
    // `Ai2Bot-Dolma` contains `AI2Bot`; the specific token must win. Both are
    // training here, so assert on the class and that a subclass was resolved.
    expect(describeVisitor('Ai2Bot-Dolma/1.0'))
      .toEqual({ class: 'agent', subclass: 'training' })
  })

  it('leaves the subclass unset for an agent matched only by a vendor hint', () => {
    // `claude-web` is a loose vendor substring, not a published token — it says
    // "AI agent" but nothing about what the fetch was for.
    expect(describeVisitor('Mozilla/5.0 claude-web/1.0'))
      .toEqual({ class: 'agent', subclass: undefined })
  })

  it('never sets a subclass for humans or classic bots', () => {
    const human = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      + '(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

    expect(describeVisitor(human)).toEqual({ class: 'human' })
    expect(describeVisitor('Mozilla/5.0 (compatible; Googlebot/2.1)')).toEqual({ class: 'bot' })
    expect(describeVisitor(undefined)).toEqual({ class: 'bot' })
  })

  it('agrees with classifyVisitor on the class', () => {
    const uas = [
      'Mozilla/5.0 (compatible; GPTBot/1.2)',
      'Mozilla/5.0 (compatible; Googlebot/2.1)',
      'curl/8.4.0',
      '',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36',
    ]

    for (const ua of uas) expect(describeVisitor(ua).class, ua).toBe(classifyVisitor(ua))
  })
})
