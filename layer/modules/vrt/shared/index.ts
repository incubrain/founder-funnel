// Node.js-safe exports (config loading, global setup)
// Browser-only helpers are in ./helpers.ts — import directly in test files
export { createVrtConfig } from './config.ts'
export type { VrtConfigOptions } from './config.ts'
export { createGlobalSetup } from './global-setup.ts'
