<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, ref, useAttrs } from 'vue'
import { useMcLocale } from '../../framework/locale'
defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: number
    length: number
    totalVisible?: number
    showFirstLast?: boolean
    disabled?: boolean
  }>(),
  { modelValue: 1, totalVisible: 7, showFirstLast: false, disabled: false },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
  (event: 'change', value: number): void
}>()
const locale = useMcLocale()
const root = ref<HTMLElement | null>(null)
const attrs = useAttrs()
const accessibleLabel = computed(() =>
  typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : locale.t('pagination'),
)
const page = computed(() => Math.max(1, Math.min(Math.trunc(props.modelValue), Math.max(1, props.length))))
const pages = computed<(number | 'ellipsis-start' | 'ellipsis-end')[]>(() => {
  const length = Math.max(0, props.length)
  const visible = Math.max(3, props.totalVisible)
  if (length <= visible) return Array.from({ length }, (_, index) => index + 1)
  const inner = visible - 2
  let start = Math.max(2, page.value - Math.floor(inner / 2))
  let end = Math.min(length - 1, start + inner - 1)
  start = Math.max(2, end - inner + 1)
  const result: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1]
  if (start > 2) result.push('ellipsis-start')
  for (let value = start; value <= end; value += 1) result.push(value)
  if (end < length - 1) result.push('ellipsis-end')
  result.push(length)
  return result
})
function select(value: number) {
  if (props.disabled || props.length < 1) return
  const next = Math.max(1, Math.min(value, props.length))
  if (next === page.value) return
  emit('update:modelValue', next)
  emit('change', next)
}
function onKeydown(event: KeyboardEvent) {
  const backward = locale.isRtl.value ? 'ArrowRight' : 'ArrowLeft'
  const forward = locale.isRtl.value ? 'ArrowLeft' : 'ArrowRight'
  if (event.key === backward) select(page.value - 1)
  else if (event.key === forward) select(page.value + 1)
  else if (event.key === 'Home') select(1)
  else if (event.key === 'End') select(props.length)
  else return
  event.preventDefault()
  root.value?.querySelector<HTMLElement>(`[data-page="${Math.max(1, Math.min(props.length, page.value))}"]`)?.focus()
}
</script>

<template>
  <nav v-bind="attrs" ref="root" class="mc-pagination" :aria-label="accessibleLabel" @keydown="onKeydown">
    <button
      v-if="showFirstLast"
      type="button"
      class="mc-pagination__button"
      :disabled="disabled || page <= 1"
      :aria-label="locale.t('first')"
      @click="select(1)"
    >
      «
    </button>
    <button
      type="button"
      class="mc-pagination__button"
      :disabled="disabled || page <= 1"
      :aria-label="locale.t('previous')"
      @click="select(page - 1)"
    >
      ‹
    </button>
    <template v-for="item in pages" :key="item">
      <span v-if="typeof item !== 'number'" class="mc-pagination__ellipsis" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        class="mc-pagination__button"
        :class="{ 'mc-pagination__button--active': item === page }"
        :data-page="item"
        :disabled="disabled"
        :aria-label="locale.t('page', { page: item })"
        :aria-current="item === page ? 'page' : undefined"
        @click="select(item)"
      >
        {{ item }}
      </button>
    </template>
    <button
      type="button"
      class="mc-pagination__button"
      :disabled="disabled || page >= length"
      :aria-label="locale.t('next')"
      @click="select(page + 1)"
    >
      ›
    </button>
    <button
      v-if="showFirstLast"
      type="button"
      class="mc-pagination__button"
      :disabled="disabled || page >= length"
      :aria-label="locale.t('last')"
      @click="select(length)"
    >
      »
    </button>
  </nav>
</template>
