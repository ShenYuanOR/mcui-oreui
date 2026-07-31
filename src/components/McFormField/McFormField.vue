<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { useId } from 'vue'

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
</script>

<template>
  <div
    class="mc-form-field"
    :class="{
      'mc-form-field--error': error,
      'mc-form-field--success': success && !error,
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
        :message-id="error || hint || success ? messageId : undefined"
      />
    </div>
    <div
      v-if="error || hint || success || $slots.message"
      :id="messageId"
      class="mc-form-field__message"
      :role="error ? 'alert' : 'status'"
      aria-live="polite"
    >
      <slot name="message">
        <template v-if="Array.isArray(error)">{{ error.join(', ') }}</template>
        <template v-else>{{ error || success || hint }}</template>
      </slot>
    </div>
  </div>
</template>
