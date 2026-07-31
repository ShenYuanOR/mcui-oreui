<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, nextTick, ref, useId } from 'vue'
import { useSound } from '../../composables/useSound'

const { playSound } = useSound()

export type McTabValue = string | number
export interface McTabItem {
  label: string
  value: McTabValue
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: McTabValue
    items?: McTabItem[]
    direction?: 'horizontal' | 'vertical'
    activation?: 'automatic' | 'manual'
  }>(),
  { modelValue: '', items: () => [], direction: 'horizontal', activation: 'automatic' },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: McTabValue): void
  (event: 'change', value: McTabValue): void
}>()
const baseId = useId()
const tabs = ref<HTMLButtonElement[]>([])
const activeIndex = computed(() => {
  const selected = props.items.findIndex((item) => item.value === props.modelValue && !item.disabled)
  return selected >= 0 ? selected : props.items.findIndex((item) => !item.disabled)
})
function select(index: number) {
  const item = props.items[index]
  if (!item || item.disabled || item.value === props.modelValue) return
  playSound('click')
  emit('update:modelValue', item.value)
  emit('change', item.value)
}
function nextEnabled(start: number, step: 1 | -1) {
  let index = start
  for (let count = 0; count < props.items.length; count += 1) {
    index = (index + step + props.items.length) % props.items.length
    if (!props.items[index].disabled) return index
  }
  return start
}
async function focus(index: number) {
  await nextTick()
  tabs.value[index]?.focus()
  if (props.activation === 'automatic') select(index)
}
function keydown(event: KeyboardEvent, index: number) {
  const previous = props.direction === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const next = props.direction === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  let target = index
  if (event.key === previous) target = nextEnabled(index, -1)
  else if (event.key === next) target = nextEnabled(index, 1)
  else if (event.key === 'Home') target = nextEnabled(-1, 1)
  else if (event.key === 'End') target = nextEnabled(props.items.length, -1)
  else if ((event.key === 'Enter' || event.key === ' ') && props.activation === 'manual') select(index)
  else return
  event.preventDefault()
  void focus(target)
}
</script>

<template>
  <div class="mc-tabs" :class="`mc-tabs--${direction}`">
    <div class="mc-tabs__nav" role="tablist" :aria-orientation="direction">
      <button
        v-for="(item, index) in items"
        :id="`${baseId}-tab-${index}`"
        :key="String(item.value)"
        :ref="
          (element) => {
            if (element) tabs[index] = element as HTMLButtonElement
          }
        "
        class="mc-tabs__tab"
        :class="{ 'mc-tabs__tab--active': index === activeIndex }"
        type="button"
        role="tab"
        :aria-selected="index === activeIndex"
        :aria-controls="`${baseId}-panel-${index}`"
        :disabled="item.disabled"
        :tabindex="index === activeIndex ? 0 : -1"
        @click="select(index)"
        @keydown="keydown($event, index)"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-for="(item, index) in items"
      :id="`${baseId}-panel-${index}`"
      :key="`${String(item.value)}-panel`"
      class="mc-tabs__panel"
      role="tabpanel"
      :aria-labelledby="`${baseId}-tab-${index}`"
      :hidden="index !== activeIndex"
      :tabindex="index === activeIndex ? 0 : -1"
    >
      <slot v-if="index === activeIndex" :active="item.value" :item="item" />
    </div>
  </div>
</template>
