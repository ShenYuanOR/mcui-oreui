<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { useSound } from '../../composables/useSound'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McIcon from '../McIcon'
import McTooltip from '../McTooltip'

const { playSound } = useSound()

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    icon?: string
    tip?: string
    color?: string
  }>(),
  { disabled: false },
)
const emit = defineEmits<{ (event: 'click', value: MouseEvent): void }>()
defineOptions({ inheritAttrs: false })
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
function click(event: MouseEvent) {
  if (props.disabled) return
  playSound('click')
  emit('click', event)
}
</script>

<template>
  <mc-tooltip v-bind="rootAttrs" class="mc-appbar-button__tooltip" :content="tip" :disabled="!tip">
    <button
      v-bind="controlAttrs"
      class="mc-appbar-button"
      type="button"
      :disabled="disabled"
      :style="color ? { '--mc-appbar-button-color': color } : undefined"
      @click="click"
    >
      <mc-icon v-if="icon" :name="icon" class="mc-appbar-button__icon" />
      <slot />
    </button>
  </mc-tooltip>
</template>
