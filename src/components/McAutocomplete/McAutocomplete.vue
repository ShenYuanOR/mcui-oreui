<script setup lang="ts">
import '../../styles/component-core.css'
import '../../styles/shared/input-control.css'
import './style.css'
import { computed, ref, useId, watch } from 'vue'
import { useMcValidation } from '../../composables/validation'
import { useSound } from '../../composables/useSound'
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
    noFilter?: boolean
  }>(),
  {
    modelValue: null,
    options: () => [],
    disabled: false,
    readonly: false,
    required: false,
    rules: () => [],
    noFilter: false,
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: McSelectValue): void
  (event: 'change', value: McSelectValue): void
  (event: 'update:search', value: string): void
}>()
defineOptions({ inheritAttrs: false })
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const locale = useMcLocale()
const generatedId = useId()
const query = ref('')
const open = ref(false)
const activeIndex = ref(-1)
const items = computed(() => props.options.map(normalizeSelectOption))
const selected = computed(() => items.value.find((item) => Object.is(item.value, props.modelValue)))
const filteredItems = computed(() => {
  if (props.noFilter || !query.value) return items.value
  const search = query.value.toLocaleLowerCase()
  return items.value.filter((item) => item.title.toLocaleLowerCase().includes(search))
})
const listboxId = computed(() => `${props.id || generatedId}-listbox`)
function firstEnabled(from: number, direction: 1 | -1) {
  if (!filteredItems.value.length) return -1
  let index = from
  for (let count = 0; count < filteredItems.value.length; count += 1) {
    index = (index + direction + filteredItems.value.length) % filteredItems.value.length
    if (!filteredItems.value[index].disabled) return index
  }
  return -1
}
function setOpen(value: boolean) {
  if (value && (props.disabled || props.readonly)) return
  if (open.value === value) return
  open.value = value
  if (value) {
    const selectedIndex = filteredItems.value.findIndex(
      (item) => Object.is(item.value, props.modelValue) && !item.disabled,
    )
    activeIndex.value = selectedIndex >= 0 ? selectedIndex : firstEnabled(-1, 1)
  } else activeIndex.value = -1
}
function updateQuery(value: string) {
  query.value = value
  emit('update:search', value)
  setOpen(true)
  activeIndex.value = firstEnabled(-1, 1)
}
function select(index: number) {
  const item = filteredItems.value[index]
  if (!item || item.disabled) return
  query.value = item.title
  emit('update:search', item.title)
  emit('update:modelValue', item.value)
  emit('change', item.value)
  playSound('click')
  setOpen(false)
}
function restoreSelectedTitle() {
  query.value = selected.value?.title ?? ''
  emit('update:search', query.value)
}
function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!open.value) setOpen(true)
    else activeIndex.value = firstEnabled(activeIndex.value, event.key === 'ArrowDown' ? 1 : -1)
    return
  }
  if (!open.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    setOpen(false)
    restoreSelectedTitle()
  } else if (event.key === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault()
    select(activeIndex.value)
  } else if (event.key === 'Home') {
    event.preventDefault()
    activeIndex.value = firstEnabled(-1, 1)
  } else if (event.key === 'End') {
    event.preventDefault()
    activeIndex.value = firstEnabled(filteredItems.value.length, -1)
  } else if (event.key === 'Tab') setOpen(false)
}
watch(
  selected,
  (item) => {
    if (!open.value) query.value = item?.title ?? ''
  },
  { immediate: true },
)
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
defineExpose({ ...validation, open, close: () => setOpen(false), search: query })
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
        <template #activator="{ open: openOverlay }">
          <input
            v-bind="controlAttrs"
            :id="field.id"
            class="mc-input mc-autocomplete__input"
            type="text"
            role="combobox"
            autocomplete="off"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            :aria-expanded="open"
            :aria-controls="listboxId"
            :aria-activedescendant="open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined"
            :aria-invalid="Boolean(fieldError)"
            :aria-describedby="[field.descriptionId, field.messageId].filter(Boolean).join(' ') || undefined"
            :value="query"
            :placeholder="placeholder || locale.t('search')"
            :disabled="disabled"
            :readonly="readonly"
            @input="updateQuery(($event.target as HTMLInputElement).value)"
            @focus="openOverlay($event)"
            @keydown="onKeydown"
            @blur="validation.onBlur"
          />
        </template>
        <ul
          v-if="filteredItems.length"
          :id="listboxId"
          class="mc-autocomplete__list"
          role="listbox"
          :aria-labelledby="field.id"
        >
          <li
            v-for="(item, index) in filteredItems"
            :id="`${listboxId}-option-${index}`"
            :key="`${String(item.value)}-${index}`"
            class="mc-autocomplete__option"
            :class="{
              'mc-autocomplete__option--active': index === activeIndex,
              'mc-autocomplete__option--selected': Object.is(item.value, modelValue),
            }"
            role="option"
            :aria-selected="Object.is(item.value, modelValue)"
            :aria-disabled="item.disabled || undefined"
            @mouseenter="!item.disabled && (activeIndex = index)"
            @mousedown.prevent
            @click="select(index)"
          >
            <slot name="option" :option="item" :selected="Object.is(item.value, modelValue)">{{ item.title }}</slot>
          </li>
        </ul>
        <div v-else class="mc-autocomplete__empty" role="status">{{ locale.t('noMatches') }}</div>
      </mc-overlay>
    </template>
  </mc-form-field>
</template>
