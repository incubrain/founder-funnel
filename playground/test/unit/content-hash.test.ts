import { describe, it, expect } from 'vitest'
import { computeContentHash } from '@incubrain/foundry/server/utils/content-hash'

describe('computeContentHash', () => {
  it('should return consistent SHA-256 for same input', () => {
    const hash1 = computeContentHash('hello world')
    const hash2 = computeContentHash('hello world')
    expect(hash1).toBe(hash2)
  })

  it('should return 64-char hex string', () => {
    const hash = computeContentHash('test')
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should produce different hashes for different inputs', () => {
    const hash1 = computeContentHash('content A')
    const hash2 = computeContentHash('content B')
    expect(hash1).not.toBe(hash2)
  })

  it('should handle empty string', () => {
    const hash = computeContentHash('')
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should handle unicode content', () => {
    const hash = computeContentHash('日本語テスト 🚀')
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should detect single-character changes', () => {
    const hash1 = computeContentHash('# My Decision\n\nThis is version 1.')
    const hash2 = computeContentHash('# My Decision\n\nThis is version 2.')
    expect(hash1).not.toBe(hash2)
  })
})
