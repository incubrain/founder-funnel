import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export interface VrtConfigOptions {
  /** Root directory for the vitest project (use import.meta.dirname) */
  root?: string
  /** Port the Nuxt dev server runs on (default: 3000) */
  port?: number
  /** Base URL override (defaults to http://localhost:{port}) */
  baseUrl?: string
  /** Pixelmatch threshold 0-1 (default: 0.2) */
  threshold?: number
  /** Allowed mismatched pixel ratio 0-1 (default: 0.01) */
  maxDiffRatio?: number
  /** Test include patterns */
  include?: string[]
}

export function createVrtConfig(options: VrtConfigOptions = {}) {
  const {
    root,
    port = 3000,
    baseUrl,
    threshold = 0.2,
    maxDiffRatio = 0.01,
    include = ['test/vrt/**/*.{test,spec}.ts'],
  } = options

  const resolvedBaseUrl = baseUrl || `http://localhost:${port}`

  return defineConfig({
    test: {
      name: 'vrt',
      ...(root ? { root } : {}),
      include,
      globals: true,
      testTimeout: 60_000,
      browser: {
        enabled: true,
        provider: playwright(),
        headless: true,
        instances: [{ browser: 'chromium' }],
        viewport: { width: 1280, height: 720 },
        commands: {
          /**
           * Opens a new Playwright page, navigates to `url`, finds elements matching
           * a testId prefix, screenshots each one, saves PNGs to `screenshotDir`.
           * When `testIds` is provided, only those are screenshotted.
           * When `discoverPrefix` is provided, discovers matching testIds first.
           * Returns { testIds: string[], screenshots: Record<testId, filePath> }
           */
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Playwright context is provider-specific
          async screenshotPage(
            ctx: any,
            url: string,
            screenshotDir: string,
            opts: { testIds?: string[], discoverPrefix?: string },
          ) {
            const { mkdirSync, existsSync } = await import('node:fs')
            const { resolve } = await import('node:path')
            const context = ctx.context
            const newPage = await context.newPage()
            try {
              await newPage.setViewportSize({ width: 1280, height: 720 })
              await newPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
              // Wait for Nuxt to hydrate, handle client-side redirects, and stabilize
              await newPage.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
              await newPage.waitForSelector('[data-testid]', { timeout: 15_000 }).catch(() => {})
              await newPage.waitForTimeout(2000)

              // Determine which testIds to screenshot
              let ids: string[] = opts.testIds || []
              if (opts.discoverPrefix) {
                const elements = newPage.locator(`[data-testid^="${opts.discoverPrefix}"]`)
                const count = await elements.count()
                ids = []
                for (let i = 0; i < count; i++) {
                  const id = await elements.nth(i).getAttribute('data-testid')
                  if (id) ids.push(id)
                }
              }

              // Screenshot each element
              const dir = resolve(screenshotDir)
              if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

              const screenshots: Record<string, string> = {}
              for (const testId of ids) {
                const el = newPage.locator(`[data-testid="${testId}"]`)
                if ((await el.count()) > 0 && (await el.first().isVisible())) {
                  const filePath = resolve(dir, `${testId}.png`)
                  try {
                    await el.first().screenshot({ path: filePath, timeout: 10_000 })
                    screenshots[testId] = filePath
                  }
                  catch {
                    // Element may have detached during re-render, wait and retry once
                    await newPage.waitForTimeout(2000)
                    const retry = newPage.locator(`[data-testid="${testId}"]`)
                    if ((await retry.count()) > 0 && (await retry.first().isVisible())) {
                      await retry.first().screenshot({ path: filePath, timeout: 10_000 })
                      screenshots[testId] = filePath
                    }
                  }
                }
              }

              return { testIds: ids, screenshots }
            }
            finally {
              await newPage.close()
            }
          },

          /**
           * Compares current screenshots against baselines using pixelmatch.
           * If `update` is true, copies current as new baselines (no comparison).
           * Returns { passed: boolean, results: Record<testId, { match, diffRatio, diffPath? }> }
           */
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async compareScreenshots(
            _ctx: any,
            currentDir: string,
            baselineDir: string,
            opts: { threshold?: number, maxDiffRatio?: number, update?: boolean },
          ) {
            const fs = await import('node:fs')
            const path = await import('node:path')
            const { PNG } = await import('pngjs')
            const pixelmatch = (await import('pixelmatch')).default

            const { threshold: pmThreshold = 0.2, maxDiffRatio: maxRatio = 0.01, update = false } = opts

            if (!fs.existsSync(currentDir)) {
              return { passed: false, results: {}, error: `Current directory not found: ${currentDir}` }
            }

            if (!fs.existsSync(baselineDir)) {
              fs.mkdirSync(baselineDir, { recursive: true })
            }

            const files = fs.readdirSync(currentDir).filter((f: string) => f.endsWith('.png'))
            const results: Record<string, { match: boolean, diffRatio: number, diffPath?: string }> = {}
            let allPassed = true

            for (const file of files) {
              const testId = file.replace('.png', '')
              const currentPath = path.resolve(currentDir, file)
              const baselinePath = path.resolve(baselineDir, file)

              if (update) {
                fs.copyFileSync(currentPath, baselinePath)
                results[testId] = { match: true, diffRatio: 0 }
                continue
              }

              if (!fs.existsSync(baselinePath)) {
                // No baseline yet — auto-create it
                fs.copyFileSync(currentPath, baselinePath)
                results[testId] = { match: true, diffRatio: 0 }
                continue
              }

              const currentImg = PNG.sync.read(fs.readFileSync(currentPath))
              const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath))

              const { width, height } = currentImg
              if (baselineImg.width !== width || baselineImg.height !== height) {
                results[testId] = { match: false, diffRatio: 1 }
                allPassed = false
                continue
              }

              const diffImg = new PNG({ width, height })
              const numDiff = pixelmatch(
                currentImg.data,
                baselineImg.data,
                diffImg.data,
                width,
                height,
                { threshold: pmThreshold },
              )

              const diffRatio = numDiff / (width * height)
              const match = diffRatio <= maxRatio

              if (!match) {
                const diffDir = path.resolve(baselineDir, '__diff__')
                if (!fs.existsSync(diffDir)) fs.mkdirSync(diffDir, { recursive: true })
                const diffPath = path.resolve(diffDir, file)
                fs.writeFileSync(diffPath, PNG.sync.write(diffImg))
                results[testId] = { match: false, diffRatio, diffPath }
                allPassed = false
              }
              else {
                results[testId] = { match: true, diffRatio }
              }
            }

            return { passed: allPassed, results }
          },
        },
      },
      globalSetup: ['test/vrt/global-setup.ts'],
    },
    define: {
      __VRT_BASE_URL__: JSON.stringify(resolvedBaseUrl),
      __VRT_THRESHOLD__: JSON.stringify(threshold),
      __VRT_MAX_DIFF_RATIO__: JSON.stringify(maxDiffRatio),
      __VRT_UPDATE__: JSON.stringify(!!process.env.VRT_UPDATE),
    },
  })
}
