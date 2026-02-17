import { commands } from 'vitest/browser'

// Injected at compile time by createVrtConfig via Vite's define
declare const __VRT_BASE_URL__: string
declare const __VRT_THRESHOLD__: number
declare const __VRT_MAX_DIFF_RATIO__: number
declare const __VRT_UPDATE__: boolean

export interface VrtOptions {
  /** Base URL of the running app */
  baseUrl?: string
  /** VRT route path (default: /__vrt) */
  vrtPath?: string
  /** Additional page path appended to vrtPath (e.g. /offers/mentorship) */
  pagePath?: string
  /** Directory for current screenshots (default: test/vrt/__screenshots__/__current__) */
  currentDir?: string
  /** Directory for baseline screenshots (default: test/vrt/__screenshots__) */
  baselineDir?: string
  /** Pixelmatch threshold 0-1 */
  threshold?: number
  /** Max allowed diff pixel ratio 0-1 */
  maxDiffRatio?: number
  /** Set true to update baselines instead of comparing */
  update?: boolean
}

function resolveUpdate(opts?: VrtOptions): boolean {
  if (opts?.update !== undefined) return opts.update
  return __VRT_UPDATE__
}

/**
 * Discover all section data-testids on a page, screenshot each one,
 * then compare against baselines. Returns the list of testIds found.
 */
export async function screenshotAllSections(options: VrtOptions = {}): Promise<string[]> {
  const {
    baseUrl = __VRT_BASE_URL__,
    vrtPath = '/__vrt',
    pagePath = '',
    currentDir = 'test/vrt/__screenshots__/__current__',
    baselineDir = 'test/vrt/__screenshots__',
    threshold = __VRT_THRESHOLD__,
    maxDiffRatio = __VRT_MAX_DIFF_RATIO__,
  } = options

  const url = `${baseUrl}${vrtPath}${pagePath}`
  const update = resolveUpdate(options)

  // Single page visit: discover section testIds + screenshot them
  const { testIds, screenshots } = await commands.screenshotPage(url, currentDir, {
    discoverPrefix: 'section-',
  })

  if (testIds.length === 0) {
    throw new Error(`No sections found on ${url}. Are data-testid attributes present?`)
  }

  const capturedIds = Object.keys(screenshots)
  if (capturedIds.length === 0) {
    throw new Error(`No visible sections to screenshot on ${url}`)
  }

  // Compare against baselines (or update them)
  const result = await commands.compareScreenshots(currentDir, baselineDir, {
    threshold,
    maxDiffRatio,
    update,
  })

  if (!update && !result.passed) {
    const failures = Object.entries(result.results)
      .filter(([_, r]) => !r.match)
      .map(([id, r]) => `  ${id}: ${(r.diffRatio * 100).toFixed(2)}% diff${r.diffPath ? ` → ${r.diffPath}` : ''}`)
      .join('\n')
    throw new Error(`VRT comparison failed:\n${failures}`)
  }

  return capturedIds
}

/**
 * Screenshot a single element by its data-testid and compare against baseline.
 */
export async function screenshotByTestId(
  testId: string,
  options: VrtOptions = {},
): Promise<void> {
  const {
    baseUrl = __VRT_BASE_URL__,
    vrtPath = '/__vrt',
    pagePath = '',
    currentDir = 'test/vrt/__screenshots__/__current__',
    baselineDir = 'test/vrt/__screenshots__',
    threshold = __VRT_THRESHOLD__,
    maxDiffRatio = __VRT_MAX_DIFF_RATIO__,
  } = options

  const url = `${baseUrl}${vrtPath}${pagePath}`
  const update = resolveUpdate(options)

  // Single page visit: screenshot the specific element
  const { screenshots } = await commands.screenshotPage(url, currentDir, {
    testIds: [testId],
  })

  if (!screenshots[testId]) {
    throw new Error(`Element with data-testid="${testId}" not found or not visible on ${url}`)
  }

  // Compare against baseline
  const result = await commands.compareScreenshots(currentDir, baselineDir, {
    threshold,
    maxDiffRatio,
    update,
  })

  if (!update && !result.passed) {
    const r = result.results[testId]
    if (r && !r.match) {
      throw new Error(
        `VRT mismatch for "${testId}": ${(r.diffRatio * 100).toFixed(2)}% pixels differ${r.diffPath ? ` → ${r.diffPath}` : ''}`,
      )
    }
  }
}
