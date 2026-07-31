<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  ref,
  useAttrs,
  useSlots,
  watch,
  type PropType,
  type VNode,
} from 'vue'
import { isMcIconDefinition, useMcIcons } from '../../framework/icons'
import type { McIconNode } from '../../framework/types'
import { getPixelIconCache, setPixelIconCache } from '../../utils/pixelIconCache'

function renderIconNode(node: McIconNode): VNode {
  return h(node.name, node.attrs ?? {}, node.children?.map(renderIconNode))
}

const McIconNodeRenderer = defineComponent({
  name: 'McIconNodeRenderer',
  props: { node: { type: Object as PropType<McIconNode>, required: true } },
  setup(rendererProps) {
    return () => renderIconNode(rendererProps.node)
  },
})

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
  }>(),
  { viewBox: '0 0 24 24', size: 24, pixelSize: 24 },
)

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const slots = useSlots()
const icons = useMcIcons()

const iconName = computed(() => {
  if (props.name) return props.name.trim()
  const text = slots
    .default?.()
    .map((node) => String(node.children ?? ''))
    .join('')
    .trim()
  return text ?? ''
})

// ==================== 像素化渲染（通过 path prop） ====================
const isPixelIcon = computed(() => !!props.path)
const pixelSrc = ref('')
const pixelError = ref(false)
const hasColor = computed(() => !!props.color)

let generation = 0
let pendingBlobUrl = ''
let unmounted = false

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function releasePendingBlob(): void {
  if (!pendingBlobUrl) return
  URL.revokeObjectURL(pendingBlobUrl)
  pendingBlobUrl = ''
}

function generatePixel() {
  const currentGeneration = ++generation
  releasePendingBlob()
  pixelSrc.value = ''
  pixelError.value = false

  if (!isPixelIcon.value) return
  if (typeof window === 'undefined') return

  const fillColor = props.color || '#ffffff'
  const cacheKey = `${props.path}:${props.viewBox}:${fillColor}:${props.pixelSize}`

  const cached = getPixelIconCache(cacheKey)
  if (cached) {
    pixelSrc.value = cached
    return
  }

  const ps = Math.min(Math.max(Math.round(props.pixelSize), 1), 512)

  // 1. 构造 SVG（crispEdges 禁抗锯齿）
  const svgMarkup =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeXml(props.viewBox)}" width="${ps}" height="${ps}">` +
    `<path d="${escapeXml(props.path ?? '')}" fill="${escapeXml(fillColor)}" stroke="none" shape-rendering="crispEdges"/>` +
    `</svg>`

  // 2. 加载 SVG → Canvas 光栅化 → 导出为像素 PNG
  const img = new Image()
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
  const blobUrl = URL.createObjectURL(blob)
  pendingBlobUrl = blobUrl

  const cleanup = () => {
    URL.revokeObjectURL(blobUrl)
    if (pendingBlobUrl === blobUrl) pendingBlobUrl = ''
  }

  img.onload = () => {
    if (unmounted || currentGeneration !== generation) {
      cleanup()
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = ps
    canvas.height = ps
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      pixelError.value = true
      cleanup()
      return
    }
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(img, 0, 0, ps, ps)
    const dataUrl = canvas.toDataURL('image/png')
    setPixelIconCache(cacheKey, dataUrl)
    pixelSrc.value = dataUrl
    cleanup()
  }
  img.onerror = () => {
    if (unmounted || currentGeneration !== generation) {
      cleanup()
      return
    }
    pixelError.value = true
    cleanup()
  }

  img.src = blobUrl
}

watch([() => props.path, () => props.color, () => props.pixelSize, () => props.viewBox], generatePixel, {
  immediate: true,
})

onBeforeUnmount(() => {
  unmounted = true
  generation += 1
  releasePendingBlob()
})

// ==================== 原有图标逻辑 ====================
const resolvedIcon = computed(() => icons.get(iconName.value))
const icon = computed(() => (isMcIconDefinition(resolvedIcon.value) ? resolvedIcon.value : undefined))
const iconComponent = computed(() => {
  const value = resolvedIcon.value
  return value && !isMcIconDefinition(value) ? value : undefined
})
const isColorable = computed(() => icon.value?.colorable ?? false)

const iconSize = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const iconStyle = computed(() => ({
  '--mc-icon-size': iconSize.value,
  '--mc-icon-color': isColorable.value && props.color ? props.color : undefined,
}))
const accessibleLabel = computed(() => (typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : undefined))
const ariaHidden = computed(() => (accessibleLabel.value ? undefined : 'true'))
</script>

<template>
  <!-- 像素图标有指定颜色：像素化光栅 PNG -->
  <img
    v-if="isPixelIcon && hasColor"
    v-bind="attrs"
    :src="pixelSrc || ''"
    :alt="accessibleLabel || ''"
    class="mc-icon mc-icon--pixel"
    :class="{ 'mc-icon--missing': pixelError || !pixelSrc }"
    :style="{ width: iconSize, height: iconSize }"
    :role="accessibleLabel ? 'img' : undefined"
    :aria-label="accessibleLabel"
    :aria-hidden="!pixelError && !accessibleLabel ? 'true' : undefined"
  />

  <!-- 像素图标无颜色：CSS mask 方案，PNG 做遮罩 → currentColor 着色 -->
  <span
    v-else-if="isPixelIcon"
    v-bind="attrs"
    class="mc-icon mc-icon--pixel-mask"
    :class="{ 'mc-icon--missing': pixelError || !pixelSrc }"
    :style="{
      width: iconSize,
      height: iconSize,
      WebkitMaskImage: pixelSrc ? `url(${pixelSrc})` : undefined,
      maskImage: pixelSrc ? `url(${pixelSrc})` : undefined,
    }"
    :role="accessibleLabel ? 'img' : undefined"
    :aria-label="accessibleLabel"
    :aria-hidden="!pixelError && !accessibleLabel ? 'true' : undefined"
  />

  <!-- 原有注册图标（mc-xxx / mc-key-xxx / mc-x-xxx） -->
  <component
    :is="iconComponent"
    v-else-if="iconComponent"
    v-bind="attrs"
    class="mc-icon"
    :style="iconStyle"
    :role="accessibleLabel ? 'img' : undefined"
    :aria-label="accessibleLabel"
    :aria-hidden="ariaHidden"
  />

  <span
    v-else
    v-bind="attrs"
    class="mc-icon"
    :class="{
      'mc-icon--missing': !icon,
      'mc-icon--normal': icon?.type === 'normal',
      'mc-icon--key': icon?.type === 'key',
      'mc-icon--x': icon?.type === 'x',
      'mc-icon--colorable': isColorable,
    }"
    :style="iconStyle"
    :role="accessibleLabel ? 'img' : undefined"
    :aria-label="accessibleLabel"
    :aria-hidden="ariaHidden"
  >
    <mc-icon-node-renderer v-if="icon" :node="icon.node" />
  </span>
</template>
