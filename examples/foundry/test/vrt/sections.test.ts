/// <reference types="@incubrain/foundry/modules/vrt/shared/commands" />
import { describe, it, expect } from 'vitest'
import { screenshotAllSections, screenshotByTestId } from '@incubrain/foundry/modules/vrt/shared/helpers'

describe('VRT: Homepage sections', () => {
  it('screenshots all sections on the homepage', async () => {
    const sections = await screenshotAllSections()
    expect(sections.length).toBeGreaterThan(0)
  })
})

describe('VRT: Convert components', () => {
  it('screenshots the offer page', async () => {
    await screenshotByTestId('convert-external', {
      pagePath: '/offers/mentorship',
    })
  })
})
