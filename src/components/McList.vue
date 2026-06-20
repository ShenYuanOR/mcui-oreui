<script setup lang="ts">
import { playSound } from '../composables/useSound'
import McIcon from './McIcon.vue'
import McRadio from './McRadio.vue'
import McCheckbox from './McCheckbox.vue'

export type McListValue = string | number

export interface McListItem {
  label: string
  value: McListValue
  disabled?: boolean
  /** 左侧图标名称 */
  icon?: string
  /** 右侧图标名称 */
  iconRight?: string
  /** 该项的副标题说明 */
  subtitle?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: McListValue | McListValue[]
    items?: McListItem[]
    /** 左上角副标题 */
    subtitle?: string
    /** 选择模式：不设置则为纯展示列表，single（单选）| multiple（多选） */
    mode?: 'single' | 'multiple' | ''
    /** 单选模式下是否显示单选框指示器 */
    showRadio?: boolean
  }>(),
  { modelValue: '', items: () => [], subtitle: '', mode: '', showRadio: true },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: McListValue | McListValue[]): void
  (e: 'change', v: McListValue | McListValue[]): void
}>()

function isSelected(item: McListItem): boolean {
  if (!props.mode) return false
  if (props.mode === 'multiple') {
    return Array.isArray(props.modelValue) && props.modelValue.includes(item.value)
  }
  return item.value === props.modelValue
}

function handleSelect(item: McListItem) {
  if (item.disabled) return
  playSound('click')

  if (props.mode === 'multiple') {
    const arr: McListValue[] = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = arr.indexOf(item.value)
    if (idx >= 0) {
      arr.splice(idx, 1)
    } else {
      arr.push(item.value)
    }
    emit('update:modelValue', arr)
    emit('change', arr)
  } else {
    const val: McListValue = item.value
    emit('update:modelValue', val)
    emit('change', val)
  }
}
</script>

<template>
  <div class="mc-list">
    <div v-if="subtitle" class="mc-list__subtitle">{{ subtitle }}</div>
    <button
      v-for="item in items"
      :key="String(item.value)"
      class="mc-list__item"
      :class="{
        'mc-list__item--active': isSelected(item),
      }"
      :disabled="item.disabled"
      type="button"
      @click="handleSelect(item)"
    >
      <!-- 单选/多选指示器 -->
      <span v-if="mode && (mode === 'single' ? showRadio : true)" class="mc-list__item-indicator" @click.stop>
        <McRadio
          v-if="mode === 'single'"
          :model-value="(modelValue as McListValue)"
          :value="item.value"
          :disabled="item.disabled"
        />
        <McCheckbox
          v-if="mode === 'multiple'"
          :model-value="Array.isArray(modelValue) && modelValue.includes(item.value)"
          :disabled="item.disabled"
        />
      </span>

      <!-- 左侧自定义插槽 / 图标 -->
      <slot v-if="$slots['item-left']" name="item-left" :item="item" />
      <McIcon v-else-if="item.icon" :name="item.icon" class="mc-list__item-icon mc-list__item-icon--left" />

      <div class="mc-list__item-content">
        <span class="mc-list__item-label">{{ item.label }}</span>
        <span v-if="item.subtitle" class="mc-list__item-subtitle">{{ item.subtitle }}</span>
      </div>

      <!-- 右侧自定义插槽 / 图标 -->
      <slot v-if="$slots['item-right']" name="item-right" :item="item" />
      <McIcon v-else-if="item.iconRight" :name="item.iconRight" class="mc-list__item-icon mc-list__item-icon--right" />
    </button>
  </div>
</template>
