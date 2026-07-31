<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, onBeforeUnmount, useAttrs, useId } from 'vue'
import { useMcDisplay } from '../../framework/display'
import { useMcLocale } from '../../framework/locale'
import { useMcLayout, type McLayoutPosition } from '../../framework/layout'
import McOverlay from '../McOverlay'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    position?: McLayoutPosition
    mode?: 'temporary' | 'persistent' | 'permanent'
    size?: number
    order?: number
    closeOnOverlay?: boolean
    closeOnEscape?: boolean
    teleport?: string | HTMLElement | false
  }>(),
  {
    modelValue: false,
    position: 'start',
    mode: 'temporary',
    size: 320,
    order: 0,
    closeOnOverlay: true,
    closeOnEscape: true,
    teleport: 'body',
  },
)
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void; (event: 'close'): void }>()
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const display = useMcDisplay()
const locale = useMcLocale()
const layout = useMcLayout()
const titleId = useId()
const effectiveMode = computed(() => (props.mode === 'persistent' && display.mobile.value ? 'temporary' : props.mode))
const active = computed(() => props.mode === 'permanent' || (effectiveMode.value === 'persistent' && props.modelValue))
const visible = computed(() => props.mode === 'permanent' || props.modelValue)
const unregister = layout?.register({
  position: () => props.position,
  size: () => props.size,
  order: () => props.order,
  active,
})
onBeforeUnmount(() => unregister?.())
function update(value: boolean) {
  if (props.mode === 'permanent') return
  emit('update:modelValue', value)
}
function close() {
  if (props.mode === 'permanent') return
  emit('update:modelValue', false)
}
</script>

<template>
  <mc-overlay
    v-if="effectiveMode === 'temporary'"
    :model-value="visible"
    :teleport="teleport"
    location-strategy="static"
    :close-on-overlay="closeOnOverlay"
    :close-on-escape="closeOnEscape"
    scroll-strategy="block"
    focus-strategy="trap"
    transition="mc-drawer-transition"
    @update:model-value="update"
    @close="emit('close')"
  >
    <template v-if="$slots.activator" #activator="slotProps"><slot name="activator" v-bind="slotProps" /></template>
    <aside
      v-bind="attrs"
      class="mc-drawer mc-drawer--temporary"
      :class="`mc-drawer--${position}`"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title || $slots.header ? titleId : undefined"
      :style="{ '--mc-drawer-size': `${size}px` }"
    >
      <header v-if="title || $slots.header" class="mc-drawer__header">
        <div :id="titleId" class="mc-drawer__title">
          <slot name="header">{{ title }}</slot>
        </div>
        <button class="mc-drawer__close" type="button" :aria-label="locale.t('close')" @click="close">×</button>
      </header>
      <div class="mc-drawer__body"><slot :close="close" /></div>
      <footer v-if="$slots.footer" class="mc-drawer__footer"><slot name="footer" :close="close" /></footer>
    </aside>
  </mc-overlay>
  <aside
    v-else-if="visible"
    v-bind="attrs"
    class="mc-drawer mc-drawer--layout"
    :class="`mc-drawer--${position}`"
    :aria-labelledby="title || $slots.header ? titleId : undefined"
    :style="{ '--mc-drawer-size': `${size}px`, order }"
  >
    <header v-if="title || $slots.header" class="mc-drawer__header">
      <div :id="titleId" class="mc-drawer__title">
        <slot name="header">{{ title }}</slot>
      </div>
      <button
        v-if="mode !== 'permanent'"
        class="mc-drawer__close"
        type="button"
        :aria-label="locale.t('close')"
        @click="close"
      >
        ×
      </button>
    </header>
    <div class="mc-drawer__body"><slot :close="close" /></div>
    <footer v-if="$slots.footer" class="mc-drawer__footer"><slot name="footer" :close="close" /></footer>
  </aside>
</template>
