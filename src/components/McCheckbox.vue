<script setup lang="ts">
import { computed, ref } from 'vue'
import { playSound } from '../composables/useSound'
import checkWhite from '../assets/images/check-white.svg'

const props = withDefaults(
  defineProps<{
    /** 是否勾选（v-model） */
    modelValue?: boolean
    /** 是否禁用 */
    disabled?: boolean
    /** 勾选时的自定义背景色，设置后覆盖默认绿色 */
    bgcolor?: string
  }>(),
  { modelValue: false, disabled: false, bgcolor: '' },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'change', v: boolean): void
}>()

const stateClass = computed(() => [
  props.modelValue ? 'on' : 'off',
  props.disabled ? 'disabled' : 'enabled',
])

const isHovered = ref(false)

const checkboxCustomStyle = computed(() => {
  if (!props.bgcolor || !props.modelValue) return {}
  return { backgroundColor: isHovered.value ? darken(props.bgcolor, 0.85) : props.bgcolor }
})

function darken(hex: string, factor: number): string {
  const v = parseInt(hex.replace('#', ''), 16)
  const r = Math.round((v >> 16) * factor)
  const g = Math.round(((v >> 8) & 0xff) * factor)
  const b = Math.round((v & 0xff) * factor)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function toggle() {
  if (props.disabled) return
  playSound('click')
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div class="custom-checkbox" :class="stateClass" role="checkbox"
       :aria-checked="modelValue" :style="checkboxCustomStyle"
       @click="toggle"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false">
    <img class="checkmark" :src="checkWhite" alt="" />
  </div>
</template>
