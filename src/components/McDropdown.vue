<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { playSound } from '../composables/useSound'
import arrowDown from '../assets/images/arrow-down.svg'
import checkWhite from '../assets/images/check-white.svg'

const props = withDefaults(
  defineProps<{
    /** 选项文本数组 */
    options?: string[]
    /** 选中序号（1 起；0 表示未选）—— v-model */
    modelValue?: number
    /** 未选择时的占位文本 */
    unselectedText?: string
    /** 是否禁用 */
    disabled?: boolean
  }>(),
  { options: () => [], modelValue: 0, unselectedText: '选择一个选项', disabled: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const labelText = computed(
  () => props.options[props.modelValue - 1] ?? props.unselectedText,
)

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  playSound('click')
}

function select(index1: number) {
  if (props.disabled) return
  if (index1 !== props.modelValue) {
    emit('update:modelValue', index1)
    emit('change', index1)
  }
  open.value = false
}

function onOutside(e: Event) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onOutside)
  document.addEventListener('touchstart', onOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onOutside)
  document.removeEventListener('touchstart', onOutside)
})
</script>

<template>
  <custom-dropdown ref="root">
    <div
      class="dropdown_label"
      :class="{ disabled_dropdown: disabled, open_dropdown: open }"
      @click="toggle"
    >
      {{ labelText }}
    </div>
    <img
      class="dropdown_arrow"
      :class="{ disabled_dropdown_arrow: disabled, open_dropdown_arrow: open }"
      :src="arrowDown"
      alt=""
    />
    <div class="dropdown_options" :style="{ display: open ? 'block' : 'none' }">
      <div
        v-for="(opt, i) in options"
        :key="i"
        class="dropdown_option"
        :class="{ selected: i + 1 === modelValue }"
        :data-value="i + 1"
        @click="select(i + 1)"
      >
        {{ opt }}
        <img class="dropdown_checkmark" :src="checkWhite" alt="" />
      </div>
    </div>
  </custom-dropdown>
</template>
