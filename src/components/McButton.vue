<script setup lang="ts">
import { computed, ref } from 'vue'
import { playSoundType } from '../composables/useSound'
import McIcon from './McIcon.vue'

type Variant = 'normal' | 'primary' | 'error'
type Size = 'extra_small' | 'small' | 'middle' | 'large'

const props = withDefaults(
  defineProps<{
    /** 颜色/语义：normal 默认 / primary 主操作 / error 危险 */
    variant?: Variant
    /** 尺寸 */
    size?: Size
    /** 是否禁用 */
    disabled?: boolean
    /** 按钮左侧图标名称 */
    icon?: string
    /** Tooltip 文本（非空则显示） */
    tip?: string
    /** 自定义背景色（如 #ff6b35），设置后覆盖 variant 的背景色 */
    bgcolor?: string
  }>(),
  { variant: 'normal', size: 'middle', disabled: false, icon: '', tip: '', bgcolor: '' },
)

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

const statusClass = computed(() => (props.disabled ? 'disabled' : props.variant))
const isHovered = ref(false)

/** 自定义颜色时的动态样式（含 hover 变暗效果） */
const btnCustomStyle = computed(() => {
  if (!props.bgcolor) return {}
  const baseShadow = isHovered.value ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.35)'
  const hl = isHovered.value ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'
  const hl2 = isHovered.value ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'
  return {
    backgroundColor: props.bgcolor,
    boxShadow: `inset 0 -4px ${baseShadow}, inset 3px 3px ${hl}, inset -3px -7px ${hl2}`,
    paddingBottom: '6px',
  }
})

function onClick(ev: MouseEvent) {
  if (props.disabled) return
  playSoundType(props.variant)
  emit('click', ev)
}
</script>

<template>
  <div v-if="tip" class="btn_with_tooltip_content">
    <button
      class="btn"
      :class="[`${size}_btn`, `${statusClass}_btn`]"
      :style="btnCustomStyle"
      :disabled="disabled"
      @click="onClick"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <McIcon v-if="icon" :name="icon" class="btn_icon" />
      <slot />
    </button>
    <div class="btn_tooltip mc-tooltip__content">{{ tip }}</div>
  </div>
  <button
    v-else
    class="btn"
    :class="[`${size}_btn`, `${statusClass}_btn`]"
    :style="btnCustomStyle"
    :disabled="disabled"
    @click="onClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <McIcon v-if="icon" :name="icon" class="btn_icon" />
    <slot />
  </button>
</template>
