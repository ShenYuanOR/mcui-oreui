<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue'
import { getMcIcon } from '../utils/iconRegistry'

const props = withDefaults(
  defineProps<{
    /** 图标名称：mc-xxx / mc-key-xxx / mc-x-xxx */
    name?: string
    /** 自定义 SVG 路径 d 属性值，传入后将像素化渲染 */
    path?: string
    /** SVG viewBox，配合 path 使用，默认 "0 0 24 24" */
    viewBox?: string
    /** 图标尺寸：数字按 px；字符串可传 24px / 2em 等 */
    size?: number | string
    /** 图标颜色（像素化和普通图标均支持） */
    color?: string
    /** 像素化光栅化分辨率，默认 24（24×24 像素） */
    pixelSize?: number
    /** 可访问性标签；不传则作为装饰图标隐藏给读屏器 */
    label?: string
  }>(),
  { name: '', path: '', viewBox: '0 0 24 24', size: 24, pixelSize: 24, color: '', label: '' },
)

const slots = useSlots()

const iconName = computed(() => {
  if (props.name) return props.name.trim()
  const text = slots.default?.().map((node) => String(node.children ?? '')).join('').trim()
  return text ?? ''
})

// ==================== 像素化渲染（通过 path prop） ====================
const isPixelIcon = computed(() => !!props.path)
const pixelSrc = ref('')
const pixelError = ref(false)
const hasColor = computed(() => !!props.color)

const pixelCache = new Map<string, string>()

function generatePixel() {
  pixelSrc.value = ''
  pixelError.value = false

  if (!isPixelIcon.value) return
  if (typeof window === 'undefined') return

  const fillColor = props.color || '#ffffff'
  const cacheKey = `${props.path}:${props.viewBox}:${fillColor}:${props.pixelSize}`

  if (pixelCache.has(cacheKey)) {
    pixelSrc.value = pixelCache.get(cacheKey)!
    return
  }

  const ps = props.pixelSize

  // 1. 构造 SVG（crispEdges 禁抗锯齿）
  const svgMarkup =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${props.viewBox}" width="${ps}" height="${ps}">` +
    `<path d="${props.path}" fill="${fillColor}" stroke="none" shape-rendering="crispEdges"/>` +
    `</svg>`

  // 2. 加载 SVG → Canvas 光栅化 → 导出为像素 PNG
  const img = new Image()
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
  const blobUrl = URL.createObjectURL(blob)

  const cleanup = () => URL.revokeObjectURL(blobUrl)

  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = ps
    canvas.height = ps
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(img, 0, 0, ps, ps)
    const dataUrl = canvas.toDataURL('image/png')
    pixelCache.set(cacheKey, dataUrl)
    pixelSrc.value = dataUrl
    cleanup()
  }
  img.onerror = () => {
    console.error(`[McIcon] Failed to rasterize pixel icon`)
    pixelError.value = true
    cleanup()
  }

  img.src = blobUrl
}

watch([() => props.path, () => props.color, () => props.pixelSize, () => props.viewBox], generatePixel, { immediate: true })

// ==================== 原有图标逻辑 ====================
const icon = computed(() => getMcIcon(iconName.value))
const isColorable = computed(() => icon.value?.colorable ?? false)
const renderedSvg = computed(() => icon.value?.svg ?? '')

const iconSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)
const iconStyle = computed(() => ({
  '--mc-icon-size': iconSize.value,
  '--mc-icon-color': isColorable.value && props.color ? props.color : undefined,
}))
const ariaHidden = computed(() => (props.label ? undefined : 'true'))
</script>

<template>
  <!-- 像素图标有指定颜色：像素化光栅 PNG -->
  <img
    v-if="isPixelIcon && hasColor"
    :src="pixelSrc || ''"
    :alt="label || 'pixel icon'"
    class="mc-icon mc-icon--pixel"
    :class="{ 'mc-icon--missing': pixelError || !pixelSrc }"
    :style="{ width: iconSize, height: iconSize }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="!pixelError && !label ? 'true' : undefined"
  />

  <!-- 像素图标无颜色：CSS mask 方案，PNG 做遮罩 → currentColor 着色 -->
  <span
    v-else-if="isPixelIcon"
    class="mc-icon mc-icon--pixel-mask"
    :class="{ 'mc-icon--missing': pixelError || !pixelSrc }"
    :style="{
      width: iconSize,
      height: iconSize,
      WebkitMaskImage: pixelSrc ? `url(${pixelSrc})` : undefined,
      maskImage: pixelSrc ? `url(${pixelSrc})` : undefined,
    }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="!pixelError && !label ? 'true' : undefined"
  />

  <!-- 原有注册图标（mc-xxx / mc-key-xxx / mc-x-xxx） -->
  <span
    v-else
    class="mc-icon"
    :class="{
      'mc-icon--missing': !icon,
      'mc-icon--normal': icon?.type === 'normal',
      'mc-icon--key': icon?.type === 'key',
      'mc-icon--x': icon?.type === 'x',
      'mc-icon--colorable': isColorable,
    }"
    :style="iconStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="ariaHidden"
    v-html="renderedSvg"
  />
</template>

<style scoped>
.mc-icon--pixel {
  display: inline-block;
  flex: none;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.mc-icon--pixel-mask {
  display: inline-block;
  flex: none;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
