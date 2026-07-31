<script setup lang="ts">
import '../../styles/component-core.css'
import '../../styles/shared/input-control.css'
import './style.css'
import { computed } from 'vue'
import type { McRule } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'
import { useMcValidation } from '../../composables/validation'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McFormField from '../McFormField'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    description?: string
    hint?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    autoGrow?: boolean
    rows?: number
    maxLength?: number
    rules?: McRule<string>[]
    errorMessages?: string | string[]
    validateOn?: McValidateOn
    id?: string
  }>(),
  {
    modelValue: '',
    disabled: false,
    readonly: false,
    required: false,
    autoGrow: false,
    rows: 3,
    maxLength: 0,
    rules: () => [],
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const validation = useMcValidation({
  id: props.id,
  value: () => props.modelValue,
  initialValue: '',
  rules: () => props.rules,
  required: () => props.required,
  emitReset: (value) => emit('update:modelValue', value),
  disabled: () => props.disabled,
  errorMessages: () => props.errorMessages,
  validateOn: () => props.validateOn,
})
const fieldError = computed(() => validation.errorMessage.value)
function input(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  if (props.autoGrow) {
    target.style.height = 'auto'
    target.style.height = `${target.scrollHeight}px`
  }
}
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
      <textarea
        v-bind="controlAttrs"
        :id="field.id"
        class="mc-input mc-textarea"
        :value="modelValue"
        :rows="rows"
        :maxlength="maxLength || undefined"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="Boolean(fieldError)"
        :aria-describedby="[field.descriptionId, field.messageId].filter(Boolean).join(' ') || undefined"
        @input="input"
        @change="emit('change', ($event.target as HTMLTextAreaElement).value)"
        @blur="validation.onBlur"
      />
    </template>
  </mc-form-field>
</template>
