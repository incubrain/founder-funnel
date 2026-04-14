#!/usr/bin/env node
// scripts/build-diagnostic.mjs
// Wraps `nuxt build` and writes structured JSONL diagnostics to logs/
// Usage: node scripts/build-diagnostic.mjs <app-dir>

import { spawn } from 'node:child_process'
import { appendFile, mkdir } from 'node:fs/promises'
import { resolve, basename } from 'node:path'

const appDir = process.argv[2]
if (!appDir) {
  console.error('Usage: node scripts/build-diagnostic.mjs <app-dir>')
  process.exit(1)
}

const appName = basename(appDir)
const logsDir = resolve(process.cwd(), 'logs')
const logFile = resolve(logsDir, `build-${appName}.jsonl`)
const startTime = Date.now()

await mkdir(logsDir, { recursive: true })

/** Write a single JSONL entry */
async function log(type, data) {
  const entry = {
    ts: new Date().toISOString(),
    app: appName,
    type,
    ...data,
  }
  await appendFile(logFile, JSON.stringify(entry) + '\n')
}

await log('build_start', { appDir })

const stdout = []
const stderr = []

const child = spawn('npx', ['nuxt', 'build', appDir], {
  env: {
    ...process.env,
    NODE_ENV: 'production',
    NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=3072',
  },
  stdio: ['inherit', 'pipe', 'pipe'],
})

child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk)
  stdout.push(chunk.toString())
})

child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk)
  stderr.push(chunk.toString())
})

child.on('close', async (code) => {
  const durationMs = Date.now() - startTime
  const allOutput = [...stdout, ...stderr].join('')
  const lines = allOutput.split('\n')

  // Nuxt/consola logs multi-line blocks: " ERROR \n actual message \n\n"
  // Split on double-newline to get logical blocks, then classify each block
  const blocks = allOutput
    .split(/\n{2,}/)
    .map(b => b.trim())
    .filter(Boolean)

  const errors = []
  const warnings = []
  for (const block of blocks) {
    if (/\bERROR\b/.test(block) && !block.includes('failOnError')) {
      errors.push(block.replace(/\s+/g, ' ').slice(0, 500))
    }
    else if (/\bWARN\b/.test(block) && block.length > 6) {
      warnings.push(block.replace(/\s+/g, ' ').slice(0, 500))
    }
  }

  for (const msg of errors.slice(0, 30)) {
    await log('error', { message: msg })
  }
  for (const msg of warnings.slice(0, 30)) {
    await log('warning', { message: msg })
  }

  // Final summary entry
  await log('build_end', {
    exitCode: code,
    success: code === 0,
    durationMs,
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    tailOutput: lines.slice(-80).join('\n'),
  })

  console.log(`\n📋 Diagnostic log: ${logFile}`)
  process.exit(code)
})
