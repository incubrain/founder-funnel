import { addServerHandler, createResolver, defineNuxtModule, logger } from '@nuxt/kit'
import { join, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import type { Nitro } from 'nitropack'
import { CONTENT_ASSET_BASE } from './utils/negotiation'

/**
 * Agent-friendly raw markdown, on two layers.
 *
 * 1. **Nitro (general).** A middleware serves the raw source of any content
 *    page for `<route>.md` and for `Accept: text/markdown` on the canonical
 *    URL. Works on every preset — Docker/Railway/standalone Node and dev —
 *    which is where `deploy/` actually points. This is the path that matters.
 *
 * 2. **Vercel edge (legacy).** On Vercel builds only, `config.json` gets
 *    redirect rules so `/` serves `llms.txt` for `Accept: text/markdown` and
 *    `curl/*`. Adopted from upstream docus v5.5.0 #1264. Its per-page rules
 *    are derived from `llms.txt` links whose pathname starts with `/raw/` —
 *    nuxt-llms 0.2 emits canonical page links, so in practice only the two
 *    `/` rules survive the filter. Kept for the `/` → `llms.txt` behaviour;
 *    a candidate for retirement now that (1) covers every page route.
 */

const log = logger.withTag('foundry')

export default defineNuxtModule({
  meta: {
    name: 'markdown-rewrite',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // --- 1. General Nitro path -------------------------------------------
    const contentDir = join(nuxt.options.rootDir, 'content')

    if (existsSync(contentDir)) {
      // The content DB holds a parsed AST, not the original file, so mount the
      // content directory as a server asset — bundled into `.output/server` at
      // build time, read from disk in dev.
      nuxt.options.nitro.serverAssets ||= []
      nuxt.options.nitro.serverAssets.push({
        baseName: CONTENT_ASSET_BASE,
        dir: contentDir,
      })

      addServerHandler({
        middleware: true,
        handler: resolver.resolve('./server/middleware/raw-markdown'),
      })
    }
    else {
      // Expected when the layer itself is prepared/typechecked standalone.
      log.debug(`markdown-rewrite: no content/ directory at ${contentDir}, raw markdown disabled`)
    }

    // --- 2. Vercel edge path (legacy) ------------------------------------
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

export {
  parseMarkdownRequest,
  prefersMarkdown,
  normalizeContentPath,
  contentAssetKeys,
  assetKeyToContentPath,
  CONTENT_ASSET_BASE,
  CONTENT_PAGES_DIR,
} from './utils/negotiation'
export type { MarkdownRequest, MarkdownRequestMode } from './utils/negotiation'
