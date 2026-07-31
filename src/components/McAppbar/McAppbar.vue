<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, onBeforeUnmount } from 'vue'
import { useMcLayout } from '../../framework/layout'
const props = withDefaults(
  defineProps<{
    title?: string
    height?: number | string
    position?: 'top' | 'bottom'
    fixed?: boolean
    order?: number
  }>(),
  { height: 40, position: 'top', fixed: true, order: 0 },
)
const numericHeight = computed(() =>
  typeof props.height === 'number' ? props.height : Number.parseFloat(props.height) || 0,
)
const layout = useMcLayout()
const unregister = layout?.register({
  position: () => props.position,
  size: numericHeight,
  order: () => props.order,
  active: () => props.fixed,
})
onBeforeUnmount(() => unregister?.())
</script>

<template>
  <header
    class="mc-appbar"
    :class="[`mc-appbar--${position}`, { 'mc-appbar--fixed': fixed }]"
    :style="{ height: typeof height === 'number' ? `${height}px` : height, order }"
  >
    <div class="mc-appbar__left">
      <span v-if="title" class="mc-appbar__title">{{ title }}</span
      ><slot name="left" />
    </div>
    <div class="mc-appbar__center"><slot /></div>
    <div class="mc-appbar__right"><slot name="right" /></div>
  </header>
</template>
