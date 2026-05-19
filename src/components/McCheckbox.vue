<script setup lang="ts">
import { computed } from 'vue'
import { playSound } from '../composables/useSound'
import checkWhite from '../assets/images/check-white.svg'

const props = withDefaults(
  defineProps<{
    /** 是否勾选（v-model） */
    modelValue?: boolean
    /** 是否禁用 */
    disabled?: boolean
  }>(),
  { modelValue: false, disabled: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'change', v: boolean): void
}>()

const stateClass = computed(() => [
  props.modelValue ? 'on' : 'off',
  props.disabled ? 'disabled' : 'enabled',
])

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
       :aria-checked="modelValue" @click="toggle">
    <img class="checkmark" :src="checkWhite" alt="" />
  </div>
</template>
