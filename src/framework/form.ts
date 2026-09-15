import {
  computed,
  getCurrentInstance,
  inject,
  ref,
  shallowRef,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'
import type { McValidateOn } from './types'

export type McValidationResult = true | false | string
export type McRule<T = unknown> = (value: T) => McValidationResult | Promise<McValidationResult>

export interface McFormFieldInstance {
  id: string
  validate: () => Promise<boolean>
  reset: () => void
  resetValidation: () => void
  errorMessages: Readonly<Ref<string[]>>
  validating: Readonly<Ref<boolean>>
  dirty: Readonly<Ref<boolean>>
}

export interface McFormInstance {
  register: (field: McFormFieldInstance) => void
  unregister: (id: string) => void
  validate: () => Promise<{ valid: boolean; errors: string[] }>
  reset: () => void
  resetValidation: () => void
  valid: ComputedRef<boolean>
  validating: ComputedRef<boolean>
  dirty: ComputedRef<boolean>
  errors: ComputedRef<string[]>
  validateOn: Ref<McValidateOn>
  fastFail: Ref<boolean>
  dispose: () => void
}

export const mcFormKey: InjectionKey<McFormInstance> = Symbol.for('mcui:form')

export function createMcForm(options: { validateOn?: McValidateOn; fastFail?: boolean } = {}): McFormInstance {
  const fields = shallowRef<McFormFieldInstance[]>([])
  const validateOn = ref(options.validateOn ?? 'input')
  const fastFail = ref(options.fastFail ?? false)
  const errors = computed(() => fields.value.flatMap((field) => field.errorMessages.value))
  const validating = computed(() => fields.value.some((field) => field.validating.value))
  const dirty = computed(() => fields.value.some((field) => field.dirty.value))
  const valid = computed(() => errors.value.length === 0)

  return {
    register(field) {
      const index = fields.value.findIndex((item) => item.id === field.id)
      if (index >= 0) fields.value = fields.value.map((item, itemIndex) => (itemIndex === index ? field : item))
      else fields.value = [...fields.value, field]
    },
    unregister(id) {
      fields.value = fields.value.filter((field) => field.id !== id)
    },
    async validate() {
      for (const field of fields.value) {
        const fieldValid = await field.validate()
        if (!fieldValid && fastFail.value) break
      }
      return { valid: errors.value.length === 0, errors: [...errors.value] }
    },
    reset() {
      for (const field of fields.value) field.reset()
    },
    resetValidation() {
      for (const field of fields.value) field.resetValidation()
    },
    dispose() {
      fields.value = []
    },
    valid,
    validating,
    dirty,
    errors,
    validateOn,
    fastFail,
  }
}

export function useMcForm(): McFormInstance | null {
  const instance = getCurrentInstance()
  if (!instance) return null
  return inject(mcFormKey, null)
}
