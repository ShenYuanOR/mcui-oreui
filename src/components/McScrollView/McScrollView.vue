<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 精简版自定义滚动区：基于原生滚动 + McUI 风格滚动条联动
// （原项目滚动条 JS 与全局环境深度耦合，此处提供等价独立实现）

const container = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const thumb = ref<HTMLElement | null>(null)

const thumbHeight = ref(0)
const thumbTop = ref(0)
let dragging = false
let dragStartY = 0
let dragStartScroll = 0

function sync() {
  const c = container.value
  const t = track.value
  if (!c || !t) return
  const ratio = c.clientHeight / c.scrollHeight
  if (ratio >= 1) {
    thumbHeight.value = 0
    thumbTop.value = 0
    return
  }
  thumbHeight.value = Math.min(Math.max(ratio * t.clientHeight, 24), t.clientHeight)
  const maxScroll = c.scrollHeight - c.clientHeight
  const maxThumb = Math.max(t.clientHeight - thumbHeight.value, 0)
  thumbTop.value = maxScroll > 0 ? (c.scrollTop / maxScroll) * maxThumb : 0
}

function onThumbDown(e: PointerEvent) {
  const c = container.value
  if (!c) return
  dragging = true
  dragStartY = e.clientY
  dragStartScroll = c.scrollTop
  ;(e.target as Element).setPointerCapture?.(e.pointerId)
  e.preventDefault()
}
function onThumbMove(e: PointerEvent) {
  const c = container.value
  const t = track.value
  if (!dragging || !c || !t) return
  const maxThumb = Math.max(t.clientHeight - thumbHeight.value, 0)
  const maxScroll = c.scrollHeight - c.clientHeight
  if (maxThumb <= 0 || maxScroll <= 0) return
  const delta = e.clientY - dragStartY
  c.scrollTop = dragStartScroll + (delta / maxThumb) * maxScroll
}
function onThumbUp() {
  dragging = false
}

let ro: ResizeObserver | null = null
let mo: MutationObserver | null = null
onMounted(() => {
  sync()
  container.value?.addEventListener('scroll', sync, { passive: true })
  if (typeof ResizeObserver === 'function') {
    ro = new ResizeObserver(sync)
    if (container.value) ro.observe(container.value)
    if (content.value) ro.observe(content.value)
  } else if (typeof MutationObserver === 'function' && content.value) {
    mo = new MutationObserver(sync)
    mo.observe(content.value, { attributes: true, characterData: true, childList: true, subtree: true })
  }
  window.addEventListener('resize', sync)
})
onBeforeUnmount(() => {
  container.value?.removeEventListener('scroll', sync)
  ro?.disconnect()
  mo?.disconnect()
  window.removeEventListener('resize', sync)
})
</script>

<template>
  <div class="mc-scroll-view">
    <div ref="container" class="mc-scroll-view__container">
      <div ref="content" class="mc-scroll-view__content">
        <slot />
      </div>
    </div>
    <div class="mc-scroll-view__scrollbar" aria-hidden="true">
      <div ref="track" class="mc-scroll-view__track">
        <div
          v-show="thumbHeight > 0"
          ref="thumb"
          class="mc-scroll-view__thumb"
          :style="{ height: thumbHeight + 'px', transform: `translateY(${thumbTop}px)` }"
          @pointerdown="onThumbDown"
          @pointermove="onThumbMove"
          @pointerup="onThumbUp"
          @pointercancel="onThumbUp"
        />
      </div>
    </div>
  </div>
</template>
