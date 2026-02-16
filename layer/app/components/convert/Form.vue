<!-- app/components/convert/Form.vue -->
<script setup lang="ts">
import type { FieldDef } from '~/composables/useFormCapture'
import type { OfferId } from '#shared/types/events'

interface Props {
  fields?: FieldDef[]
  location: string
  submitLabel?: string
  note?: string
  layout?: 'stacked' | 'horizontal'
  successRedirect?: string
  offerSlug?: OfferId
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your@email.com',
      required: true,
    },
  ],
  submitLabel: 'Get Access',
  layout: 'stacked',
  successRedirect: undefined,
})

const { state, schema, isSubmitting, honeypot, handleSubmit } = useFormCapture({
  fields: props.fields,
  location: props.location,
  offerSlug: props.offerSlug,
  successRedirect: props.successRedirect,
})

const formClasses = computed(() =>
  props.layout === 'horizontal'
    ? 'flex flex-col sm:flex-row gap-3 items-end'
    : 'space-y-4',
)
</script>

<template>
  <div class="w-full">
    <UForm
      ref="formRef"
      :state="state"
      :schema="schema"
      @submit="handleSubmit"
    >
      <!-- Honeypot field (invisible to humans, bots will fill it) -->
      <input
        v-model="honeypot"
        type="text"
        name="website"
        autocomplete="off"
        tabindex="-1"
        aria-hidden="true"
        style="
          position: absolute;
          left: -9999px;
          opacity: 0;
          pointer-events: none;
          height: 0;
          width: 0;
        "
      >

      <div :class="formClasses">
        <template
          v-for="field in fields"
          :key="field.name"
        >
          <UFormField
            :name="field.name"
            :label="layout === 'stacked' ? field.label : undefined"
            :class="layout === 'horizontal' ? 'flex-1' : 'w-full'"
          >
            <UTextarea
              v-if="field.type === 'textarea'"
              v-model="state[field.name]"
              :placeholder="field.placeholder"
              size="xl"
              :disabled="isSubmitting"
              :rows="3"
              autoresize
            />
            <UInput
              v-else
              v-model="state[field.name]"
              :type="field.type"
              :placeholder="field.placeholder"
              size="xl"
              :disabled="isSubmitting"
            />
          </UFormField>
        </template>

        <UButton
          type="submit"
          size="xl"
          :block="layout === 'stacked'"
          :loading="isSubmitting"
          variant="solid"
          color="primary"
          class="cursor-pointer disabled:cursor-not-allowed text-toned font-black"
        >
          {{ submitLabel }}
        </UButton>
      </div>
    </UForm>

    <p
      v-if="note"
      class="text-xs text-muted text-center mt-3"
    >
      {{ note }}
    </p>
  </div>
</template>
