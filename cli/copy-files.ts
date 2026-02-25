import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname, join } from 'node:path'
import type { CopyListConfig } from './types'

const GITHUB_RAW = 'https://raw.githubusercontent.com'

export async function processCopyList(projectDir: string): Promise<void> {
  const configPath = join(projectDir, 'copy-list.json')

  let raw: string
  try {
    raw = await readFile(configPath, 'utf-8')
  } catch {
    return
  }

  const config: CopyListConfig = JSON.parse(raw)
  const repo = config.repo ?? 'incubrain/foundry'
  const ref = config.ref ?? 'main'
  const { files } = config

  console.log(`\nFetching ${files.length} shared files from ${repo}@${ref}...`)

  const results = await Promise.allSettled(
    files.map(async (file) => {
      const dest = file.dest ?? file.src
      const url = `${GITHUB_RAW}/${repo}/${ref}/${file.src}`
      const destPath = resolve(projectDir, dest)

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
