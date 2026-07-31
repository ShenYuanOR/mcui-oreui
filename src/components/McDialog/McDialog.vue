<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { useAttrs, useId } from 'vue'
import { useMcLocale } from '../../framework/locale'
import McOverlay from '../McOverlay'

withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    teleport?: string | HTMLElement | false
    closeOnOverlay?: boolean
    closeOnEscape?: boolean
    persistent?: boolean
    showClose?: boolean
    width?: number | string
  }>(),
  {
    modelValue: false,
    teleport: 'body',
    closeOnOverlay: true,
    closeOnEscape: true,
    persistent: false,
    showClose: true,
    width: 520,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
}>()
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const titleId = useId()
const locale = useMcLocale()
const close = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <mc-overlay
    :model-value="modelValue"
    :teleport="teleport"
    :close-on-overlay="closeOnOverlay"
    :close-on-escape="closeOnEscape"
    :persistent="persistent"
    location-strategy="static"
    scroll-strategy="block"
    focus-strategy="trap"
    :scrim="true"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template v-if="$slots.activator" #activator="slotProps">
      <slot name="activator" v-bind="slotProps" />
    </template>
    <section
      v-bind="attrs"
      class="mc-dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? titleId : undefined"
      :style="{ '--mc-dialog-width': typeof width === 'number' ? `${width}px` : width }"
    >
      <header v-if="title || $slots.title" class="mc-dialog__header">
        <h2 :id="titleId" class="mc-dialog__title">
          <slot name="title">{{ title }}</slot>
        </h2>
        <button v-if="showClose" type="button" class="mc-dialog__close" :aria-label="locale.t('close')" @click="close">
          ×
        </button>
      </header>
      <div class="mc-dialog__body"><slot :close="close" /></div>
      <footer v-if="$slots.actions" class="mc-dialog__actions"><slot name="actions" :close="close" /></footer>
    </section>
  </mc-overlay>
</template>
