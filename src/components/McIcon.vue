<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue'
import { getMcIcon } from '../utils/iconRegistry'
import * as mdi from '@mdi/js'

const props = withDefaults(
  defineProps<{
    /** 图标名称：普通 mc-xxx，按键 mc-key-xxx，彩色 mc-x-xxx；
     *  MDI 像素图标用 mdi-xxx，如 mdi-home、mdi-account-circle */
    name?: string
    /** 图标尺寸：数字按 px；字符串可传 24px / 2em 等 */
    size?: number | string
    /** 图标颜色（MDI 像素图标和普通图标均支持） */
    color?: string
    /** MDI 像素图标光栅化分辨率，默认 24（24×24 像素） */
    pixelSize?: number
    /** 可访问性标签；不传则作为装饰图标隐藏给读屏器 */
    label?: string
  }>(),
  { name: '', size: 24, pixelSize: 24, color: '', label: '' },
)

const slots = useSlots()

const iconName = computed(() => {
  if (props.name) return props.name.trim()
  const text = slots.default?.().map((node) => String(node.children ?? '')).join('').trim()
  return text ?? ''
})

// ==================== MDI 像素化渲染 ====================
const isMdiIcon = computed(() => iconName.value.startsWith('mdi-'))
const mdiPixelSrc = ref('')
const mdiError = ref(false)

/** mdi-account-circle → mdiAccountCircle */
function mdiNameToExport(raw: string): string {
  const name = raw.replace(/^mdi-/, '')
  const parts = name.split('-')
  const camel = parts
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join('')
  return `mdi${camel.charAt(0).toUpperCase()}${camel.slice(1)}`
}

/** 跨组件实例的像素化缓存，避免重复渲染 */
const mdiCache = new Map<string, string>()

/** 是否传入了 color */
const mdiHasColor = computed(() => !!props.color)

function generateMdiPixel() {
  mdiPixelSrc.value = ''
  mdiError.value = false

  if (!isMdiIcon.value) return
  if (typeof window === 'undefined') return

  const exportName = mdiNameToExport(iconName.value)
  const mdiPath = (mdi as Record<string, string>)[exportName]

  if (!mdiPath) {
    console.error(
      `[McIcon] MDI icon "${iconName.value}" not found (expected export: ${exportName})`,
    )
    mdiError.value = true
    return
  }

  // 有颜色用指定色，无颜色用白色（后续通过 CSS mask + currentColor 着色）
  const fillColor = props.color || '#ffffff'
  const cacheKey = `${exportName}:${fillColor}:${props.pixelSize}`

  if (mdiCache.has(cacheKey)) {
    mdiPixelSrc.value = mdiCache.get(cacheKey)!
    return
  }

  const ps = props.pixelSize

  // 1. 构造 SVG（crispEdges 禁抗锯齿）
  const svgMarkup =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${ps}" height="${ps}">` +
    `<path d="${mdiPath}" fill="${fillColor}" stroke="none" shape-rendering="crispEdges"/>` +
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
    mdiCache.set(cacheKey, dataUrl)
    mdiPixelSrc.value = dataUrl
    cleanup()
  }
  img.onerror = () => {
    console.error(`[McIcon] Failed to rasterize MDI icon: ${exportName}`)
    mdiError.value = true
    cleanup()
  }

  img.src = blobUrl
}

watch([() => iconName.value, () => props.color, () => props.pixelSize], generateMdiPixel, { immediate: true })

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
  <!-- MDI 有指定颜色：像素化光栅 PNG -->
  <img
    v-if="isMdiIcon && mdiHasColor"
    :src="mdiPixelSrc || ''"
    :alt="label || iconName"
    class="mc-icon mc-icon--mdi-pixel"
    :class="{ 'mc-icon--missing': mdiError || !mdiPixelSrc }"
    :style="{ width: iconSize, height: iconSize }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="!mdiError && !label ? 'true' : undefined"
  />

  <!-- MDI 无颜色：CSS mask 方案，PNG 做遮罩 → currentColor 着色，保留像素化 -->
  <span
    v-else-if="isMdiIcon"
    class="mc-icon mc-icon--mdi-mask"
    :class="{ 'mc-icon--missing': mdiError || !mdiPixelSrc }"
    :style="{
      width: iconSize,
      height: iconSize,
      WebkitMaskImage: mdiPixelSrc ? `url(${mdiPixelSrc})` : undefined,
      maskImage: mdiPixelSrc ? `url(${mdiPixelSrc})` : undefined,
    }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="!mdiError && !label ? 'true' : undefined"
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
.mc-icon--mdi-pixel {
  display: inline-block;
  flex: none;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.mc-icon--mdi-mask {
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
