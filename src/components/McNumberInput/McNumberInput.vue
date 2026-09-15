<script setup lang="ts">
import '../../styles/component-core.css'
import '../../styles/shared/input-control.css'
import './style.css'
import { ref, watch } from 'vue'
import { useMcValidation } from '../../composables/validation'
import type { McRule } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'
import { useMcLocale } from '../../framework/locale'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McFormField from '../McFormField'

const props = withDefaults(
  defineProps<{
    modelValue?: number | null
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    label?: string
    hint?: string
    description?: string
    id?: string
    placeholder?: string
    rules?: McRule<number | null>[]
    errorMessages?: string | string[]
    validateOn?: McValidateOn
  }>(),
  {
    modelValue: null,
    min: -Infinity,
    max: Infinity,
    step: 1,
    disabled: false,
    readonly: false,
    required: false,
    rules: () => [],
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: number | null): void
  (event: 'change', value: number | null): void
}>()
defineOptions({ inheritAttrs: false })
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const locale = useMcLocale()
const editing = ref(false)
const text = ref(props.modelValue === null ? '' : String(props.modelValue))
watch(
  () => props.modelValue,
  (value) => {
    if (!editing.value) text.value = value === null ? '' : String(value)
  },
)
const validation = useMcValidation({
  id: props.id,
  value: () => props.modelValue,
  initialValue: null,
  rules: () => props.rules,
  required: () => props.required,
  disabled: () => props.disabled,
  errorMessages: () => props.errorMessages,
  validateOn: () => props.validateOn,
  emitReset: (value) => emit('update:modelValue', value),
})
function normalize(value: number) {
  return Number(Math.min(props.max, Math.max(props.min, value)).toPrecision(12))
}
function commit() {
  editing.value = false
  const parsed = text.value.trim() === '' ? null : Number(text.value)
  const value = parsed === null || !Number.isFinite(parsed) ? null : normalize(parsed)
  text.value = value === null ? '' : String(value)
  emit('update:modelValue', value)
  emit('change', value)
  validation.onBlur()
}
function stepBy(direction: 1 | -1) {
  if (props.disabled || props.readonly) return
  const base = props.modelValue ?? (Number.isFinite(props.min) ? props.min : 0)
  const value = normalize(base + props.step * direction)
  text.value = String(value)
  emit('update:modelValue', value)
  emit('change', value)
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') stepBy(1)
  else if (event.key === 'ArrowDown') stepBy(-1)
  else if (event.key === 'Enter') commit()
  else if (event.key === 'Escape') {
    text.value = props.modelValue === null ? '' : String(props.modelValue)
    editing.value = false
  } else return
  event.preventDefault()
}
defineExpose({ ...validation, commit, increment: () => stepBy(1), decrement: () => stepBy(-1) })
</script>

<template>
  <mc-form-field
    v-bind="rootAttrs"
    :id="id || validation.id"
    :label="label"
    :description="description"
    :hint="hint"
    :error="validation.errorMessage.value"
    :required="required"
    :disabled="disabled"
  >
    <template #default="field"
      ><div class="mc-number-input">
        <button
          type="button"
          class="mc-number-input__button"
          :disabled="disabled || readonly || (modelValue !== null && modelValue <= min)"
          :aria-label="locale.t('decrement')"
          @click="stepBy(-1)"
        >
          −
        </button>
        <input
          v-bind="controlAttrs"
          :id="field.id"
          class="mc-input mc-number-input__field"
          type="text"
          inputmode="decimal"
          :value="text"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :aria-invalid="Boolean(validation.errorMessage.value)"
          :aria-describedby="[field.descriptionId, field.messageId].filter(Boolean).join(' ') || undefined"
          @focus="editing = true"
          @input="text = ($event.target as HTMLInputElement).value"
          @blur="commit"
          @keydown="onKeydown"
        />
        <button
          type="button"
          class="mc-number-input__button"
          :disabled="disabled || readonly || (modelValue !== null && modelValue >= max)"
          :aria-label="locale.t('increment')"
          @click="stepBy(1)"
        >
          +
        </button>
      </div></template
    >
  </mc-form-field>
</template>
