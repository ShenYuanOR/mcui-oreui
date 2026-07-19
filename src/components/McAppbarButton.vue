<script setup lang="ts">
import { playSound } from '../composables/useSound'
import { useTooltipFlip } from '../composables/useTooltipFlip'
import McIcon from './McIcon.vue'

const props = withDefaults(
  defineProps<{
    /** 是否禁用 */
    disabled?: boolean
    /** 按钮左侧图标名称 */
    icon?: string
    /** Tooltip 文本（非空则显示） */
    tip?: string
    /** 自定义背景颜色 */
    bgColor?: string
  }>(),
  { disabled: false, icon: '', tip: '', bgColor: '' },
)

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

const { containerRef, tooltipStyle, updatePosition } = useTooltipFlip()

function onClick(ev: MouseEvent) {
  if (props.disabled) return
  playSound('click')
  emit('click', ev)
}
</script>

<template>
  <div
    v-if="tip"
    ref="containerRef"
    class="btn_with_tooltip_content"
    @mouseenter="updatePosition"
  >
    <button
      class="mc-appbar-button"
      :disabled="disabled"
      :style="bgColor ? { backgroundColor: bgColor } : undefined"
      @click="onClick"
    >
      <McIcon v-if="icon" :name="icon" class="btn_icon" />
      <slot />
    </button>
    <div
      class="btn_tooltip mc-tooltip__content"
      :style="tooltipStyle"
    >{{ tip }}</div>
  </div>
  <button
    v-else
    class="mc-appbar-button"
    :disabled="disabled"
    :style="bgColor ? { backgroundColor: bgColor } : undefined"
    @click="onClick"
  >
    <McIcon v-if="icon" :name="icon" class="btn_icon" />
    <slot />
  </button>
</template>
