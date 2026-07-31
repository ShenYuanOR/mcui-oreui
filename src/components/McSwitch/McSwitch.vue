<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'
import switchOffIcon from '../../assets/images/switch-off.svg'
import switchOnIcon from '../../assets/images/switch-on.svg'
import { useSound } from '../../composables/useSound'
import { useMcValidation } from '../../composables/validation'
import type { McRule } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McFormField from '../McFormField'

const { playSound } = useSound()

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    label?: string
    name?: string
    id?: string
    color?: string
    hint?: string
    description?: string
    rules?: McRule<boolean>[]
    errorMessages?: string | string[]
    validateOn?: McValidateOn
  }>(),
  { modelValue: false, disabled: false, readonly: false, required: false, rules: () => [] },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', value: boolean): void
}>()
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const validation = useMcValidation({
  id: props.id,
  value: () => props.modelValue,
  initialValue: false,
  rules: () => props.rules,
  required: () => props.required,
  disabled: () => props.disabled,
  errorMessages: () => props.errorMessages,
  validateOn: () => props.validateOn,
  emitReset: (value) => emit('update:modelValue', value),
})
const fieldError = computed(() => validation.errorMessages.value)
function update(event: Event) {
  if (props.readonly) {
    event.preventDefault()
    return
  }
  const value = (event.target as HTMLInputElement).checked
  playSound('click')
  emit('update:modelValue', value)
  emit('change', value)
}
defineExpose(validation)
</script>

<template>
  <mc-form-field
    v-bind="rootAttrs"
    :id="id || validation.id"
    :description="description"
    :hint="hint"
    :error="fieldError"
    :disabled="disabled"
  >
    <template #default="field">
      <label
        class="mc-switch"
        :class="{ 'mc-switch--disabled': disabled, 'mc-switch--readonly': readonly }"
        :for="field.id"
      >
        <input
          v-bind="controlAttrs"
          :id="field.id"
          class="mc-switch__input"
          type="checkbox"
          role="switch"
          :name="name || undefined"
          :checked="modelValue"
          :disabled="disabled"
          :required="required"
          :aria-readonly="readonly || undefined"
          :aria-invalid="fieldError.length > 0"
          :aria-describedby="[field.descriptionId, field.messageId].filter(Boolean).join(' ') || undefined"
          @click="readonly && $event.preventDefault()"
          @change="update"
          @blur="validation.onBlur"
        />
        <span class="mc-switch__track" :style="color ? { '--mc-control-color': color } : undefined" aria-hidden="true">
          <span class="mc-switch__mark mc-switch__mark--on"><img :src="switchOnIcon" alt="" /></span>
          <span class="mc-switch__mark mc-switch__mark--off"><img :src="switchOffIcon" alt="" /></span>
          <span class="mc-switch__thumb" />
        </span>
        <span v-if="label || $slots.default" class="mc-switch__label"
          ><slot>{{ label }}</slot
          ><span v-if="required" aria-hidden="true"> *</span></span
        >
      </label>
    </template>
  </mc-form-field>
</template>
