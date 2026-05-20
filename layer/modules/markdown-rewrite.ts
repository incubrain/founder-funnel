import { defineNuxtModule, logger } from '@nuxt/kit'
import { resolve } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import type { Nitro } from 'nitropack'

/**
 * Vercel edge redirects for agent-friendly markdown.
 *
 * On Vercel builds, when a request to a docs page URL carries an
 * `Accept: text/markdown` header or a `curl/*` User-Agent, the edge
 * redirects it to the corresponding /raw/<path>.md file (served by
 * nuxt-llms). The same mechanism redirects `/` to `/llms.txt`.
 *
 * No-op outside Vercel (Railway/Docker/standalone Node) and in dev.
 * Adopted from upstream docus v5.5.0 #1264.
 */

const log = logger.withTag('foundry')

export default defineNuxtModule({
  meta: {
    name: 'markdown-rewrite',
  },
  setup(_options, nuxt) {
    nuxt.hooks.hook('nitro:init', (nitro: Nitro) => {
      if (nitro.options.dev || !nitro.options.preset.includes('vercel')) {
        return
      }

      nitro.hooks.hook('compiled', async () => {
        const vcJSON = resolve(nitro.options.output.dir, 'config.json')
        const vcConfig = JSON.parse(await readFile(vcJSON, 'utf8'))

        const llmsTxtPath = resolve(nitro.options.output.publicDir, 'llms.txt')
        let llmsTxt: string
        try {
          llmsTxt = await readFile(llmsTxtPath, 'utf-8')
        }
        catch {
          log.warn('llms.txt not found, skipping markdown redirect routes')
          return
        }

        const markdownHeaders = {
          'content-type': 'text/markdown; charset=utf-8',
        }

        const routes: Array<Record<string, unknown>> = [
          {
            src: '^/$',
            dest: '/llms.txt',
            headers: markdownHeaders,
            has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
          },
          {
            src: '^/$',
            dest: '/llms.txt',
            headers: markdownHeaders,
            has: [{ type: 'header', key: 'user-agent', value: 'curl/.*' }],
          },
        ]

        const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
        const matches = [...llmsTxt.matchAll(urlRegex)]

        for (const match of matches) {
          const url = match[2]
          if (!url) continue
          try {
            const urlObj = new URL(url)
            const rawPath = urlObj.pathname
            if (rawPath === '/') continue
            if (!rawPath.startsWith('/raw/')) continue

            const pagePath = rawPath.replace('/raw', '').replace(/\.md$/, '')

            routes.push(
              {
                src: `^${pagePath}$`,
                dest: rawPath,
                headers: markdownHeaders,
                has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
              },
              {
                src: `^${pagePath}$`,
                dest: rawPath,
                headers: markdownHeaders,
                has: [{ type: 'header', key: 'user-agent', value: 'curl/.*' }],
              },
            )
          }
          catch {
            // skip invalid URLs
          }
        }

        vcConfig.routes.unshift(...routes)
        await writeFile(vcJSON, JSON.stringify(vcConfig, null, 2), 'utf8')
        log.info(`markdown-rewrite: wrote ${routes.length} Vercel edge routes (text/markdown + curl)`)
      })
    })
  },
})
