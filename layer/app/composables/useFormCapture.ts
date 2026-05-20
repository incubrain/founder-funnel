import { z } from 'zod'
import type { OfferId } from '../../modules/events/runtime/types/events'

export interface FieldDef {
  name: string
  label?: string
  type: 'text' | 'email' | 'textarea' | 'tel'
  placeholder?: string
  required?: boolean
}

interface FormCaptureOptions {
  fields: FieldDef[]
  location: string
  offerSlug?: OfferId
  successRedirect?: string | false
}

/**
 * Handles form validation, anti-spam, submission, and error toasts.
 *
 * Extracts all business logic from Form.vue so the component
 * only handles rendering.
 */
export function useFormCapture(options: FormCaptureOptions) {
  const { fields, location, offerSlug, successRedirect } = options
  const { trackEvent } = useEvents()
  const toast = useToast()

  // Dynamic reactive state for form fields
  const state = reactive<Record<string, string | undefined>>({})
  fields.forEach((field) => {
    state[field.name] = undefined
  })

  // Dynamic Zod schema built from field definitions
  const schema = computed(() => {
    const shape: Record<string, z.ZodTypeAny> = {}

    fields.forEach((field) => {
      let validator: z.ZodTypeAny = z.string()

      if (field.type === 'email') {
        validator = (validator as z.ZodString).email('Please enter a valid email address')
      }

      if (!field.required) {
        validator = (validator as z.ZodString).optional().or(z.literal(''))
      }
      else {
        validator = (validator as z.ZodString).min(1, `${field.label || field.name} is required`)
      }

      shape[field.name] = validator
    })

    return z.object(shape)
  })

  // Submission state
  const isSubmitting = ref(false)

  // Anti-spam tracking
  const formRenderedAt = ref(Date.now())
  const honeypot = ref('')
  const jsToken = ref('')

  onMounted(() => {
    jsToken.value = crypto.randomUUID()
  })

  const shouldRedirect = successRedirect !== false && !!successRedirect
  const redirectPath = successRedirect || ''

  const handleSubmit = async () => {
    isSubmitting.value = true

    try {
      const validated = schema.value.parse(state)

      // Client-side honeypot check (silent reject)
      if (honeypot.value) {
        if (shouldRedirect) {
          navigateTo(redirectPath)
        }
        else {
          toast.add({
            title: 'Thank you!',
            description: 'Your submission has been received.',
            color: 'success',
          })
        }
        return
      }

      await trackEvent({
        id: `form_submit_${location}`,
        type: 'form_submitted',
        target: `${offerSlug}_internal`,
        data: {
          formData: { ...validated, formId: location },
          antiSpam: {
            honeypot: honeypot.value,
            timeOnForm: Date.now() - formRenderedAt.value,
            jsToken: jsToken.value,
          },
        },
      })
      if (shouldRedirect) {
        navigateTo(redirectPath)
      }
      else {
        toast.add({
          title: 'Thank you!',
          description: 'Your submission has been received.',
          color: 'success',
        })
      }
    }
    catch (error: unknown) {
      // Zod validation failure
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as z.ZodError
        toast.add({
          title: 'Validation Error',
          description: zodError.issues[0]?.message || 'Please check your inputs.',
          color: 'error',
        })
        isSubmitting.value = false
        return
      }

      const errorMsg
        = error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'

      toast.add({
        title: 'Submission failed',
        description: errorMsg,
        color: 'error',
      })

      await trackEvent({
        id: `form_error_${location}`,
        type: 'form_error',
        target: `${offerSlug}_internal`,
        data: {
          formData: { formId: location },
        },
        error: errorMsg,
      })
    }
    finally {
      isSubmitting.value = false
    }
  }

  return {
    state,
    schema,
    isSubmitting,
    honeypot,
    handleSubmit,
  }
}
