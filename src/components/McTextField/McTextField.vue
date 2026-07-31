<script setup lang="ts">
import '../../styles/component-core.css'
import '../../styles/shared/input-control.css'
import { computed } from 'vue'
import type { McRule } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'
import { useMcValidation } from '../../composables/validation'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McFormField from '../McFormField'

type FilterType = 'text' | 'all' | 'number' | 'letter' | 'operator' | 'base' | 'none'
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    filter?: FilterType
    type?: string
    hint?: string
    label?: string
    description?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    rules?: McRule<string>[]
    errorMessages?: string | string[]
    validateOn?: McValidateOn
    id?: string
  }>(),
  {
    modelValue: '',
    filter: 'text',
    type: 'text',
    disabled: false,
    readonly: false,
    required: false,
    rules: () => [],
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
  (event: 'invalid-input'): void
}>()
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()

function filterValue(value: string): string {
  if (props.filter === 'number') return value.replace(/[^0-9]/g, '')
  if (props.filter === 'letter') return value.replace(/[^a-zA-Z]/g, '')
  if (props.filter === 'operator') return value.replace(/[^`!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]/g, '')
  if (props.filter === 'base') return value.replace(/[^0-9a-zA-Z `!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]/g, '')
  if (props.filter === 'none') return ''
  return value
}

function update(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  const value = filterValue(raw)
  if (value !== raw) emit('invalid-input')
  if (value !== raw) (event.target as HTMLInputElement).value = value
  emit('update:modelValue', value)
}
function change(event: Event) {
  emit('change', (event.target as HTMLInputElement).value)
}

const validation = useMcValidation({
  id: props.id,
  value: () => props.modelValue,
  initialValue: '',
  rules: () => props.rules,
  required: () => props.required,
  disabled: () => props.disabled,
  errorMessages: () => props.errorMessages,
  validateOn: () => props.validateOn,
  emitReset: (value) => emit('update:modelValue', value),
})
const fieldError = computed(() => validation.errorMessage.value)
const describedBy = (descriptionId?: string, messageId?: string) =>
  [descriptionId, messageId].filter(Boolean).join(' ') || undefined
defineExpose(validation)
</script>

<template>
  <mc-form-field
    v-bind="rootAttrs"
    :id="id || validation.id"
    :label="label"
    :description="description"
    :hint="hint"
    :error="fieldError"
    :required="required"
    :disabled="disabled"
  >
    <template #default="field">
      <input
        v-bind="controlAttrs"
        :id="field.id"
        class="mc-input"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="Boolean(fieldError)"
        :aria-describedby="describedBy(field.descriptionId, field.messageId)"
        @input="update"
        @change="change"
        @blur="validation.onBlur"
      />
    </template>
  </mc-form-field>
</template>
