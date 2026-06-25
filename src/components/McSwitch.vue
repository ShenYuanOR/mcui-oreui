<script setup lang="ts">
import { computed, ref } from 'vue'
import { playSound } from '../composables/useSound'
import switchOnIcon from '../assets/images/switch-on.svg'
import switchOffIcon from '../assets/images/switch-off.svg'

const props = withDefaults(
  defineProps<{
    /** 开关状态（v-model） */
    modelValue?: boolean
    /** 是否禁用 */
    disabled?: boolean
    /** 自定义开启侧图标（SVG/图片 URL），置空使用默认 */
    onIcon?: string
    /** 自定义关闭侧图标（SVG/图片 URL），置空使用默认 */
    offIcon?: string
    /** 开启时的自定义背景色，设置后覆盖默认绿色 */
    bgcolor?: string
  }>(),
  { modelValue: false, disabled: false, onIcon: '', offIcon: '', bgcolor: '' },
)

const onSrc = computed(() => props.onIcon || switchOnIcon)
const offSrc = computed(() => props.offIcon || switchOffIcon)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'change', v: boolean): void
}>()

const switchClass = computed(() => [
  props.modelValue ? 'on' : 'off',
  props.disabled ? 'disabled_switch' : 'normal_switch',
])

const switchCustomStyle = computed(() => {
  if (!props.bgcolor || props.disabled) return {}
  const base = props.modelValue ? props.bgcolor : '#8C8D90'
  return { background: `linear-gradient(to right, ${base} 50%, #8C8D90 50%)` }
})

const bounceClass = ref('')
const startX = ref(0)
const dragging = ref(false)

function setState(next: boolean) {
  if (next === props.modelValue) return
  playSound('click')
  // 与原实现一致：开→bounce_left 类，关→bounce_right 类
  bounceClass.value = next ? 'switch_bounce_left' : 'switch_bounce_right'
  emit('update:modelValue', next)
  emit('change', next)
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return
  dragging.value = false
  startX.value = e.clientX
  ;(e.target as Element).setPointerCapture?.(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (props.disabled || startX.value === 0) return
  const moved = e.clientX - startX.value
  if (moved > 10 || moved < -10) dragging.value = true
}

function onPointerUp(e: PointerEvent) {
  if (props.disabled) return
  const moved = e.clientX - startX.value
  startX.value = 0
  if (dragging.value) {
    if (moved > 10) setState(true)
    else if (moved < -10) setState(false)
    setTimeout(() => (dragging.value = false), 0)
  }
}

function onClick() {
  if (props.disabled || dragging.value) return
  setState(!props.modelValue)
}
</script>

<template>
  <div class="switch_content" @click="onClick">
    <div
      class="switch"
      :class="switchClass"
      :style="switchCustomStyle"
      role="switch"
      :aria-checked="modelValue"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    >
      <div class="switch_style left"><img :src="onSrc" alt="" /></div>
      <div class="switch_style right"><img :src="offSrc" alt="" /></div>
      <div class="switch_slider can_click" :class="bounceClass"></div>
    </div>
  </div>
</template>
