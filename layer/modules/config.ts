import { defineNuxtModule, createResolver, addTypeTemplate } from '@nuxt/kit'
import { defu } from 'defu'
import { inferSiteURL, getPackageJsonMetadata } from '../shared/utils/meta'
import { readFile } from 'node:fs/promises'

export default defineNuxtModule({
  meta: {
    name: 'config',
  },
  async setup(_options, nuxt) {
    const dir = nuxt.options.rootDir
    const url = inferSiteURL()
    const meta = await getPackageJsonMetadata(dir)

    // Read layer package.json for foundry version
    const { resolve } = createResolver(import.meta.url)
    const layerPkgPath = resolve('../package.json')
    let foundryVersion = ''
    try {
      const layerPkg = JSON.parse(await readFile(layerPkgPath, 'utf-8'))
      foundryVersion = layerPkg.version || ''
    }
    catch {
      // Ignore if package.json not found
    }

    // Ship the layer's AppConfig type augmentation (`shared/types/config.d.ts`)
    // into every consumer's generated types.
    //
    // A loose `.d.ts` file under the layer's own `shared/` dir is only picked
    // up by TypeScript when the layer itself is the project root (its own
    // generated tsconfig globs `shared/**/*.d.ts` relative to its own
    // buildDir). For a consumer extending the layer via `extends`, nothing
    // walks into `node_modules/@incubrain/foundry/shared` to find it, so the
    // richer `AppConfig`/`AppConfigInput` shapes silently vanish and
    // consumers fall back to Nuxt's loose, all-optional inferred app.config
    // type (TS2339 on `content.routeMap`/`searchable`/`pagesBackLabel`,
    // `seo.titleTemplate`, etc. — product-validator-ebi.2).
    //
    // `addTypeTemplate` registers a `prepare:types` reference for the whole
    // build regardless of which layer's module contributed it, so re-emit
    // the ambient file's own contents (single source of truth, no drift).
    const appConfigTypesPath = resolve('../shared/types/config.d.ts')
    addTypeTemplate({
      filename: 'types/foundry-app-config.d.ts',
      getContents: () => readFile(appConfigTypesPath, 'utf-8'),
    })

    const opts = nuxt.options as unknown as Record<string, unknown>
    const siteOpts = (opts.site ?? {}) as Record<string, unknown>
    const siteName = (siteOpts.name as string) || meta.name || ''

    opts.llms = defu(opts.llms as Record<string, unknown>, {
      domain: url,
      title: siteName,
      description: meta.description || '',
      full: {
        title: siteName,
        description: meta.description || '',
      },
    })

    nuxt.options.site = defu(nuxt.options.site, {
      url,
      name: siteName,
      debug: false,
    }) as typeof nuxt.options.site

    nuxt.options.appConfig.header = defu(nuxt.options.appConfig.header, {
      title: siteName,
    })

    nuxt.options.appConfig.seo = defu(nuxt.options.appConfig.seo, {
      titleTemplate: `%s - ${siteName}`,
      title: siteName,
      description: meta.description || '',
    })

    nuxt.options.appConfig.foundry = defu(nuxt.options.appConfig.foundry, {
      version: foundryVersion,
      url: 'https://foundry.incubrain.org',
    })
  },
})
