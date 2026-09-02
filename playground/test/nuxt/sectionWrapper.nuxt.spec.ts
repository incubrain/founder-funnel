// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SectionWrapper from '@incubrain/foundry/app/components/section/SectionWrapper.vue'

describe('SectionWrapper: Landmark Attributes', () => {
  it('renders section with aria-labelledby and data-testid when sectionId provided', async () => {
    const wrapper = await mountSuspended(SectionWrapper, {
      props: {
        sectionId: 'offer',
        title: 'Stop Building in the Dark',
      },
    })

    const section = wrapper.find('section')
    expect(section.exists()).toBe(true)
    expect(section.attributes('id')).toBe('offer')
    expect(section.attributes('aria-labelledby')).toBe('heading-offer')
    expect(section.attributes('data-testid')).toBe('section-offer')
  })

  it('stamps data-section so identity events can name the section', async () => {
    const wrapper = await mountSuspended(SectionWrapper, {
      props: { sectionId: 'offer', title: 'Stop Building in the Dark' },
    })

    expect(wrapper.find('section').attributes('data-section')).toBe('offer')
  })

  it('renders heading with correct id for aria-labelledby', async () => {
    const wrapper = await mountSuspended(SectionWrapper, {
      props: {
        sectionId: 'hero',
        title: 'Common Questions',
      },
    })

    const heading = wrapper.find('#heading-hero')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toContain('Common Questions')
  })

  it('does not add landmark attributes when sectionId is omitted', async () => {
    const wrapper = await mountSuspended(SectionWrapper, {
      props: {
        title: 'No Section ID',
      },
    })

    const section = wrapper.find('section')
    expect(section.exists()).toBe(true)
    expect(section.attributes('aria-labelledby')).toBeUndefined()
    expect(section.attributes('data-testid')).toBeUndefined()
    expect(section.attributes('data-section')).toBeUndefined()
  })
})
