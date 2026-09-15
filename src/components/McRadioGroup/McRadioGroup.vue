<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, provide } from 'vue'
import { useMcValidation } from '../../composables/validation'
import type { McRule } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McRadio, { type McRadioValue } from '../McRadio'
import { mcRadioGroupKey } from './groupContext'

export interface McRadioOption {
  label: string
  value: McRadioValue
  disabled?: boolean
}
const props = withDefaults(
  defineProps<{
    modelValue?: McRadioValue
    options?: McRadioOption[]
    direction?: 'horizontal' | 'vertical'
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    label?: string
    description?: string
    hint?: string
    errorMessages?: string | string[]
    validateOn?: McValidateOn
    rules?: McRule<McRadioValue>[]
    id?: string
    name?: string
  }>(),
  {
    modelValue: '',
    options: () => [],
    direction: 'horizontal',
    disabled: false,
    readonly: false,
    required: false,
    rules: () => [],
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: McRadioValue): void
  (event: 'change', value: McRadioValue): void
}>()
defineOptions({ inheritAttrs: false })
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
provide(mcRadioGroupKey, true)
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
const fieldError = computed(() => validation.errorMessages.value)
const descriptionId = computed(() => (props.description ? `${props.id || validation.id}-description` : undefined))
const messageId = computed(() =>
  fieldError.value.length || props.hint ? `${props.id || validation.id}-message` : undefined,
)
function update(value: McRadioValue) {
  if (props.readonly) return
  emit('update:modelValue', value)
  emit('change', value)
}
defineExpose(validation)
</script>

<template>
  <fieldset
    v-bind="{ ...rootAttrs, ...controlAttrs }"
    :id="id || validation.id"
    class="mc-radio-group-field"
    :disabled="disabled"
    :aria-readonly="readonly || undefined"
    :aria-invalid="fieldError.length > 0"
    :aria-describedby="[descriptionId, messageId].filter(Boolean).join(' ') || undefined"
    @focusout="validation.onBlur"
  >
    <legend v-if="label" class="mc-radio-group-field__legend">
      {{ label }}<span v-if="required" aria-hidden="true"> *</span>
    </legend>
    <div v-if="description" :id="descriptionId" class="mc-form-field__description">{{ description }}</div>
    <div class="mc-radio-group" :class="`mc-radio-group--${direction}`">
      <slot>
        <mc-radio
          v-for="option in options"
          :key="String(option.value)"
          :model-value="props.modelValue"
          :value="option.value"
          :name="name || validation.id"
          :disabled="disabled || option.disabled"
          :readonly="readonly"
          @update:model-value="update"
          >{{ option.label }}</mc-radio
        >
      </slot>
    </div>
    <div
      v-if="fieldError.length || hint"
      :id="messageId"
      class="mc-form-field__message"
      :role="fieldError.length ? 'alert' : 'status'"
    >
      {{ fieldError[0] || hint }}
    </div>
  </fieldset>
</template>
