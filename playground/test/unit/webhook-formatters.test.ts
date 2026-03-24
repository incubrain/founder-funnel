import { describe, it, expect } from 'vitest'
import { formatDiscordMessage } from '@incubrain/foundry/modules/events/server/formatters/discord'
import { formatSlackMessage } from '@incubrain/foundry/modules/events/server/formatters/slack'
import { formatTelegramMessage } from '@incubrain/foundry/modules/events/server/formatters/telegram'
import type { SpamFlags } from '@incubrain/foundry/modules/events/server/utils/anti-spam'

const cleanFlags: SpamFlags = { honeypot: false, fast: false, noJs: false, score: 0 }
const riskyFlags: SpamFlags = { honeypot: false, fast: true, noJs: true, score: 70 }
const spamFlags: SpamFlags = { honeypot: true, fast: true, noJs: true, score: 100 }

const formData = { email: 'test@example.com', name: 'Jane', formId: 'hero-signup' }

describe('formatDiscordMessage', () => {
  it('should produce embed with green color for clean submission', () => {
    const msg = formatDiscordMessage({ formData, flags: cleanFlags })
    expect(msg.embeds[0].color).toBe(0x00FF00)
    expect(msg.content).toContain('✅')
  })

  it('should produce yellow for medium risk', () => {
    const msg = formatDiscordMessage({ formData, flags: { ...cleanFlags, score: 30 } })
    expect(msg.embeds[0].color).toBe(0xFFD93D)
    expect(msg.content).toContain('⚡')
  })

  it('should produce red for high risk', () => {
    const msg = formatDiscordMessage({ formData, flags: riskyFlags })
    expect(msg.embeds[0].color).toBe(0xFF6B6B)
    expect(msg.content).toContain('⚠️')
  })

  it('should include email field', () => {
    const msg = formatDiscordMessage({ formData, flags: cleanFlags })
    const fields = msg.embeds[0].fields
    expect(fields.some((f: Record<string, unknown>) => f.name === '📧 Email')).toBe(true)
  })

  it('should include extra form fields', () => {
    const msg = formatDiscordMessage({ formData, flags: cleanFlags })
    const fields = msg.embeds[0].fields
    expect(fields.some((f: Record<string, unknown>) => f.name === 'Name')).toBe(true)
  })
})

describe('formatSlackMessage', () => {
  it('should produce blocks array', () => {
    const msg = formatSlackMessage({ formData, flags: cleanFlags })
    expect(msg.blocks).toBeInstanceOf(Array)
    expect(msg.blocks.length).toBeGreaterThan(0)
  })

  it('should include risk indicator in text', () => {
    const msg = formatSlackMessage({ formData, flags: cleanFlags })
    expect(msg.text).toContain('✅')
    expect(msg.text).toContain('test@example.com')
  })

  it('should include fields section', () => {
    const msg = formatSlackMessage({ formData, flags: cleanFlags })
    const fieldBlock = msg.blocks.find((b: Record<string, unknown>) => b.type === 'section' && b.fields)
    expect(fieldBlock).toBeDefined()
  })

  it('should include context with form ID and risk', () => {
    const msg = formatSlackMessage({ formData, flags: riskyFlags })
    const ctx = msg.blocks.find((b: Record<string, unknown>) => b.type === 'context')
    expect(ctx).toBeDefined()
  })
})

describe('formatTelegramMessage', () => {
  it('should include chat_id', () => {
    const msg = formatTelegramMessage({ formData, flags: cleanFlags }, '12345')
    expect(msg.chat_id).toBe('12345')
  })

  it('should include email in text', () => {
    const msg = formatTelegramMessage({ formData, flags: cleanFlags }, '12345')
    expect(msg.text).toContain('test@example.com')
  })

  it('should show risk details for risky submissions', () => {
    const msg = formatTelegramMessage({ formData, flags: riskyFlags }, '12345')
    expect(msg.text).toContain('Risk Score: 70/100')
    expect(msg.text).toContain('Fast submission')
    expect(msg.text).toContain('No JavaScript')
  })

  it('should not show risk section for clean submissions', () => {
    const msg = formatTelegramMessage({ formData, flags: cleanFlags }, '12345')
    expect(msg.text).not.toContain('Risk Score')
  })

  it('should throw when chatId is missing', () => {
    expect(() => formatTelegramMessage({ formData, flags: cleanFlags })).toThrow()
  })
})
