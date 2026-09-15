<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, ref } from 'vue'
import { useMcValidation } from '../../composables/validation'
import type { McRule } from '../../framework/form'
import type { McValidateOn } from '../../framework/types'
import { useMcLocale } from '../../framework/locale'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McFormField from '../McFormField'

export type McFileInputValue = File | File[] | null
const props = withDefaults(
  defineProps<{
    modelValue?: McFileInputValue
    multiple?: boolean
    accept?: string
    capture?: boolean | 'user' | 'environment'
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    label?: string
    hint?: string
    description?: string
    id?: string
    rules?: McRule<McFileInputValue>[]
    errorMessages?: string | string[]
    validateOn?: McValidateOn
    variant?: 'dropzone' | 'compact' | 'button'
  }>(),
  {
    modelValue: null,
    multiple: false,
    capture: false,
    disabled: false,
    readonly: false,
    required: false,
    variant: 'dropzone',
    rules: () => [],
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: McFileInputValue): void
  (event: 'change', value: McFileInputValue): void
}>()
defineOptions({ inheritAttrs: false })
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const surfaceAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(controlAttrs.value).filter(([name]) => name === 'title' || name.startsWith('aria-')),
  ),
)
const locale = useMcLocale()
const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const fileTypeError = ref('')
const files = computed(() =>
  props.modelValue ? (Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]) : [],
)
const validation = useMcValidation({
  id: props.id,
  value: () => props.modelValue,
  rules: () => [...(props.rules ?? []), acceptRule],
  required: () => props.required,
  disabled: () => props.disabled,
  errorMessages: () => props.errorMessages,
  validateOn: () => props.validateOn,
  emitReset: (value) => {
    fileTypeError.value = ''
    emit('update:modelValue', value)
  },
})
function acceptRule(value: McFileInputValue) {
  if (fileTypeError.value) return fileTypeError.value
  const current = value ? (Array.isArray(value) ? value : [value]) : []
  if (props.accept && current.some((file) => !accepts(file))) {
    return locale.t('invalid')
  }
  return true
}
function accepts(file: File) {
  if (!props.accept) return true
  return props.accept
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .some((pattern) =>
      pattern.startsWith('.')
        ? file.name.toLowerCase().endsWith(pattern)
        : pattern.endsWith('/*')
          ? file.type.startsWith(pattern.slice(0, -1))
          : file.type === pattern,
    )
}
function update(nextFiles: File[]) {
  const accepted = nextFiles.filter(accepts)
  fileTypeError.value = accepted.length !== nextFiles.length ? locale.t('fileType', { accept: props.accept || '' }) : ''
  const value: McFileInputValue = props.multiple ? accepted : (accepted[0] ?? null)
  emit('update:modelValue', value)
  emit('change', value)
  void validation.validate()
}
function onInput(event: Event) {
  update(Array.from((event.target as HTMLInputElement).files ?? []))
}
function setDragging(value: boolean) {
  if (props.disabled || props.readonly) return
  dragging.value = value
}
function onDrop(event: DragEvent) {
  dragging.value = false
  if (props.disabled || props.readonly) return
  update(Array.from(event.dataTransfer?.files ?? []))
}
function browse() {
  if (!props.disabled && !props.readonly) input.value?.click()
}
function clear() {
  if (props.disabled || props.readonly) return
  if (input.value) input.value.value = ''
  update([])
}
function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 ** 2) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 ** 2).toFixed(1)} MB`
}
defineExpose({ ...validation, browse, clear })
</script>

<template>
  <mc-form-field
    v-bind="rootAttrs"
    :id="id || validation.id"
    :label="label"
    :description="description"
    :hint="hint"
    :error="fileTypeError || validation.errorMessage.value"
    :required="required"
    :disabled="disabled"
  >
    <template #default="field">
      <div
        class="mc-file-input"
        :class="[
          `mc-file-input--${variant}`,
          { 'mc-file-input--dragging': dragging, 'mc-file-input--disabled': disabled },
        ]"
        @dragenter.prevent="setDragging(true)"
        @dragover.prevent
        @dragleave.prevent="setDragging(false)"
        @drop.prevent="onDrop"
      >
        <input
          v-bind="controlAttrs"
          :id="`${field.id}-input`"
          ref="input"
          class="mc-visually-hidden"
          type="file"
          tabindex="-1"
          aria-hidden="true"
          :multiple="multiple"
          :accept="accept || undefined"
          :capture="capture || undefined"
          :disabled="disabled || readonly"
          :required="required"
          @change="onInput"
        />
        <button
          v-bind="surfaceAttrs"
          :id="field.id"
          type="button"
          class="mc-file-input__surface"
          :disabled="disabled || readonly"
          :aria-disabled="disabled || undefined"
          :aria-readonly="readonly || undefined"
          :aria-required="required || undefined"
          :aria-labelledby="surfaceAttrs['aria-label'] ? undefined : `${field.id}-prompt`"
          :aria-describedby="[field.descriptionId, field.messageId].filter(Boolean).join(' ') || undefined"
          @click="browse"
          @blur="validation.onBlur"
        />
        <span :id="`${field.id}-prompt`" class="mc-file-input__prompt">{{ locale.t('fileDrop') }}</span>
        <ul v-if="files.length" class="mc-file-input__files">
          <li v-for="(file, index) in files" :key="`${file.name}-${file.size}-${index}`">
            {{ file.name }} <span>{{ formatSize(file.size) }}</span>
          </li>
        </ul>
        <button
          v-if="files.length"
          type="button"
          class="mc-file-input__clear"
          :disabled="disabled || readonly"
          :aria-label="locale.t('clearFiles')"
          @click.stop="clear"
        >
          ×
        </button>
      </div>
    </template>
  </mc-form-field>
</template>
