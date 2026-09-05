import { describe, it, expect } from 'vitest'
import { buildAiRobotsGroups } from '@incubrain/foundry/modules/ai-robots'
import {
  AI_AGENT_PURPOSE_GROUPS,
  AI_ANSWER_AGENTS,
  AI_SEARCH_AGENTS,
  AI_TRAINING_CRAWLERS,
  AI_USER_FETCHERS,
} from '@incubrain/foundry/shared/ai-agents'
import {
  classifyVisitor,
  describeVisitor,
} from '@incubrain/foundry/modules/events/server/utils/visitor-class'

describe('AI user-agent taxonomy', () => {
  it('keeps answer engines and training crawlers disjoint', () => {
    const overlap = AI_ANSWER_AGENTS.filter(ua =>
      (AI_TRAINING_CRAWLERS as readonly string[]).includes(ua),
    )

    expect(overlap).toEqual([])
  })

  it('covers the agents the policy is written around', () => {
    expect(AI_SEARCH_AGENTS).toContain('OAI-SearchBot')
    expect(AI_SEARCH_AGENTS).toContain('Claude-SearchBot')
    expect(AI_SEARCH_AGENTS).toContain('PerplexityBot')
    expect(AI_USER_FETCHERS).toContain('ChatGPT-User')
    expect(AI_USER_FETCHERS).toContain('Claude-User')
    expect(AI_TRAINING_CRAWLERS).toContain('GPTBot')
    expect(AI_TRAINING_CRAWLERS).toContain('Google-Extended')
    expect(AI_TRAINING_CRAWLERS).toContain('CCBot')
    expect(AI_TRAINING_CRAWLERS).toContain('Meta-ExternalAgent')
  })

  it('is the same list the visitor classifier uses', () => {
    for (const ua of [...AI_ANSWER_AGENTS, ...AI_TRAINING_CRAWLERS]) {
      expect(classifyVisitor(`Mozilla/5.0 (compatible; ${ua}/1.0)`)).toBe('agent')
    }
  })

  it('is the same grouping the sub-classifier reports', () => {
    // Every published token resolves to its own group's purpose — the taxonomy
    // is the single source of truth for `visitor.subclass`, not a parallel list.
    for (const { purpose, tokens } of AI_AGENT_PURPOSE_GROUPS) {
      for (const token of tokens) {
        expect(describeVisitor(`Mozilla/5.0 (compatible; ${token}/1.0)`), token)
          .toEqual({ class: 'agent', subclass: purpose })
      }
    }
  })

  it('assigns every published token exactly one purpose', () => {
    const seen = new Map<string, string>()

    for (const { purpose, tokens } of AI_AGENT_PURPOSE_GROUPS) {
      for (const token of tokens) {
        expect(seen.has(token.toLowerCase()), `${token} appears in two groups`).toBe(false)
        seen.set(token.toLowerCase(), purpose)
      }
    }
  })
})

describe('buildAiRobotsGroups', () => {
  it('allows every answer engine by default', () => {
    const [answers] = buildAiRobotsGroups()

    expect(answers!.userAgent).toEqual([...AI_ANSWER_AGENTS])
    expect(answers!.allow).toEqual(['/'])
    expect(answers!.disallow).toEqual([])
  })

  it('allows training crawlers by default', () => {
    const [, training] = buildAiRobotsGroups()

    expect(training!.userAgent).toEqual([...AI_TRAINING_CRAWLERS])
    expect(training!.allow).toEqual(['/'])
  })

  it('blocks training crawlers when the site opts out', () => {
    const [answers, training] = buildAiRobotsGroups({ training: 'disallow' })

    expect(training!.disallow).toEqual(['/'])
    expect(training!.allow).toBeUndefined()
    // Answer engines stay allowed — opting out of training is not opting out
    // of AI-answer visibility.
    expect(answers!.allow).toEqual(['/'])
  })

  it('applies extra disallowed paths to answer engines too', () => {
    const [answers] = buildAiRobotsGroups({ disallow: ['/internal/'] })

    expect(answers!.allow).toEqual(['/'])
    expect(answers!.disallow).toEqual(['/internal/'])
  })
})
