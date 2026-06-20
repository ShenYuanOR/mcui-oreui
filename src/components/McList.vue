<script setup lang="ts">
import { playSound } from '../composables/useSound'
import McIcon from './McIcon.vue'

export type McListValue = string | number

export interface McListItem {
  label: string
  value: McListValue
  disabled?: boolean
  /** 左侧图标名称 */
  icon?: string
  /** 右侧图标名称 */
  iconRight?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: McListValue
    items?: McListItem[]
    /** 左上角副标题 */
    subtitle?: string
  }>(),
  { modelValue: '', items: () => [], subtitle: '' },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: McListValue): void
}>()

function select(item: McListItem) {
  if (item.disabled) return
  playSound('click')
  emit('update:modelValue', item.value)
}
</script>

<template>
  <div class="mc-list">
    <div v-if="subtitle" class="mc-list__subtitle">{{ subtitle }}</div>
    <button
      v-for="item in items"
      :key="String(item.value)"
      class="mc-list__item"
      :class="{ 'mc-list__item--active': item.value === modelValue }"
      :disabled="item.disabled"
      type="button"
      @click="select(item)"
    >
      <McIcon v-if="item.icon" :name="item.icon" class="mc-list__item-icon mc-list__item-icon--left" />
      <span class="mc-list__item-label">{{ item.label }}</span>
      <McIcon v-if="item.iconRight" :name="item.iconRight" class="mc-list__item-icon mc-list__item-icon--right" />
    </button>
  </div>
</template>
