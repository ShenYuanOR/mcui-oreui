<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { nextTick, ref, useAttrs } from 'vue'
import type { McOverlayLocation } from '../../framework/overlay'
import McOverlay from '../McOverlay'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    teleport?: string | HTMLElement | false
    closeOnContentClick?: boolean
    location?: McOverlayLocation
    offset?: number | [number, number]
    minWidth?: number | string
  }>(),
  {
    modelValue: false,
    teleport: 'body',
    closeOnContentClick: true,
    location: 'bottom start',
    offset: 6,
    minWidth: 180,
  },
)
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>()
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const menu = ref<HTMLElement | null>(null)
let activeIndex = -1
function items() {
  if (!menu.value) return []
  return Array.from(
    menu.value.querySelectorAll<HTMLElement>(
      '[role="menuitem"],button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])',
    ),
  ).filter((item) => item.getAttribute('aria-disabled') !== 'true' && !item.hasAttribute('disabled'))
}
function focusAt(index: number) {
  const available = items()
  if (!available.length) return
  activeIndex = (index + available.length) % available.length
  available.forEach((item, itemIndex) => {
    if (!item.hasAttribute('role')) item.setAttribute('role', 'menuitem')
    item.tabIndex = itemIndex === activeIndex ? 0 : -1
  })
  available[activeIndex].focus()
}
async function onOpen() {
  await nextTick()
  focusAt(0)
}
function onKeydown(event: KeyboardEvent) {
  const available = items()
  const current = available.indexOf(document.activeElement as HTMLElement)
  if (event.key === 'ArrowDown') focusAt((current < 0 ? activeIndex : current) + 1)
  else if (event.key === 'ArrowUp') focusAt((current < 0 ? activeIndex : current) - 1)
  else if (event.key === 'Home') focusAt(0)
  else if (event.key === 'End') focusAt(available.length - 1)
  else if (event.key === 'Enter' || event.key === ' ') (document.activeElement as HTMLElement | null)?.click()
  else if (event.key === 'Tab') {
    emit('update:modelValue', false)
    return
  } else return
  event.preventDefault()
}
function onClick(event: MouseEvent) {
  if (!props.closeOnContentClick) return
  const item = (event.target as Element).closest('[role="menuitem"],button,a')
  if (item && item.getAttribute('aria-disabled') !== 'true') emit('update:modelValue', false)
}
</script>

<template>
  <mc-overlay
    :model-value="modelValue"
    :teleport="teleport"
    location-strategy="connected"
    :location="location"
    :offset="offset"
    :scrim="false"
    :close-on-overlay="true"
    scroll-strategy="reposition"
    focus-strategy="restore"
    transition="mc-menu-transition"
    @after-enter="onOpen"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #activator="slotProps"><slot name="activator" v-bind="slotProps" /></template>
    <div
      v-bind="attrs"
      ref="menu"
      class="mc-menu"
      role="menu"
      :style="{ minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }"
      @keydown="onKeydown"
      @click="onClick"
    >
      <slot />
    </div>
  </mc-overlay>
</template>
