<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { calculateConnectedPosition, useMcOverlay, type McOverlayLocation } from '../../framework/overlay'
import { useMcLocale } from '../../framework/locale'
import { useMcTheme } from '../../framework/theme'
import { useMcRoutedAttrs } from '../../utils/attrs'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    teleport?: string | HTMLElement | false
    locationStrategy?: 'static' | 'connected'
    location?: McOverlayLocation
    offset?: number | [number, number]
    boundaryPadding?: number
    matchWidth?: boolean
    scrollStrategy?: 'block' | 'close' | 'reposition' | 'none'
    focusStrategy?: 'trap' | 'restore' | 'none'
    closeOnOverlay?: boolean
    closeOnEscape?: boolean
    persistent?: boolean
    scrim?: boolean | string
    transition?: string
  }>(),
  {
    modelValue: false,
    teleport: 'body',
    locationStrategy: 'static',
    location: 'bottom start',
    offset: 0,
    boundaryPadding: 8,
    matchWidth: false,
    scrollStrategy: 'block',
    focusStrategy: 'trap',
    closeOnOverlay: true,
    closeOnEscape: true,
    persistent: false,
    scrim: true,
    transition: 'mc-overlay-fade',
  },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'open'): void
  (event: 'close'): void
  (event: 'afterEnter'): void
}>()
defineOptions({ inheritAttrs: false })
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()

const overlay = useMcOverlay()
const locale = useMcLocale()
const theme = useMcTheme()
const content = ref<HTMLElement | null>(null)
const activator = ref<HTMLElement | null>(null)
const entryId = ref<symbol | null>(null)
const zIndex = ref(2000)
const position = ref({ top: 0, left: 0, location: props.location })
const positioned = ref(false)
const teleportReady = ref(false)
const teleportDisabled = computed(() => props.teleport === false || !teleportReady.value)
const teleportTarget = computed(() => (props.teleport === false ? 'body' : props.teleport))
const connected = computed(() => props.locationStrategy === 'connected')
const focusableSelector =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
let resizeObserver: ResizeObserver | undefined
let frame = 0
let scrollTargets: EventTarget[] = []
let mounted = false

function getScrollParents(element: HTMLElement | null): EventTarget[] {
  if (typeof window === 'undefined') return []
  const targets: EventTarget[] = [window]
  let parent = element?.parentElement
  while (parent) {
    const style = window.getComputedStyle(parent)
    if (/(auto|scroll|overlay)/.test(`${style.overflow}${style.overflowX}${style.overflowY}`)) targets.push(parent)
    parent = parent.parentElement
  }
  return targets
}
function updatePosition() {
  if (!connected.value || !activator.value || !content.value || typeof window === 'undefined') return
  const rect = activator.value.getBoundingClientRect()
  const contentRect = content.value.getBoundingClientRect()
  position.value = calculateConnectedPosition({
    activator: rect,
    content: { width: contentRect.width, height: contentRect.height },
    viewport: { width: window.innerWidth, height: window.innerHeight },
    location: props.location,
    offset: props.offset,
    padding: props.boundaryPadding,
    rtl: locale.isRtl.value,
  })
  positioned.value = true
}
function schedulePosition() {
  if (typeof window === 'undefined') return
  window.cancelAnimationFrame(frame)
  frame = window.requestAnimationFrame(updatePosition)
}
function focusInitial() {
  if (props.focusStrategy !== 'trap') return
  const first = content.value?.querySelector<HTMLElement>(`[autofocus],${focusableSelector}`)
  ;(first ?? content.value)?.focus({ preventScroll: true })
}
function close() {
  if (!props.persistent) emit('update:modelValue', false)
}
function toggle(event?: Event) {
  if (event?.currentTarget instanceof HTMLElement) activator.value = event.currentTarget
  emit('update:modelValue', !props.modelValue)
}
function openFrom(source?: Event | HTMLElement) {
  const element = source instanceof HTMLElement ? source : source?.currentTarget
  if (element instanceof HTMLElement) activator.value = element
  emit('update:modelValue', true)
}
function onBackdrop(event: MouseEvent) {
  if (!connected.value && event.target === event.currentTarget && props.closeOnOverlay) close()
}
function onOutside(event: Event) {
  if (!connected.value || !props.closeOnOverlay) return
  const target = event.target as Node
  if (!content.value?.contains(target) && !activator.value?.contains(target)) close()
}
function onKeydown(event: KeyboardEvent) {
  if (!props.modelValue || !entryId.value || !overlay.isTop(entryId.value)) return
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.preventDefault()
    close()
    return
  }
  if (event.key !== 'Tab' || props.focusStrategy !== 'trap' || !content.value) return
  const focusable = Array.from(content.value.querySelectorAll<HTMLElement>(focusableSelector))
  if (!focusable.length) {
    event.preventDefault()
    content.value.focus()
    return
  }
  const first = focusable[0]
  const last = focusable.at(-1)!
  if (event.shiftKey && (document.activeElement === first || document.activeElement === content.value)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
function onScroll() {
  if (props.scrollStrategy === 'close') close()
  else if (props.scrollStrategy === 'reposition') schedulePosition()
}
function addPositionListeners() {
  if (!connected.value || typeof document === 'undefined') return
  scrollTargets = getScrollParents(activator.value)
  for (const target of scrollTargets) target.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', schedulePosition, { passive: true })
  document.addEventListener('pointerdown', onOutside)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(schedulePosition)
    if (activator.value) resizeObserver.observe(activator.value)
    if (content.value) resizeObserver.observe(content.value)
  }
}
function removePositionListeners() {
  for (const target of scrollTargets) target.removeEventListener('scroll', onScroll)
  scrollTargets = []
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', schedulePosition)
    window.cancelAnimationFrame(frame)
  }
  if (typeof document !== 'undefined') document.removeEventListener('pointerdown', onOutside)
  resizeObserver?.disconnect()
  resizeObserver = undefined
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      const entry = overlay.register(close)
      entryId.value = entry.id
      zIndex.value = entry.zIndex
      positioned.value = !connected.value
      emit('open')
      if (!mounted) return
      if (props.scrollStrategy === 'block') overlay.lockScroll()
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      await nextTick()
      updatePosition()
      addPositionListeners()
      focusInitial()
      emit('afterEnter')
    } else if (entryId.value) {
      const oldId = entryId.value
      overlay.unregister(oldId)
      entryId.value = null
      if (mounted) {
        if (props.scrollStrategy === 'block') overlay.unlockScroll()
        document.removeEventListener('keydown', onKeydown)
        removePositionListeners()
        if (props.focusStrategy !== 'none') activator.value?.focus({ preventScroll: true })
      }
      emit('close')
    }
  },
  { immediate: true },
)
watch([() => props.location, () => props.offset, () => props.boundaryPadding], schedulePosition, { deep: true })
onMounted(async () => {
  mounted = true
  teleportReady.value = true
  overlay.mount()
  if (!entryId.value) return
  zIndex.value = overlay.stack.find((entry) => entry.id === entryId.value)?.zIndex ?? zIndex.value
  if (props.scrollStrategy === 'block') overlay.lockScroll()
  document.addEventListener('keydown', onKeydown)
  await nextTick()
  updatePosition()
  addPositionListeners()
  focusInitial()
  emit('afterEnter')
})
onBeforeUnmount(() => {
  const wasRegistered = Boolean(entryId.value)
  if (entryId.value) overlay.unregister(entryId.value)
  if (mounted && wasRegistered && props.scrollStrategy === 'block') overlay.unlockScroll()
  if (typeof document !== 'undefined') document.removeEventListener('keydown', onKeydown)
  removePositionListeners()
  overlay.unmount()
  mounted = false
})
const activatorProps = computed(() => ({
  'aria-expanded': String(props.modelValue),
  'aria-haspopup': connected.value ? 'menu' : 'dialog',
  onClick: toggle,
}))
const contentStyle = computed(() =>
  connected.value
    ? {
        top: `${position.value.top}px`,
        left: `${position.value.left}px`,
        minWidth:
          props.matchWidth && activator.value ? `${activator.value.getBoundingClientRect().width}px` : undefined,
        visibility: positioned.value ? undefined : ('hidden' as const),
      }
    : undefined,
)
defineExpose({ content, activator, updatePosition, close, open: openFrom, toggle })
</script>

<template>
  <slot name="activator" :props="activatorProps" :is-active="modelValue" :toggle="toggle" :open="openFrom" />
  <Teleport :to="teleportTarget" :disabled="teleportDisabled">
    <Transition :name="transition">
      <div
        v-if="modelValue"
        v-bind="rootAttrs"
        class="mc-overlay"
        :class="[theme.classes.value, { 'mc-overlay--connected': connected, 'mc-overlay--scrim': scrim }]"
        :style="[theme.styles.value, { zIndex, background: typeof scrim === 'string' ? scrim : undefined }]"
        :dir="locale.dir.value"
        @mousedown="onBackdrop"
      >
        <div
          v-bind="controlAttrs"
          ref="content"
          class="mc-overlay__content"
          :data-location="position.location"
          :style="contentStyle"
          tabindex="-1"
        >
          <slot :close="close" :update-location="updatePosition" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
