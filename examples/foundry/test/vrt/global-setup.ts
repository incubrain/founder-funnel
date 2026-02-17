import { resolve } from 'node:path'
import { createGlobalSetup } from '@incubrain/foundry/modules/vrt/shared'

const { setup, teardown } = createGlobalSetup({
  port: 3333,
  rootDir: resolve(import.meta.dirname!, '../../'),
})

export { setup, teardown }
