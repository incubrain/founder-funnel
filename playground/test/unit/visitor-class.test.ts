import { describe, it, expect } from 'vitest'
import { classifyVisitor } from '@incubrain/foundry/modules/events/server/utils/visitor-class'

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
})
