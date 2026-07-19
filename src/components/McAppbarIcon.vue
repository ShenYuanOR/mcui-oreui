<script setup lang="ts">
import { playSound } from '../composables/useSound'
import { useTooltipFlip } from '../composables/useTooltipFlip'
import McIcon from './McIcon.vue'

const props = withDefaults(
  defineProps<{
    /** 图标名称 */
    icon?: string
    /** 是否禁用 */
    disabled?: boolean
    /** Tooltip 文本 */
    tip?: string
  }>(),
  { icon: '', disabled: false, tip: '' },
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
      class="mc-appbar-icon"
      :disabled="disabled"
      @click="onClick"
    >
      <McIcon :name="icon" class="btn_icon" />
    </button>
    <div
      class="btn_tooltip mc-tooltip__content"
      :style="tooltipStyle"
    >{{ tip }}</div>
  </div>
  <button
    v-else
    class="mc-appbar-icon"
    :disabled="disabled"
    @click="onClick"
  >
    <McIcon :name="icon" class="btn_icon" />
  </button>
</template>
