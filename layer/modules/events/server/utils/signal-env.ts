/**
 * Local/debug marker stamped on every signal row (`SignalRow.env`) so a local
 * Polaris instance pulling rows from a developer's machine can permanently
 * tell them apart from production traffic.
 *
 * Pure and exported so the precedence rule is unit-testable without booting
 * Nitro. The only call site is `resolveEnvMarker()` in `signal-buffer.ts`,
 * which feeds it `import.meta.dev` and `runtimeConfig.public.signalEnv`.
 *
 * **Precedence — explicit config always wins over the dev-mode default:**
 * 1. `configuredEnv === 'production'` → always suppressed, even under
 *    `import.meta.dev`. The escape hatch for a dev-mode server whose rows
 *    should NOT be tagged.
 * 2. `configuredEnv === 'local'` → always stamped, even when `isDev` is
 *    false. Lets a locally-BUILT (non-dev, e.g. `nuxt build` + `node
 *    .output/server/index.mjs`) server mark itself via
 *    `NUXT_PUBLIC_SIGNAL_ENV=local`, since `import.meta.dev` is `false` there.
 * 3. Anything else (unset, empty, or an unrecognised value) falls back to the
 *    dev-mode default: `isDev` → `'local'`, else `undefined`.
 */
export interface ResolveSignalEnvInput {
  isDev: boolean
  configuredEnv?: string
}

export function resolveSignalEnv({ isDev, configuredEnv }: ResolveSignalEnvInput): 'local' | undefined {
  if (configuredEnv === 'production') return undefined
  if (configuredEnv === 'local') return 'local'
  return isDev ? 'local' : undefined
}
