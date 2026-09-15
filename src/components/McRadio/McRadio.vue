<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, inject, useId } from 'vue'
import { useSound } from '../../composables/useSound'
import { useMcValidation } from '../../composables/validation'
import type { McRule } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McFormField from '../McFormField'
import { mcRadioGroupKey } from '../McRadioGroup/groupContext'

const { playSound } = useSound()

export type McRadioValue = string | number | boolean
defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: McRadioValue
    value?: McRadioValue
    disabled?: boolean
    readonly?: boolean
    label?: string
    name?: string
    id?: string
    rotate?: boolean
    color?: string
    description?: string
    hint?: string
    required?: boolean
    rules?: McRule<McRadioValue>[]
    errorMessages?: string | string[]
    validateOn?: McValidateOn
  }>(),
  { modelValue: '', value: '', disabled: false, readonly: false, rotate: false, required: false, rules: () => [] },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: McRadioValue): void
  (event: 'change', value: McRadioValue): void
}>()
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const generatedId = useId()
const inputId = computed(() => props.id || `${generatedId}-radio`)
const checked = computed(() => Object.is(props.modelValue, props.value))
const grouped = Boolean(inject(mcRadioGroupKey, null))
const validation = useMcValidation({
  id: props.id,
  value: () => props.modelValue,
  rules: () => props.rules,
  required: () => props.required,
  disabled: () => props.disabled,
  errorMessages: () => props.errorMessages,
  validateOn: () => props.validateOn,
  register: !grouped,
  emitReset: (value) => emit('update:modelValue', value),
})
const fieldError = computed(() => validation.errorMessage.value)
function select() {
  if (props.disabled || props.readonly || checked.value) return
  playSound('click')
  emit('update:modelValue', props.value)
  emit('change', props.value)
}
defineExpose(validation)
</script>

<template>
  <mc-form-field
    v-bind="rootAttrs"
    :id="inputId"
    :description="description"
    :hint="hint"
    :error="fieldError"
    :disabled="disabled"
  >
    <template #default="field">
      <label
        class="mc-radio"
        :class="{
          'mc-radio--checked': checked,
          'mc-radio--disabled': disabled,
          'mc-radio--readonly': readonly,
          'mc-radio--rotate': rotate,
        }"
        :for="field.id"
      >
        <input
          v-bind="controlAttrs"
          :id="field.id"
          class="mc-radio__input"
          type="radio"
          :name="name || undefined"
          :value="String(value)"
          :checked="checked"
          :disabled="disabled"
          :required="required"
          :aria-readonly="readonly || undefined"
          :aria-invalid="Boolean(fieldError)"
          :aria-describedby="[field.descriptionId, field.messageId].filter(Boolean).join(' ') || undefined"
          @click="readonly && $event.preventDefault()"
          @change="select"
          @blur="validation.onBlur"
        />
        <span class="mc-radio__control" :style="color ? { '--mc-control-color': color } : undefined" aria-hidden="true">
          <span class="mc-radio__dot" />
        </span>
        <span v-if="label || $slots.default" class="mc-radio__label"
          ><slot>{{ label }}</slot
          ><span v-if="required" aria-hidden="true"> *</span></span
        >
      </label>
    </template>
  </mc-form-field>
</template>
