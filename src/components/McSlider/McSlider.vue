<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'
import { useMcValidation } from '../../composables/validation'
import type { McRule } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McFormField from '../McFormField'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    vertical?: boolean
    label?: string
    description?: string
    showValue?: boolean
    color?: string
    hint?: string
    errorMessages?: string | string[]
    validateOn?: McValidateOn
    rules?: McRule<number>[]
    id?: string
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    readonly: false,
    required: false,
    vertical: false,
    showValue: false,
    rules: () => [],
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
  (event: 'change', value: number): void
}>()
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const valueText = computed(() => controlAttrs.value['aria-valuetext'])
const normalized = computed(() => Math.max(props.min, Math.min(props.modelValue, props.max)))
const position = computed(() =>
  props.max === props.min ? 0 : ((normalized.value - props.min) / (props.max - props.min)) * 100,
)
const validation = useMcValidation({
  id: props.id,
  value: () => props.modelValue,
  initialValue: props.min,
  rules: () => props.rules,
  required: () => props.required,
  disabled: () => props.disabled,
  errorMessages: () => props.errorMessages,
  validateOn: () => props.validateOn,
  emitReset: (value) => emit('update:modelValue', value),
})
function commit(value: number) {
  if (props.disabled || props.readonly) return
  const next = Math.max(props.min, Math.min(value, props.max))
  emit('update:modelValue', next)
  emit('change', next)
}
function onInput(event: Event) {
  commit(Number((event.target as HTMLInputElement).value))
}
function onKeydown(event: KeyboardEvent) {
  const page = props.step * 10
  if (event.key === 'Home') commit(props.min)
  else if (event.key === 'End') commit(props.max)
  else if (event.key === 'PageUp') commit(normalized.value + page)
  else if (event.key === 'PageDown') commit(normalized.value - page)
  else return
  event.preventDefault()
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
    :error="validation.errorMessage.value"
    :required="required"
    :disabled="disabled"
  >
    <template #default="field">
      <label
        class="mc-slider"
        :class="{ 'mc-slider--vertical': vertical, 'mc-slider--disabled': disabled, 'mc-slider--readonly': readonly }"
        :for="field.id"
      >
        <span
          class="mc-slider__control"
          :style="{ '--mc-slider-position': `${position}%`, '--mc-slider-color': color || undefined }"
        >
          <input
            v-bind="controlAttrs"
            :id="field.id"
            class="mc-slider__input"
            type="range"
            role="slider"
            :min="min"
            :max="max"
            :step="step"
            :value="normalized"
            :disabled="disabled"
            :aria-readonly="readonly || undefined"
            :orient="vertical ? 'vertical' : undefined"
            :aria-orientation="vertical ? 'vertical' : 'horizontal'"
            :aria-label="controlAttrs['aria-label'] || label || undefined"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuenow="normalized"
            :aria-invalid="Boolean(validation.errorMessage.value)"
            :aria-describedby="[field.descriptionId, field.messageId].filter(Boolean).join(' ') || undefined"
            @input="onInput"
            @keydown="onKeydown"
            @blur="validation.onBlur"
          />
          <span class="mc-slider__visual" aria-hidden="true">
            <span class="mc-slider__track"><span class="mc-slider__fill" /></span>
            <span class="mc-slider__thumb" />
          </span>
        </span>
        <output v-if="showValue" class="mc-slider__value" :for="field.id">{{ valueText || normalized }}</output>
      </label>
    </template>
  </mc-form-field>
</template>
