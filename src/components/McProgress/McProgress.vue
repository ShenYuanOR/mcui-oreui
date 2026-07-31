<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'
import { useMcRoutedAttrs } from '../../utils/attrs'

export type McProgressVariant = 'normal' | 'success' | 'error'
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** 当前进度值 */
    value?: number
    /** 最大值 */
    max?: number
    /** 左侧说明文本 */
    label?: string
    /** 是否显示百分比 */
    showValue?: boolean
    /** 不确定进度 */
    indeterminate?: boolean
    /** 语义状态 */
    variant?: McProgressVariant
    /** 自定义进度条颜色，设置后 variant 颜色失效 */
    color?: string
  }>(),
  { value: 0, max: 100, showValue: true, indeterminate: false, variant: 'normal' },
)

const percent = computed(() => {
  if (props.indeterminate) return 100
  const max = Number.isFinite(props.max) && props.max > 0 ? props.max : 100
  const raw = (props.value / max) * 100
  return Math.max(0, Math.min(raw, 100))
})

const percentText = computed(() => `${Math.round(percent.value)}%`)

const barStyle = computed(() => (props.color ? { '--mc-progress-color': props.color } : undefined))
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="mc-progress"
    :class="[`mc-progress--${variant}`, { 'mc-progress--indeterminate': indeterminate, 'mc-progress--custom': color }]"
  >
    <div v-if="label || showValue" class="mc-progress__header">
      <span class="mc-progress__label">{{ label }}</span>
      <span v-if="showValue" class="mc-progress__value">{{ indeterminate ? '...' : percentText }}</span>
    </div>
    <div
      v-bind="controlAttrs"
      class="mc-progress__track"
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="indeterminate ? undefined : value"
      :aria-label="controlAttrs['aria-label'] || label || 'progress'"
    >
      <div class="mc-progress__bar" :style="[{ width: percent + '%' }, barStyle]"></div>
    </div>
  </div>
</template>
