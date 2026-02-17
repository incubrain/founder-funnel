declare module 'vitest/browser' {
  interface BrowserCommands {
    screenshotPage: (
      url: string,
      screenshotDir: string,
      opts: {
        testIds?: string[]
        discoverPrefix?: string
      },
    ) => Promise<{
      testIds: string[]
      screenshots: Record<string, string>
    }>

    compareScreenshots: (
      currentDir: string,
      baselineDir: string,
      opts: {
        threshold?: number
        maxDiffRatio?: number
        update?: boolean
      },
    ) => Promise<{
      passed: boolean
      results: Record<string, { match: boolean, diffRatio: number, diffPath?: string }>
      error?: string
    }>
  }
}
