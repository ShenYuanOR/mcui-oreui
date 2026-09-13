<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McIcon from '../McIcon'

defineOptions({ inheritAttrs: false })

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
    size?: number | SizePreset
    color?: string
    variant?: Variant
    rounded?: number | string
    src?: string
    icon?: string
    text?: string
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

const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const clickable = computed(() => Boolean(getCurrentInstance()?.vnode.props?.onClick))
const computedSize = computed(() => {
  if (typeof props.size === 'number') return Number.isFinite(props.size) ? Math.max(0, props.size) : 48
  return SIZE_MAP[props.size] ?? 48
})
const computedRadius = computed(() => {
  if (typeof props.rounded === 'number') return `${props.rounded}px`
  if (/^\d+(\.\d+)?$/.test(String(props.rounded).trim())) return `${String(props.rounded).trim()}px`
  return String(props.rounded)
})
const computedFontSize = computed(() => {
  const size = computedSize.value
  return size <= 32 ? '11px' : size <= 48 ? '14px' : size <= 64 ? '18px' : '24px'
})
const computedBg = computed(() => props.color || 'var(--mc-surface-pressed, #3c3c3c)')
const computedTextColor = computed(() => {
  const background = props.color
  if (!background || background === 'transparent') return 'var(--mc-text, #d0d1d4)'
  const hex = background.replace('#', '')
  if (!/^[0-9a-f]{3}$/i.test(hex) && !/^[0-9a-f]{6}$/i.test(hex)) return 'var(--mc-text, #fff)'
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((part) => `${part}${part}`)
          .join('')
      : hex
  const red = parseInt(normalized.slice(0, 2), 16)
  const green = parseInt(normalized.slice(2, 4), 16)
  const blue = parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255
  return luminance > 0.6 ? '#000000' : '#ffffff'
})
const imgError = ref(false)
const hasImage = computed(() => Boolean(props.src && !imgError.value))

watch(
  () => props.src,
  () => {
    imgError.value = false
  },
)

function onImgError() {
  imgError.value = true
}
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="mc-avatar"
    :class="[`mc-avatar--${variant}`, { 'mc-avatar--clickable': clickable }]"
    :style="{
      '--mc-avatar-size': `${computedSize}px`,
      '--mc-avatar-radius': computedRadius,
      '--mc-avatar-bg': computedBg,
      '--mc-avatar-color': computedTextColor,
      '--mc-avatar-font-size': computedFontSize,
    }"
  >
    <img v-if="hasImage" v-bind="controlAttrs" :src="src" :alt="alt || ''" class="mc-avatar__img" @error="onImgError" />
    <slot v-else-if="icon" name="icon">
      <McIcon :name="icon" :size="Math.round(computedSize * 0.55)" :color="computedTextColor" class="mc-avatar__icon" />
    </slot>
    <span v-else-if="text || $slots.default" class="mc-avatar__text">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>
