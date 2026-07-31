<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'
import { useSound } from '../../composables/useSound'
import { useMcDefaults } from '../../framework/defaults'
import { useMcRoutedAttrs } from '../../utils/attrs'
import McIcon from '../McIcon'
import McTooltip from '../McTooltip'

const { playSoundType } = useSound()

export type McButtonVariant = 'normal' | 'primary' | 'error' | 'plain'
export type McButtonSize = 'extra_small' | 'small' | 'middle' | 'large'
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  variant?: McButtonVariant
  size?: McButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: string
  tip?: string
  color?: string
  type?: 'button' | 'submit' | 'reset'
}>()
const emit = defineEmits<{ (event: 'click', value: MouseEvent): void }>()
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const defaults = useMcDefaults('McButton') as Record<string, unknown>
const variant = computed(() => props.variant ?? (defaults.variant as McButtonVariant) ?? 'normal')
const size = computed(() => props.size ?? (defaults.size as McButtonSize) ?? 'middle')
const isDisabled = computed(() => props.disabled ?? (defaults.disabled as boolean) ?? false)
const isLoading = computed(() => props.loading ?? (defaults.loading as boolean) ?? false)

function click(event: MouseEvent) {
  if (isDisabled.value || isLoading.value) return
  playSoundType(variant.value)
  emit('click', event)
}
</script>

<template>
  <mc-tooltip v-bind="rootAttrs" :content="tip" :disabled="!tip">
    <button
      v-bind="controlAttrs"
      class="mc-button"
      :class="[
        `mc-button--${variant}`,
        `mc-button--${size}`,
        { 'mc-button--loading': isLoading, 'mc-button--custom': color },
      ]"
      :style="color ? { '--mc-button-color': color } : undefined"
      :type="type ?? (defaults.type as 'button' | 'submit' | 'reset') ?? 'button'"
      :disabled="isDisabled || isLoading"
      :aria-busy="isLoading || undefined"
      @click="click"
    >
      <span class="mc-button__content">
        <mc-icon v-if="icon" :name="icon" class="mc-button__icon" />
        <span v-if="isLoading" class="mc-button__spinner" aria-hidden="true" />
        <slot />
      </span>
    </button>
  </mc-tooltip>
</template>
