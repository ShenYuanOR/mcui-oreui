import { computed, inject, onBeforeUnmount, onMounted, ref, toValue, useId, watch, type MaybeRefOrGetter } from 'vue'
import { mcFormKey, type McRule } from '../framework/form'
import { useMcLocale } from '../framework/locale'
import type { McValidateOn } from '../framework/types'

export interface McValidationOptions<T> {
  id?: string
  value: MaybeRefOrGetter<T>
  initialValue?: T
  rules?: MaybeRefOrGetter<McRule<T>[] | undefined>
  required?: MaybeRefOrGetter<boolean | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  errorMessages?: MaybeRefOrGetter<string | string[] | undefined>
  validateOn?: MaybeRefOrGetter<McValidateOn | undefined>
  requiredMessage?: string
  register?: boolean
  emitReset: (value: T) => void
}

export function useMcValidation<T>(options: McValidationOptions<T>) {
  const form = inject(mcFormKey, null)
  const locale = useMcLocale()
  const id = options.id || `${useId()}-field`
  const internalErrors = ref<string[]>([])
  const validating = ref(false)
  const dirty = ref(false)
  let validationRun = 0
  let skipValueWatch = false
  const snapshotInitial = (): T =>
    options.initialValue !== undefined
      ? structuredCloneValue(options.initialValue)
      : structuredCloneValue(toValue(options.value))
  let initialValue = snapshotInitial()
  const externalErrors = computed(() => {
    const value = toValue(options.errorMessages)
    return value ? (Array.isArray(value) ? value.filter(Boolean) : [value]) : []
  })
  const errorMessages = computed(() => [...externalErrors.value, ...internalErrors.value])
  const mode = computed(() => toValue(options.validateOn) ?? form?.validateOn.value ?? 'input')
  const hasValue = (value: T) => {
    if (typeof value === 'boolean') return value === true
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined && value !== ''
  }

  function currentValid() {
    return errorMessages.value.length === 0
  }

  async function validate(): Promise<boolean> {
    if (toValue(options.disabled)) {
      validationRun += 1
      internalErrors.value = []
      validating.value = false
      return currentValid()
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
        if (run !== validationRun) return currentValid()
        if (result !== true) messages.push(typeof result === 'string' ? result : locale.t('invalid'))
      } catch (error) {
        if (run !== validationRun) return currentValid()
        messages.push(error instanceof Error && error.message ? error.message : locale.t('invalid'))
      }
    }
    if (run !== validationRun) return currentValid()
    internalErrors.value = messages
    validating.value = false
    return currentValid()
  }

  function reset() {
    skipValueWatch = true
    options.emitReset(structuredCloneValue(initialValue))
    resetValidation()
  }
  function resetValidation() {
    validationRun += 1
    internalErrors.value = []
    dirty.value = false
    validating.value = false
  }
  function onInput() {
    if (skipValueWatch) {
      skipValueWatch = false
      return
    }
    if (mode.value === 'input' || (mode.value === 'lazy' && dirty.value)) void validate()
  }
  function onBlur() {
    if (mode.value === 'blur' || mode.value === 'lazy') void validate()
  }

  const field = { id, validate, reset, resetValidation, errorMessages, validating, dirty }
  onMounted(() => {
    initialValue = snapshotInitial()
    if (options.register !== false) form?.register(field)
  })
  onBeforeUnmount(() => {
    if (options.register !== false) form?.unregister(id)
  })
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

function structuredCloneValue<T>(value: T): T {
  if (Array.isArray(value)) return [...value] as T
  if (value && typeof value === 'object') return { ...(value as object) } as T
  return value
}
