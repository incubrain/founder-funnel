/// <reference types="@incubrain/foundry/modules/vrt/shared/commands" />
import { describe, it, expect } from 'vitest'
import { screenshotAllSections } from '@incubrain/foundry/modules/vrt/shared/helpers'

describe('VRT: Homepage sections', () => {
  it('screenshots all sections on the homepage', async () => {
    const sections = await screenshotAllSections()
    expect(sections.length).toBeGreaterThan(0)
  })
})
