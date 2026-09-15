<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { onBeforeUnmount, ref, useAttrs, useId, useSlots } from 'vue'
import type { McOverlayLocation } from '../../framework/overlay'
import McOverlay from '../McOverlay'

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    location?: McOverlayLocation
    disabled?: boolean
    delay?: number
    teleport?: string | HTMLElement | false
  }>(),
  { placement: 'top', location: undefined, disabled: false, delay: 0, teleport: 'body' },
)
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const visible = ref(false)
const id = useId()
const slots = useSlots()
let timer = 0
function show(event: Event, open: (source?: Event | HTMLElement) => void) {
  if (props.disabled || (!props.content && !slots.content)) return
  const target = event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined
  if (typeof window === 'undefined') {
    visible.value = true
    open(target)
    return
  }
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    visible.value = true
    open(target)
  }, props.delay)
}
function hide() {
  if (typeof window !== 'undefined') window.clearTimeout(timer)
  visible.value = false
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') hide()
}
function onPointerDown(event: PointerEvent) {
  if (event.pointerType === 'touch' || event.pointerType === 'pen') hide()
}
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.clearTimeout(timer)
})
</script>

<template>
  <mc-overlay
    v-model="visible"
    :teleport="teleport"
    location-strategy="connected"
    :location="location || ({ left: 'start', right: 'end', top: 'top', bottom: 'bottom' } as const)[placement]"
    :offset="8"
    :scrim="false"
    :close-on-overlay="false"
    :close-on-escape="false"
    scroll-strategy="reposition"
    focus-strategy="none"
    transition="mc-tooltip-transition"
  >
    <template #activator="{ open }">
      <span
        v-bind="attrs"
        class="mc-tooltip mc-tooltip__trigger"
        :aria-describedby="visible ? id : undefined"
        @mouseenter="show($event, open)"
        @mouseleave="hide"
        @focusin="show($event, open)"
        @focusout="hide"
        @keydown="onKeydown"
        @pointerdown="onPointerDown"
        ><slot
      /></span>
    </template>
    <div :id="id" class="mc-tooltip__content" role="tooltip">
      <slot name="content">{{ content }}</slot>
    </div>
  </mc-overlay>
</template>
