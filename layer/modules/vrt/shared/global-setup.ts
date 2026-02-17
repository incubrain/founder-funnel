import { exec, execFile, type ChildProcess } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

async function waitForServer(url: string, timeout = 60_000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    }
    catch {
      // Server not ready yet
    }
    await sleep(1000)
  }
  throw new Error(`Server at ${url} did not start within ${timeout}ms`)
}

export function createGlobalSetup(options: {
  port?: number
  rootDir?: string
  command?: string
} = {}) {
  const { port = 3000, rootDir = '.', command } = options
  const url = `http://localhost:${port}`
  let server: ChildProcess | null = null

  return {
    async setup() {
      // Check if server is already running
      try {
        const res = await fetch(url)
        if (res.ok) {
          console.log(`[VRT] Dev server already running at ${url}`)
          return
        }
      }
      catch {
        // Not running, start it
      }

      if (command) {
        console.log(`[VRT] Starting dev server: ${command}`)
        server = exec(command, { cwd: rootDir })
      }
      else {
        const args = ['nuxt', 'dev', '--port', String(port)]
        console.log(`[VRT] Starting dev server: npx ${args.join(' ')}`)
        server = execFile('npx', args, { cwd: rootDir })
      }

      server.stdout?.on('data', (data: string) => {
        if (process.env.VRT_DEBUG) console.log(`[VRT Server] ${data}`)
      })
      server.stderr?.on('data', (data: string) => {
        if (process.env.VRT_DEBUG) console.error(`[VRT Server] ${data}`)
      })

      await waitForServer(url)
      console.log(`[VRT] Dev server ready at ${url}`)
    },

    async teardown() {
      if (server) {
        console.log('[VRT] Stopping dev server')
        server.kill('SIGTERM')
        server = null
      }
    },
  }
}
