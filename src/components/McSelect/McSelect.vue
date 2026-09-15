<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, mergeProps, nextTick, ref, useId, watch } from 'vue'
import { useSound } from '../../composables/useSound'
import { useMcValidation } from '../../composables/validation'
import type { McRule } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'
import { useMcLocale } from '../../framework/locale'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McFormField from '../McFormField'
import McOverlay from '../McOverlay'
import { normalizeSelectOption, type McSelectOptionInput, type McSelectValue } from '../_shared/selectTypes'

const { playSound } = useSound()

const props = withDefaults(
  defineProps<{
    modelValue?: McSelectValue
    options?: McSelectOptionInput[]
    label?: string
    description?: string
    hint?: string
    errorMessages?: string | string[]
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    rules?: McRule<McSelectValue>[]
    validateOn?: McValidateOn
    id?: string
  }>(),
  { modelValue: null, options: () => [], disabled: false, readonly: false, required: false, rules: () => [] },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: McSelectValue): void
  (event: 'change', value: McSelectValue): void
}>()
defineOptions({ inheritAttrs: false })
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const locale = useMcLocale()
const generatedId = useId()
const trigger = ref<HTMLButtonElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)
const items = computed(() => props.options.map(normalizeSelectOption))
const selectedIndex = computed(() => items.value.findIndex((item) => Object.is(item.value, props.modelValue)))
const selected = computed(() => items.value[selectedIndex.value])
const listboxId = computed(() => `${props.id || generatedId}-listbox`)
function firstEnabled(from: number, direction: 1 | -1) {
  if (!items.value.length) return -1
  let index = from
  for (let count = 0; count < items.value.length; count += 1) {
    index = (index + direction + items.value.length) % items.value.length
    if (!items.value[index].disabled) return index
  }
  return -1
}
function setOpen(value: boolean) {
  if (value && (props.disabled || props.readonly)) return
  if (open.value === value) return
  open.value = value
  activeIndex.value = value ? (selectedIndex.value >= 0 ? selectedIndex.value : firstEnabled(-1, 1)) : -1
  if (value) playSound('click')
}
function select(index: number) {
  const item = items.value[index]
  if (!item || item.disabled) return
  emit('update:modelValue', item.value)
  emit('change', item.value)
  playSound('click')
  setOpen(false)
  nextTick(() => trigger.value?.focus())
}
function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  if (!open.value && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    setOpen(true)
    return
  }
  if (!open.value) return
  if (event.key === 'Escape') setOpen(false)
  else if (event.key === 'Home') activeIndex.value = firstEnabled(-1, 1)
  else if (event.key === 'End') activeIndex.value = firstEnabled(items.value.length, -1)
  else if (event.key === 'ArrowDown') activeIndex.value = firstEnabled(activeIndex.value, 1)
  else if (event.key === 'ArrowUp') activeIndex.value = firstEnabled(activeIndex.value, -1)
  else if ((event.key === 'Enter' || event.key === ' ') && activeIndex.value >= 0) select(activeIndex.value)
  else return
  event.preventDefault()
}
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) setOpen(false)
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
const fieldError = computed(() => validation.errorMessage.value)
defineExpose({ ...validation, open, close: () => setOpen(false) })
</script>

<template>
  <mc-form-field
    v-bind="rootAttrs"
    :id="id || validation.id"
    :label="label"
    :description="description"
    :hint="hint"
    :error="fieldError"
    :required="required"
    :disabled="disabled"
  >
    <template #default="field">
      <mc-overlay
        :model-value="open"
        location-strategy="connected"
        location="bottom start"
        :offset="4"
        match-width
        :scrim="false"
        scroll-strategy="reposition"
        focus-strategy="none"
        @update:model-value="setOpen"
      >
        <template #activator="{ props: activatorProps }">
          <button
            v-bind="mergeProps(controlAttrs, activatorProps)"
            :id="field.id"
            ref="trigger"
            type="button"
            class="mc-select__trigger"
            role="combobox"
            aria-haspopup="listbox"
            :aria-expanded="open"
            :aria-controls="listboxId"
            :aria-activedescendant="open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined"
            :aria-invalid="Boolean(fieldError)"
            :aria-describedby="[field.descriptionId, field.messageId].filter(Boolean).join(' ') || undefined"
            :disabled="disabled"
            :aria-readonly="readonly || undefined"
            @keydown="onKeydown"
            @blur="validation.onBlur"
          >
            <span :class="{ 'mc-select__placeholder': !selected }">{{
              selected?.title ?? (placeholder || locale.t('open'))
            }}</span>
            <span class="mc-select__chevron" aria-hidden="true">▾</span>
          </button>
        </template>
        <ul :id="listboxId" class="mc-select__list" role="listbox" :aria-labelledby="field.id">
          <li v-if="!items.length" class="mc-select__empty" role="presentation">{{ locale.t('noOptions') }}</li>
          <li
            v-for="(item, index) in items"
            :id="`${listboxId}-option-${index}`"
            :key="`${String(item.value)}-${index}`"
            class="mc-select__option"
            :class="{
              'mc-select__option--active': index === activeIndex,
              'mc-select__option--selected': index === selectedIndex,
            }"
            role="option"
            :aria-selected="index === selectedIndex"
            :aria-disabled="item.disabled || undefined"
            @mouseenter="!item.disabled && (activeIndex = index)"
            @mousedown.prevent
            @click="select(index)"
          >
            <slot name="option" :option="item" :selected="index === selectedIndex">{{ item.title }}</slot>
          </li>
        </ul>
      </mc-overlay>
    </template>
  </mc-form-field>
</template>
