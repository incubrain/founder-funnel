import { createVrtConfig } from '@incubrain/foundry/modules/vrt/shared'

export default createVrtConfig({
  root: import.meta.dirname!,
  port: 3333,
})
