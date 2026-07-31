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
    icon?: string
    disabled?: boolean
    tip?: string
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
  <mc-tooltip v-bind="rootAttrs" class="mc-appbar-icon__tooltip" :content="tip" :disabled="!tip">
    <button
      v-bind="controlAttrs"
      class="mc-appbar-icon"
      type="button"
      :disabled="disabled"
      :aria-label="controlAttrs['aria-label'] || tip || icon || 'Action'"
      @click="click"
    >
      <mc-icon :name="icon" class="mc-appbar-icon__icon" />
    </button>
  </mc-tooltip>
</template>
