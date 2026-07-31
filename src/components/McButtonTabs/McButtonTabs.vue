<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'
import McButton from '../McButton'

export type McTabValue = string | number

export interface McButtonTabItem {
  label: string
  value: McTabValue
  disabled?: boolean
  /** 自定义背景色（如 #ff6b35），传递给内部 McButton */
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** 当前激活项 v-model */
    modelValue?: McTabValue
    /** 标签项 */
    items?: McButtonTabItem[]
    /** 左上角标题 */
    title?: string
  }>(),
  { modelValue: '', items: () => [] },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: McTabValue): void
  (e: 'change', v: McTabValue): void
}>()

const activeValue = computed(() => props.modelValue || props.items.find((item) => !item.disabled)?.value || '')

function select(item: McButtonTabItem) {
  if (item.disabled || item.value === activeValue.value) return
  emit('update:modelValue', item.value)
  emit('change', item.value)
}
</script>

<template>
  <div class="mc-button-tabs">
    <div class="mc-button-tabs__header">
      <span v-if="title" class="mc-button-tabs__title">{{ title }}</span>
      <div class="mc-button-tabs__nav">
        <mc-button
          v-for="item in items"
          :key="String(item.value)"
          class="mc-button-tabs__tab"
          :class="{
            'mc-button-tabs__tab--active': item.value === activeValue,
            'mc-button-tabs__tab--custom': !!item.color,
          }"
          :style="item.color ? { '--mc-tab-custom-bg': item.color } : {}"
          :disabled="item.disabled"
          :color="item.color"
          @click="select(item)"
        >
          <span class="mc-button-tabs__label">{{ item.label }}</span>
        </mc-button>
      </div>
    </div>
    <div class="mc-button-tabs__panel">
      <slot :active="activeValue" />
    </div>
  </div>
</template>
