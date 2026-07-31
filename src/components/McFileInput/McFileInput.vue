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
  }>(),
  {
    modelValue: null,
    multiple: false,
    capture: false,
    disabled: false,
    readonly: false,
    required: false,
    rules: () => [],
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: McFileInputValue): void
  (event: 'change', value: McFileInputValue): void
}>()
defineOptions({ inheritAttrs: false })
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const locale = useMcLocale()
const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const files = computed(() =>
  props.modelValue ? (Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]) : [],
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
  const value: McFileInputValue = props.multiple ? accepted : (accepted[0] ?? null)
  emit('update:modelValue', value)
  emit('change', value)
}
function onInput(event: Event) {
  update(Array.from((event.target as HTMLInputElement).files ?? []))
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
    :error="validation.errorMessages.value"
    :required="required"
    :disabled="disabled"
  >
    <template #default="field">
      <div
        class="mc-file-input"
        :class="{ 'mc-file-input--dragging': dragging, 'mc-file-input--disabled': disabled }"
        :aria-disabled="disabled || undefined"
        :aria-readonly="readonly || undefined"
        :aria-describedby="[field.descriptionId, field.messageId].filter(Boolean).join(' ') || undefined"
        @dragenter.prevent="dragging = true"
        @dragover.prevent
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <input
          v-bind="controlAttrs"
          :id="field.id"
          ref="input"
          class="mc-visually-hidden"
          type="file"
          :multiple="multiple"
          :accept="accept || undefined"
          :capture="capture || undefined"
          :disabled="disabled || readonly"
          :required="required"
          @change="onInput"
          @blur="validation.onBlur"
        />
        <label class="mc-file-input__prompt" :for="field.id">{{ locale.t('fileDrop') }}</label>
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
