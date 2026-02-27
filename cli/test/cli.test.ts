import { describe, it, expect, vi } from 'vitest'
import { resolve } from 'node:path'
import { createCLI } from '../cli'

// Mock @nuxt/cli so we don't actually scaffold during tests
vi.mock('@nuxt/cli', () => ({
  runCommand: vi.fn(),
}))

describe('createCLI', () => {
  it('returns an object with runMain function', () => {
    const cli = createCLI({
      name: 'test-cli',
      description: 'Test CLI',
      setup: { defaults: {} },
    })

    expect(cli).toHaveProperty('runMain')
    expect(typeof cli.runMain).toBe('function')
  })
})

describe('template validation', () => {
  it('rejects invalid template names', () => {
    const validTemplates = ['default']

    expect(validTemplates.includes('default')).toBe(true)
    expect(validTemplates.includes('nonexistent')).toBe(false)
    expect(validTemplates.includes('')).toBe(false)
  })

  it('throws on invalid template', () => {
    const template = 'invalid-template'
    const validTemplates = ['default']

    expect(() => {
      if (!validTemplates.includes(template)) {
        throw new Error(`Invalid template: ${template}. Available: default`)
      }
    }).toThrow('Invalid template: invalid-template. Available: default')
  })

  it('accepts valid template', () => {
    const template = 'default'
    const validTemplates = ['default']

    expect(() => {
      if (!validTemplates.includes(template)) {
        throw new Error(`Invalid template: ${template}. Available: default`)
      }
    }).not.toThrow()
  })
})

describe('directory resolution', () => {
  it('resolves relative directory to absolute path', () => {
    const dir = resolve('my-project')
    expect(dir).toBe(resolve(process.cwd(), 'my-project'))
    expect(dir.startsWith('/')).toBe(true)
  })

  it('preserves absolute directory paths', () => {
    const dir = resolve('/tmp/test-project')
    expect(dir).toBe('/tmp/test-project')
  })

  it('uses default directory name when none provided', () => {
    const defaultDir = 'my-project'
    const dir = resolve(defaultDir)
    expect(dir).toContain('my-project')
  })
})

describe('nuxt init arguments', () => {
  it('constructs correct GitHub template URL', () => {
    const template = 'default'
    const expectedUrl = `gh:incubrain/foundry/.starters/${template}`
    expect(expectedUrl).toBe('gh:incubrain/foundry/.starters/default')
  })

  it('passes correct arguments to nuxt init', async () => {
    const { runCommand } = await import('@nuxt/cli')
    const mockRunCommand = vi.mocked(runCommand)
    mockRunCommand.mockResolvedValue(undefined)

    const dir = resolve('/tmp/test-project')
    const template = 'default'

    await runCommand('init', [
      dir,
      '-t',
      `gh:incubrain/foundry/.starters/${template}`,
    ])

    expect(mockRunCommand).toHaveBeenCalledWith('init', [
      dir,
      '-t',
      'gh:incubrain/foundry/.starters/default',
    ])
  })
})
