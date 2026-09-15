<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    description?: string
    error?: string | string[]
    hint?: string
    success?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    required: false,
    disabled: false,
  },
)

const generatedId = useId()
const controlId = props.id || `${generatedId}-control`
const descriptionId = `${controlId}-description`
const messageId = `${controlId}-message`
const errorMessages = computed(() => {
  if (props.error == null) return []
  return Array.isArray(props.error) ? props.error.filter(Boolean) : props.error ? [props.error] : []
})
const hasError = computed(() => errorMessages.value.length > 0)
const hasMessage = computed(() => hasError.value || Boolean(props.hint) || Boolean(props.success))
</script>

<template>
  <div
    class="mc-form-field"
    :class="{
      'mc-form-field--error': hasError,
      'mc-form-field--success': success && !hasError,
      'mc-form-field--disabled': disabled,
    }"
  >
    <label v-if="label || $slots.label" class="mc-form-field__label" :for="controlId">
      <slot name="label">{{ label }}</slot
      ><span v-if="required" aria-hidden="true" class="mc-form-field__required"> *</span>
    </label>
    <div v-if="description || $slots.description" :id="descriptionId" class="mc-form-field__description">
      <slot name="description">{{ description }}</slot>
    </div>
    <div class="mc-form-field__control">
      <slot
        :id="controlId"
        :description-id="description ? descriptionId : undefined"
        :message-id="hasMessage ? messageId : undefined"
      />
    </div>
    <div
      v-if="hasMessage || $slots.message"
      :id="messageId"
      class="mc-form-field__message"
      :role="hasError ? 'alert' : 'status'"
      aria-live="polite"
    >
      <slot name="message">
        <template v-if="hasError">{{ errorMessages.join(', ') }}</template>
        <template v-else>{{ success || hint }}</template>
      </slot>
    </div>
  </div>
</template>
