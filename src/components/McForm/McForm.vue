<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { provide, watch } from 'vue'
import { createMcForm, mcFormKey } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    validateOn?: McValidateOn
    fastFail?: boolean
    disabled?: boolean
  }>(),
  { modelValue: true, validateOn: 'input', fastFail: false, disabled: false },
)

const emit = defineEmits<{
  (event: 'submit', result: { valid: boolean; errors: string[] }): void
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:validating', value: boolean): void
  (event: 'update:dirty', value: boolean): void
}>()

const form = createMcForm({ validateOn: props.validateOn, fastFail: props.fastFail })
provide(mcFormKey, form)
watch(
  () => props.validateOn,
  (value) => {
    form.validateOn.value = value
  },
)
watch(
  () => props.fastFail,
  (value) => {
    form.fastFail.value = value
  },
)
watch(form.valid, (value) => emit('update:modelValue', value), { immediate: true })
watch(form.validating, (value) => emit('update:validating', value), { immediate: true })
watch(form.dirty, (value) => emit('update:dirty', value), { immediate: true })

async function validate() {
  return form.validate()
}

function reset() {
  form.reset()
}

function resetValidation() {
  form.resetValidation()
}

async function onSubmit(event: Event) {
  event.preventDefault()
  const result = await validate()
  emit('submit', result)
}

defineExpose({
  validate,
  reset,
  resetValidation,
  valid: form.valid,
  validating: form.validating,
  dirty: form.dirty,
  errors: form.errors,
})
</script>

<template>
  <form class="mc-form" novalidate :aria-busy="form.validating.value || undefined" @submit="onSubmit">
    <fieldset class="mc-form__fieldset" :disabled="disabled">
      <slot
        :valid="form.valid.value"
        :validating="form.validating.value"
        :dirty="form.dirty.value"
        :errors="form.errors.value"
        :validate="validate"
        :reset="reset"
        :reset-validation="resetValidation"
      />
    </fieldset>
  </form>
</template>
