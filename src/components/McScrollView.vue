<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

// 精简版自定义滚动区：基于原生滚动 + McUI 风格滚动条联动
// （原项目滚动条 JS 与全局环境深度耦合，此处提供等价独立实现）

const container = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const thumb = ref<HTMLElement | null>(null);

const thumbHeight = ref(0);
const thumbTop = ref(0);
let dragging = false;
let dragStartY = 0;
let dragStartScroll = 0;

function sync() {
  const c = container.value;
  const t = track.value;
  if (!c || !t) return;
  const ratio = c.clientHeight / c.scrollHeight;
  if (ratio >= 1) {
    thumbHeight.value = 0;
    return;
  }
  thumbHeight.value = Math.max(ratio * t.clientHeight, 24);
  const maxScroll = c.scrollHeight - c.clientHeight;
  const maxThumb = t.clientHeight - thumbHeight.value;
  thumbTop.value = maxScroll > 0 ? (c.scrollTop / maxScroll) * maxThumb : 0;
}

function onThumbDown(e: PointerEvent) {
  const c = container.value;
  if (!c) return;
  dragging = true;
  dragStartY = e.clientY;
  dragStartScroll = c.scrollTop
    ; (e.target as Element).setPointerCapture?.(e.pointerId);
  e.preventDefault();
}
function onThumbMove(e: PointerEvent) {
  const c = container.value;
  const t = track.value;
  if (!dragging || !c || !t) return;
  const maxThumb = t.clientHeight - thumbHeight.value;
  const maxScroll = c.scrollHeight - c.clientHeight;
  const delta = e.clientY - dragStartY;
  c.scrollTop = dragStartScroll + (delta / maxThumb) * maxScroll;
}
function onThumbUp() {
  dragging = false;
}

let ro: ResizeObserver | null = null;
onMounted(() => {
  sync();
  container.value?.addEventListener('scroll', sync, { passive: true });
  ro = new ResizeObserver(sync);
  if (container.value) ro.observe(container.value);
  window.addEventListener('resize', sync);
});
onBeforeUnmount(() => {
  container.value?.removeEventListener('scroll', sync);
  ro?.disconnect();
  window.removeEventListener('resize', sync);
});
</script>

<template>
  <scroll-view class="main_scroll_view mc-scroll-view">
    <scroll-container ref="container" class="primary_scroll_container mc-scroll-view__container">
      <main class="scroll_container">
        <slot />
      </main>
    </scroll-container>
    <custom-scrollbar class="primary_custom_scrollbar">
      <custom-scrollbar-track ref="track">
        <custom-scrollbar-thumb v-show="thumbHeight > 0" ref="thumb"
          :style="{ height: thumbHeight + 'px', transform: `translateY(${thumbTop}px)` }" @pointerdown="onThumbDown"
          @pointermove="onThumbMove" @pointerup="onThumbUp" />
      </custom-scrollbar-track>
    </custom-scrollbar>
  </scroll-view>
</template>
