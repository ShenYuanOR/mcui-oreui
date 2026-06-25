<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 当前值（v-model） */
    modelValue?: number
    min?: number
    max?: number
    /** 普通滑块步长 */
    step?: number
    /** 分段数（type=set 时生效） */
    segments?: number
    /** range 连续 / set 分段 */
    type?: 'range' | 'set'
    /** 是否显示刻度/端点标签 */
    showSegments?: boolean
    /** 使用自定义分段值 */
    customSegments?: boolean
    /** 自定义分段值数组（含两端，长度 segments+1） */
    segmentValues?: (string | number)[]
    disabled?: boolean
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    segments: 4,
    type: 'range',
    showSegments: true,
    customSegments: false,
    segmentValues: () => [],
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

const track = ref<HTMLElement | null>(null)
const thumb = ref<HTMLElement | null>(null)

const fmtInt = (v: number) => v.toFixed(2).replace(/\.?0+$/, '')
const fmtDec = (v: number) => v.toFixed(2)

const position = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return Math.max(0, Math.min(((props.modelValue - props.min) / span) * 100, 100))
})

const tooltip = computed(() => {
  if (props.type === 'set') {
    const idx = Math.round(position.value / (100 / props.segments))
    if (props.customSegments) return String(props.segmentValues[idx] ?? '')
    return fmtInt(props.min + (idx * (props.max - props.min)) / props.segments)
  }
  const p = position.value
  return p === 0 || p === 100 ? fmtInt(props.modelValue) : fmtDec(props.modelValue)
})

// 分段线（type=set，内部分隔）
const segmentLines = computed(() =>
  props.type === 'set'
    ? Array.from({ length: props.segments - 1 }, (_, i) => ((i + 1) / props.segments) * 100)
    : [],
)

// 刻度/端点标签
const labels = computed(() => {
  if (props.type === 'set' && props.showSegments) {
    return Array.from({ length: props.segments + 1 }, (_, i) => ({
      pos: (i / props.segments) * 100,
      text: props.customSegments
        ? String(props.segmentValues[i] ?? '')
        : fmtInt(props.min + (i * (props.max - props.min)) / props.segments),
    }))
  }
  if (props.type === 'range' && props.showSegments) {
    return [
      { pos: 0, text: fmtInt(props.min) },
      { pos: 100, text: fmtInt(props.max) },
    ]
  }
  return []
})

function posToValue(pos: number): number {
  const raw = (pos * (props.max - props.min)) / 100 + props.min
  if (props.type === 'set') {
    const idx = Math.round(pos / (100 / props.segments))
    return props.min + (idx * (props.max - props.min)) / props.segments
  }
  return raw
}

function emitValue(v: number) {
  const clamped = Math.max(props.min, Math.min(v, props.max))
  if (clamped !== props.modelValue) {
    emit('update:modelValue', clamped)
    emit('change', clamped)
  }
}

function clientToPos(clientX: number): number {
  const el = track.value
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  return Math.max(0, Math.min(((clientX - rect.left) / rect.width) * 100, 100))
}

const dragging = ref(false)
const activePointerId = ref<number | null>(null)

function onPointerDown(e: PointerEvent) {
  if (props.disabled || activePointerId.value !== null) return
  e.preventDefault()
  dragging.value = true
  activePointerId.value = e.pointerId
  thumb.value?.focus({ preventScroll: true })
  ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
  emitValue(posToValue(clientToPos(e.clientX)))
}

function onPointerMove(e: PointerEvent) {
  if (props.disabled || !dragging.value || activePointerId.value !== e.pointerId) return
  e.preventDefault()
  emitValue(posToValue(clientToPos(e.clientX)))
}

function stopDragging(e: PointerEvent) {
  if (activePointerId.value !== e.pointerId) return
  const target = e.currentTarget as Element
  if (target.hasPointerCapture?.(e.pointerId)) {
    target.releasePointerCapture?.(e.pointerId)
  }
  dragging.value = false
  activePointerId.value = null
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
  if (!keys.includes(e.key)) return
  e.preventDefault()
  if (props.type === 'set') {
    const unit = (props.max - props.min) / props.segments
    let idx = Math.round((props.modelValue - props.min) / unit)
    if (e.key === 'ArrowLeft') idx = Math.max(0, idx - 1)
    else if (e.key === 'ArrowRight') idx = Math.min(props.segments, idx + 1)
    else if (e.key === 'ArrowUp') idx = props.segments
    else idx = 0
    emitValue(props.min + idx * unit)
  } else {
    let v = props.modelValue
    if (e.key === 'ArrowLeft') v -= props.step
    else if (e.key === 'ArrowRight') v += props.step
    else if (e.key === 'ArrowUp') v = props.max
    else v = props.min
    emitValue(v)
  }
}
</script>

<template>
  <div class="slider_area">
    <div>Selected: <span class="slider_tooltip">{{ tooltip }}</span></div>
    <div class="slider_content">
      <div
        ref="track"
        class="slider"
        :class="{ disabled_slider: disabled, 'slider--dragging': dragging }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="stopDragging"
        @pointercancel="stopDragging"
        @lostpointercapture="stopDragging"
      >
        <div class="slider_process" :style="{ width: position + '%' }"></div>
        <div
          ref="thumb"
          class="slider_slider"
          :class="{ disabled_slider: disabled }"
          :style="{ left: position + '%' }"
          :tabindex="disabled ? -1 : 0"
          @keydown="onKeydown"
        ></div>
        <div
          v-for="(lp, i) in segmentLines"
          :key="'seg' + i"
          class="slider_segment"
          :style="{ left: `calc(${lp}% - 1px)` }"
        ></div>
        <div
          v-for="(lb, i) in labels"
          :key="'lbl' + i"
          class="slider_value_info"
          :style="{ position: 'absolute', bottom: '-35px', left: `calc(${lb.pos}% - 12px)` }"
        >{{ lb.text }}</div>
      </div>
    </div>
  </div>
</template>
