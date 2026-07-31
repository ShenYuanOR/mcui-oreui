<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, useSlots } from 'vue'
import { useMcLocale } from '../../framework/locale'
export type McStepperValue = string | number
export interface McStepperItem {
  title: string
  value: McStepperValue
  optional?: boolean
  editable?: boolean
  disabled?: boolean
}
const props = withDefaults(defineProps<{ items: McStepperItem[]; modelValue?: McStepperValue; linear?: boolean }>(), {
  modelValue: '',
  linear: false,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: McStepperValue): void
  (event: 'change', value: McStepperValue): void
}>()
const locale = useMcLocale()
const slots = useSlots()
const currentIndex = computed(() =>
  Math.max(
    0,
    props.items.findIndex((item) => Object.is(item.value, props.modelValue)),
  ),
)
const current = computed(() => props.items[currentIndex.value])
function canSelect(item: McStepperItem, index: number) {
  return !item.disabled && (!props.linear || item.editable || index <= currentIndex.value + 1)
}
function select(item: McStepperItem, index: number) {
  if (!canSelect(item, index)) return
  emit('update:modelValue', item.value)
  emit('change', item.value)
}
function next() {
  const item = props.items[currentIndex.value + 1]
  if (item) select(item, currentIndex.value + 1)
}
function previous() {
  const item = props.items[currentIndex.value - 1]
  if (item) select(item, currentIndex.value - 1)
}
</script>

<template>
  <div class="mc-stepper">
    <ol class="mc-stepper__header" :aria-label="locale.t('progress')">
      <li
        v-for="(item, index) in items"
        :key="String(item.value)"
        class="mc-stepper__step"
        :class="{
          'mc-stepper__step--active': index === currentIndex,
          'mc-stepper__step--complete': index < currentIndex,
        }"
      >
        <button
          type="button"
          :disabled="!canSelect(item, index)"
          :aria-current="index === currentIndex ? 'step' : undefined"
          @click="select(item, index)"
        >
          <span class="mc-stepper__number">{{ index + 1 }}</span
          ><span
            >{{ item.title }}<small v-if="item.optional">{{ locale.t('optional') }}</small></span
          >
        </button>
      </li>
    </ol>
    <div v-if="current" class="mc-stepper__content">
      <component
        :is="slots[`item.${String(current.value)}`]"
        v-if="slots[`item.${String(current.value)}`]"
        :item="current"
        :index="currentIndex"
      />
      <slot v-else :item="current" :index="currentIndex" />
    </div>
    <div class="mc-stepper__actions">
      <slot name="actions" :item="current" :index="currentIndex" :next="next" :previous="previous">
        <button type="button" :disabled="currentIndex <= 0" @click="previous">{{ locale.t('previous') }}</button
        ><button type="button" :disabled="currentIndex >= items.length - 1" @click="next">
          {{ locale.t('next') }}
        </button>
      </slot>
    </div>
  </div>
</template>
