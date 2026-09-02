import type { TrackedEvents } from '../types/events'

export const EVENT_METADATA: Partial<
  Record<
    TrackedEvents,
    {
      label: string
      description: string
      icon: string
      category: 'form' | 'conversion' | 'engagement'
    }
  >
> = {
  'form_submitted': {
    label: 'Form Submit',
    description: 'Form submitted successfully',
    icon: 'i-lucide-check-circle',
    category: 'form',
  },
  'form_error': {
    label: 'Form Error',
    description: 'Form validation failed',
    icon: 'i-lucide-alert-circle',
    category: 'form',
  },
  'offer_click': {
    label: 'Offer Click',
    description: 'User clicked on offer/CTA',
    icon: 'i-lucide-mouse-pointer-click',
    category: 'conversion',
  },
  'section_view': {
    label: 'Section View',
    description: 'Section came into viewport',
    icon: 'i-lucide-eye',
    category: 'engagement',
  },
  'ui.click': {
    label: 'UI Click',
    description: 'Content-free click identity (target, label, section)',
    icon: 'i-lucide-pointer',
    category: 'engagement',
  },
  'ui.section': {
    label: 'UI Section Visibility',
    description: 'Section entered or left the viewport',
    icon: 'i-lucide-scan-eye',
    category: 'engagement',
  },
  'ui.page': {
    label: 'UI Page View',
    description: 'Route change or first page load',
    icon: 'i-lucide-file',
    category: 'engagement',
  },
} as const
