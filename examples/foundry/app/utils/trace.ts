export interface TraceEvent {
  /** 0–1 position along the drum */
  at: number
  label: string
  date?: string
  /** spike amplitude 0–1 */
  amp?: number
}

/**
 * Deterministic seismogram path: a nervous baseline with a spike at each event.
 * Pure + seeded so SSR and client render the identical trace (no hydration drift).
 */
export function buildTracePath(
  events: TraceEvent[],
  width = 1600,
  height = 320,
  seed = 7,
): string {
  const mid = height * 0.56
  const steps = 480
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  const pts: string[] = [`M 0 ${mid.toFixed(1)}`]
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * width
    const t = i / steps
    let y = mid + (rand() - 0.5) * 14
    for (const ev of events) {
      const d = Math.abs(t - ev.at)
      if (d < 0.016) {
        const k = 1 - d / 0.016
        const dir = i % 2 === 0 ? -1 : 1
        y = mid + dir * k * (ev.amp ?? 0.7) * height * 0.42
      }
    }
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}
