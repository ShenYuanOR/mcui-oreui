<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { getMcIcon } from '../utils/iconRegistry'

const props = withDefaults(
  defineProps<{
    /** 图标名称：普通 mc-xxx，按键 mc-key-xxx，彩色 mc-x-xxx */
    name?: string
    /** 图标尺寸：数字按 px；字符串可传 24px / 2em 等 */
    size?: number | string
    /** 普通图标颜色；按键和彩色图标保持原色，不受此属性影响 */
    color?: string
    /** 可访问性标签；不传则作为装饰图标隐藏给读屏器 */
    label?: string
  }>(),
  { name: '', size: 24, color: '', label: '' },
)

const slots = useSlots()

const iconName = computed(() => {
  if (props.name) return props.name.trim()
  const text = slots.default?.().map((node) => String(node.children ?? '')).join('').trim()
  return text ?? ''
})

const icon = computed(() => getMcIcon(iconName.value))
const isColorable = computed(() => icon.value?.colorable ?? false)
const renderedSvg = computed(() => icon.value?.svg ?? '')

const iconSize = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const iconStyle = computed(() => ({
  '--mc-icon-size': iconSize.value,
  '--mc-icon-color': isColorable.value && props.color ? props.color : undefined,
}))
const ariaHidden = computed(() => (props.label ? undefined : 'true'))
</script>

<template>
  <span
    class="mc-icon"
    :class="{
      'mc-icon--missing': !icon,
      'mc-icon--normal': icon?.type === 'normal',
      'mc-icon--key': icon?.type === 'key',
      'mc-icon--x': icon?.type === 'x',
      'mc-icon--colorable': isColorable,
    }"
    :style="iconStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="ariaHidden"
    v-html="renderedSvg"
  />
</template>
