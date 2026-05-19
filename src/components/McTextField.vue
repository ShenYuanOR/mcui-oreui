<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

type FilterType = 'text' | 'all' | 'number' | 'letter' | 'operator' | 'base' | 'none'

const props = withDefaults(
  defineProps<{
    /** 输入内容（v-model） */
    modelValue?: string
    /** 字符过滤类型 */
    type?: FilterType
    /** 单行（禁止回车换行） */
    singleLine?: boolean
    /** 最大字符数（0 表示不限） */
    maxLength?: number
    /** 占位提示 */
    hint?: string
    /** 是否禁用 */
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    singleLine: true,
    maxLength: 0,
    hint: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'change', v: string): void
  (e: 'invalid-input'): void
}>()

const input = ref<HTMLTextAreaElement | null>(null)
const composing = ref(false)
const focused = ref(false)

const hintVisible = ref(true)
function refreshHint() {
  hintVisible.value = props.modelValue.length === 0 && (!focused.value || props.disabled)
}

// 移植自原 isValidAndFilterInput
function filterValue(value: string): { valid: boolean; filtered: string } {
  const t = props.type
  if (t === 'text' || t === 'all' || !t) return { valid: true, filtered: value }
  if (!value) return { valid: true, filtered: value }
  let regex: RegExp
  let filtered: string
  switch (t) {
    case 'number':
      regex = /^[0-9]*$/
      filtered = value.replace(/[^0-9]/g, '')
      break
    case 'letter':
      regex = /^[a-zA-Z]*$/
      filtered = value.replace(/[^a-zA-Z]/g, '')
      break
    case 'operator':
      regex = /^[`!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]*$/
      filtered = value.replace(/[^`!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]/g, '')
      break
    case 'base':
      regex = /^[0-9a-zA-Z `!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]*$/
      filtered = value.replace(/[^0-9a-zA-Z `!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?~]/g, '')
      break
    case 'none':
      return { valid: value.length === 0, filtered: '' }
    default:
      return { valid: true, filtered: value }
  }
  return { valid: regex.test(value), filtered }
}

function autoResize() {
  const el = input.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function commit(raw: string) {
  let next = raw
  if (props.maxLength > 0 && next.length > props.maxLength) {
    next = next.slice(0, props.maxLength)
  }
  const { valid, filtered } = filterValue(next)
  if (!valid) {
    next = filtered
    emit('invalid-input')
  }
  if (next !== props.modelValue) {
    emit('update:modelValue', next)
    emit('change', next)
  } else if (input.value && input.value.value !== next) {
    input.value.value = next
  }
  nextTick(autoResize)
}

function onInput(e: Event) {
  if (composing.value) return
  commit((e.target as HTMLTextAreaElement).value)
}

function onCompositionEnd(e: CompositionEvent) {
  composing.value = false
  commit((e.target as HTMLTextAreaElement).value)
}

function onKeydown(e: KeyboardEvent) {
  if (props.singleLine && e.key === 'Enter') e.preventDefault()
}

function onFocus() {
  focused.value = true
  refreshHint()
}
function onBlur() {
  focused.value = false
  refreshHint()
}

watch(() => props.modelValue, () => {
  refreshHint()
  nextTick(autoResize)
})

onMounted(() => {
  refreshHint()
  autoResize()
})
</script>

<template>
  <text-field :class="{ disabled_text_field: disabled }">
    <textarea
      ref="input"
      class="input"
      rows="1"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
      @compositionstart="composing = true"
      @compositionend="onCompositionEnd"
    ></textarea>
    <div class="hint" :style="{ opacity: hintVisible ? 1 : 0 }">{{ hint }}</div>
  </text-field>
</template>
