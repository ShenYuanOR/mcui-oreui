import { computed, onBeforeUnmount, onMounted, ref, toValue, useId, watch, type MaybeRefOrGetter } from 'vue'
import { useMcForm, type McRule } from '../framework/form'
import { useMcLocale } from '../framework/locale'
import type { McValidateOn } from '../framework/types'

export interface McValidationOptions<T> {
  id?: string
  value: MaybeRefOrGetter<T>
  initialValue: T
  rules?: MaybeRefOrGetter<McRule<T>[] | undefined>
  required?: MaybeRefOrGetter<boolean | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  errorMessages?: MaybeRefOrGetter<string | string[] | undefined>
  validateOn?: MaybeRefOrGetter<McValidateOn | undefined>
  requiredMessage?: string
  emitReset: (value: T) => void
}

export function useMcValidation<T>(options: McValidationOptions<T>) {
  const form = useMcForm()
  const locale = useMcLocale()
  const id = options.id || `${useId()}-field`
  const internalErrors = ref<string[]>([])
  const validating = ref(false)
  const dirty = ref(false)
  let validationRun = 0
  const externalErrors = computed(() => {
    const value = toValue(options.errorMessages)
    return value ? (Array.isArray(value) ? value : [value]) : []
  })
  const errorMessages = computed(() => [...externalErrors.value, ...internalErrors.value])
  const mode = computed(() => toValue(options.validateOn) ?? form?.validateOn.value ?? 'input')
  const hasValue = (value: T) =>
    value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)

  async function validate(): Promise<boolean> {
    if (toValue(options.disabled)) {
      internalErrors.value = []
      return true
    }
    const run = ++validationRun
    validating.value = true
    dirty.value = true
    const messages: string[] = []
    const value = toValue(options.value)
    if (toValue(options.required) && !hasValue(value)) messages.push(options.requiredMessage ?? locale.t('required'))
    for (const rule of toValue(options.rules) ?? []) {
      try {
        const result = await rule(value)
        if (result !== true) messages.push(typeof result === 'string' ? result : locale.t('invalid'))
      } catch (error) {
        messages.push(error instanceof Error && error.message ? error.message : locale.t('invalid'))
      }
    }
    if (run === validationRun) {
      internalErrors.value = messages
      validating.value = false
    }
    return messages.length === 0 && externalErrors.value.length === 0
  }

  function reset() {
    options.emitReset(options.initialValue)
    resetValidation()
  }
  function resetValidation() {
    validationRun += 1
    internalErrors.value = []
    dirty.value = false
    validating.value = false
  }
  function onInput() {
    if (mode.value === 'input' || (mode.value === 'lazy' && dirty.value)) void validate()
  }
  function onBlur() {
    if (mode.value === 'blur' || mode.value === 'lazy') void validate()
  }

  const field = { id, validate, reset, resetValidation, errorMessages, validating, dirty }
  onMounted(() => form?.register(field))
  onBeforeUnmount(() => form?.unregister(id))
  watch(() => toValue(options.value), onInput, { flush: 'post' })
  watch(externalErrors, () => {
    if (externalErrors.value.length) dirty.value = true
  })

  return {
    id,
    errorMessages,
    errorMessage: computed(() => errorMessages.value[0] ?? ''),
    valid: computed<boolean | null>(() => (dirty.value ? errorMessages.value.length === 0 : null)),
    validating,
    dirty,
    validate,
    reset,
    resetValidation,
    onInput,
    onBlur,
  }
}
