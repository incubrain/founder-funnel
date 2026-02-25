import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname, join, relative } from 'node:path'
import type { CopyListConfig } from './types'

const GITHUB_RAW = 'https://raw.githubusercontent.com'
const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/
const REF_PATTERN = /^[\w./-]+$/
const PATH_PATTERN = /^[\w./-]+$/

function validateRepo(repo: string): void {
  if (!REPO_PATTERN.test(repo)) {
    throw new Error(`Invalid repo format: "${repo}" (expected "owner/name")`)
  }
}

function validateRef(ref: string): void {
  if (!REF_PATTERN.test(ref)) {
    throw new Error(`Invalid ref format: "${ref}"`)
  }
}

function validateFilePath(filePath: string): void {
  if (!PATH_PATTERN.test(filePath) || filePath.includes('..')) {
    throw new Error(`Invalid file path: "${filePath}"`)
  }
}

function safeDest(projectDir: string, dest: string): string {
  const destPath = resolve(projectDir, dest)
  const rel = relative(projectDir, destPath)
  if (rel.startsWith('..') || resolve(destPath) !== destPath) {
    throw new Error(`Path traversal blocked: "${dest}" resolves outside project`)
  }
  return destPath
}

export async function processCopyList(projectDir: string): Promise<void> {
  const configPath = join(projectDir, 'copy-list.json')

  let raw: string
  try {
    raw = await readFile(configPath, 'utf-8')
  }
  catch {
    return
  }

  const config: CopyListConfig = JSON.parse(raw)
  const repo = config.repo ?? 'incubrain/foundry'
  const ref = config.ref ?? 'main'
  const { files } = config

  validateRepo(repo)
  validateRef(ref)

  console.log(`\nFetching ${files.length} shared files from ${repo}@${ref}...`)

  const results = await Promise.allSettled(
    files.map(async (file) => {
      validateFilePath(file.src)
      const dest = file.dest ?? file.src
      validateFilePath(dest)

      const url = `${GITHUB_RAW}/${repo}/${ref}/${file.src}`
      const destPath = safeDest(projectDir, dest)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`${file.src}: ${response.status} ${response.statusText}`)
      }

      const content = await response.text()
      await mkdir(dirname(destPath), { recursive: true })
      await writeFile(destPath, content, 'utf-8')
      console.log(`  + ${dest}`)
    }),
  )

  const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')
  if (failed.length > 0) {
    console.warn(`\n${failed.length} file(s) failed to fetch:`)
    for (const f of failed) {
      console.warn(`  - ${f.reason}`)
    }
  }

  console.log(`\nDone. ${files.length - failed.length}/${files.length} shared files copied.`)
}
