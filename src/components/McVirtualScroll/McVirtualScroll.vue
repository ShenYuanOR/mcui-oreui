<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, ref } from 'vue'
const props = withDefaults(
  defineProps<{
    items: unknown[]
    itemHeight: number
    height: number | string
    overscan?: number
    itemKey?: string | ((item: unknown, index: number) => unknown)
  }>(),
  { overscan: 4, itemKey: '' },
)
const scrollTop = ref(0)
const numericHeight = computed(() =>
  typeof props.height === 'number' ? props.height : Number.parseFloat(props.height) || 0,
)
const start = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.overscan))
const count = computed(() => Math.ceil(numericHeight.value / props.itemHeight) + props.overscan * 2)
const end = computed(() => Math.min(props.items.length, start.value + count.value))
const visible = computed(() => props.items.slice(start.value, end.value))
const keyOf = (item: unknown, index: number) =>
  typeof props.itemKey === 'function'
    ? props.itemKey(item, index)
    : props.itemKey && typeof item === 'object' && item !== null
      ? (item as Record<string, unknown>)[props.itemKey]
      : index
function onScroll(event: Event) {
  scrollTop.value = (event.currentTarget as HTMLElement).scrollTop
}
defineExpose({ start, end, scrollTop })
</script>

<template>
  <div
    class="mc-virtual-scroll"
    role="list"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    @scroll="onScroll"
  >
    <div class="mc-virtual-scroll__spacer" :style="{ height: `${items.length * itemHeight}px` }">
      <div class="mc-virtual-scroll__window" :style="{ transform: `translateY(${start * itemHeight}px)` }">
        <div
          v-for="(item, localIndex) in visible"
          :key="String(keyOf(item, start + localIndex))"
          class="mc-virtual-scroll__item"
          role="listitem"
          :style="{ height: `${itemHeight}px` }"
        >
          <slot :item="item" :index="start + localIndex" />
        </div>
      </div>
    </div>
  </div>
</template>
