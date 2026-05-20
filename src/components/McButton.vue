<script setup lang="ts">
import { computed } from 'vue'
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
  }>(),
  { variant: 'normal', size: 'middle', disabled: false, icon: '', tip: '' },
)

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

const statusClass = computed(() => (props.disabled ? 'disabled' : props.variant))

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
      :disabled="disabled"
      @click="onClick"
    >
      <McIcon v-if="icon" :name="icon" class="btn_icon" />
      <slot />
    </button>
    <div class="btn_tooltip">{{ tip }}</div>
  </div>
  <button
    v-else
    class="btn"
    :class="[`${size}_btn`, `${statusClass}_btn`]"
    :disabled="disabled"
    @click="onClick"
  >
    <McIcon v-if="icon" :name="icon" class="btn_icon" />
    <slot />
  </button>
</template>
