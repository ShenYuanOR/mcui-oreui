<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, ref, useAttrs } from 'vue'
import McIcon from '../McIcon/McIcon.vue'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()

type Variant = 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
type SizePreset = 'small' | 'middle' | 'large' | 'x-large'

const SIZE_MAP: Record<SizePreset, number> = {
  small: 32,
  middle: 48,
  large: 64,
  'x-large': 96,
}

const props = withDefaults(
  defineProps<{
    /**
     * 头像尺寸。数字按 px；预设：'small'=32 / 'middle'=48 / 'large'=64 / 'x-large'=96
     */
    size?: number | SizePreset
    /**
     * 背景颜色（无图片时生效），支持预设名或 CSS 颜色值
     */
    color?: string
    /**
     * 视觉变体：
     * - elevated: 立体阴影（默认）
     * - flat: 实心扁平
     * - tonal: 浅色底
     * - outlined: 仅外边框
     * - text: 透明底仅文字
     * - plain: 极简无效果
     */
    variant?: Variant
    /**
     * 圆角。数字按 px；'50%' 为圆形。默认 0（正方形）
     */
    rounded?: number | string
    /**
     * 头像图片 URL，优先级高于 icon 和 text
     */
    src?: string
    /**
     * 图标名称（mc-xxx），无图片时展示
     */
    icon?: string
    /**
     * 文字内容（如首字母缩写），无图片和图标时展示
     */
    text?: string
    /**
     * 图片替代文本
     */
    alt?: string
  }>(),
  {
    size: 'middle',
    color: '',
    variant: 'elevated',
    rounded: '0',
    src: '',
    icon: '',
    text: '',
    alt: '',
  },
)

/** 解析后的像素尺寸 */
const computedSize = computed(() => {
  if (typeof props.size === 'number') return props.size
  return SIZE_MAP[props.size] ?? 48
})

/** 解析后的圆角值 */
const computedRadius = computed(() => {
  if (typeof props.rounded === 'number') return `${props.rounded}px`
  return props.rounded
})

/** 字号随尺寸缩放 */
const computedFontSize = computed(() => {
  const s = computedSize.value
  return s <= 32 ? '11px' : s <= 48 ? '14px' : s <= 64 ? '18px' : '24px'
})

/** 背景色 */
const computedBg = computed(() => {
  if (props.color) return props.color
  // 默认深灰背景
  return '#3C3C3C'
})

/** 文字色（深色底白字，浅色底黑字） */
const computedTextColor = computed(() => {
  const bg = computedBg.value
  if (!bg || bg === 'transparent') return '#D0D1D4'
  // 简单判断：hex 颜色明暗
  const hex = bg.replace('#', '')
  if (hex.length === 3) return '#FFFFFF'
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#000000' : '#FFFFFF'
})

/** 图片加载失败 */
const imgError = ref(false)

/** 有效图片（未出错 + 非空） */
const hasImage = computed(() => !!(props.src && !imgError.value))

function onImgError() {
  imgError.value = true
}
</script>

<template>
  <div
    v-bind="attrs"
    class="mc-avatar"
    :class="[
      `mc-avatar--${variant}`,
      { 'mc-avatar--clickable': !!attrs.onClick },
    ]"
    :style="{
      '--mc-avatar-size': computedSize + 'px',
      '--mc-avatar-radius': computedRadius,
      '--mc-avatar-bg': computedBg,
      '--mc-avatar-color': computedTextColor,
      '--mc-avatar-font-size': computedFontSize,
    }"
  >
    <!-- 图片模式 -->
    <img
      v-if="hasImage"
      :src="src"
      :alt="alt || ''"
      class="mc-avatar__img"
      @error="onImgError"
    />

    <!-- 图标模式（无图片），可通过 icon 插槽替换 -->
    <slot v-else-if="icon" name="icon">
      <McIcon
        :name="icon"
        :size="Math.round(computedSize * 0.55)"
        :color="computedTextColor"
        class="mc-avatar__icon"
      />
    </slot>

    <!-- 文字模式（无图片、无图标） -->
    <span
      v-else-if="text || $slots.default"
      class="mc-avatar__text"
    >
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>
