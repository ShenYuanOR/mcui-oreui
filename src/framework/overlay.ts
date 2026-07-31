import { reactive, type InjectionKey } from 'vue'
import { useMcService } from './fallback'

export type McOverlayLocation =
  | 'top'
  | 'top start'
  | 'top end'
  | 'bottom'
  | 'bottom start'
  | 'bottom end'
  | 'start'
  | 'start top'
  | 'start bottom'
  | 'end'
  | 'end top'
  | 'end bottom'

export interface McConnectedPositionOptions {
  activator: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height'>
  content: { width: number; height: number }
  viewport: { width: number; height: number }
  location?: McOverlayLocation
  offset?: number | [number, number]
  padding?: number
  rtl?: boolean
}

export interface McConnectedPosition {
  top: number
  left: number
  location: McOverlayLocation
}

export function calculateConnectedPosition(options: McConnectedPositionOptions): McConnectedPosition {
  const { activator, content, viewport } = options
  const padding = options.padding ?? 8
  const [mainOffset, crossOffset] = Array.isArray(options.offset) ? options.offset : [options.offset ?? 0, 0]
  const rtl = options.rtl ?? false
  const requested = options.location ?? 'bottom start'
  const parts = requested.split(' ')
  const main = parts[0] as 'top' | 'bottom' | 'start' | 'end'
  const align = parts[1] as 'top' | 'bottom' | 'start' | 'end' | undefined
  const physicalMain: 'top' | 'right' | 'bottom' | 'left' =
    main === 'start' ? (rtl ? 'right' : 'left') : main === 'end' ? (rtl ? 'left' : 'right') : main

  const place = (side: 'top' | 'right' | 'bottom' | 'left') => {
    let top = 0
    let left = 0
    if (side === 'top' || side === 'bottom') {
      top = side === 'top' ? activator.top - content.height - mainOffset : activator.bottom + mainOffset
      const logicalAlign = align ?? 'center'
      if (logicalAlign === 'start') left = rtl ? activator.right - content.width : activator.left
      else if (logicalAlign === 'end') left = rtl ? activator.left : activator.right - content.width
      else left = activator.left + (activator.width - content.width) / 2
      left += crossOffset
    } else {
      left = side === 'left' ? activator.left - content.width - mainOffset : activator.right + mainOffset
      if (align === 'bottom') top = activator.bottom - content.height
      else if (align === 'top') top = activator.top
      else top = activator.top + (activator.height - content.height) / 2
      top += crossOffset
    }
    return { top, left }
  }

  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const
  let side: 'top' | 'right' | 'bottom' | 'left' = physicalMain
  let position = place(side)
  const mainOverflow =
    side === 'top'
      ? padding - position.top
      : side === 'bottom'
        ? position.top + content.height - (viewport.height - padding)
        : side === 'left'
          ? padding - position.left
          : position.left + content.width - (viewport.width - padding)
  if (mainOverflow > 0) {
    const flipped = place(opposite[side])
    const flippedOverflow =
      side === 'top'
        ? flipped.top + content.height - (viewport.height - padding)
        : side === 'bottom'
          ? padding - flipped.top
          : side === 'left'
            ? flipped.left + content.width - (viewport.width - padding)
            : padding - flipped.left
    if (flippedOverflow < mainOverflow) {
      side = opposite[side]
      position = flipped
    }
  }
  position.top = Math.min(
    Math.max(position.top, padding),
    Math.max(padding, viewport.height - content.height - padding),
  )
  position.left = Math.min(
    Math.max(position.left, padding),
    Math.max(padding, viewport.width - content.width - padding),
  )

  let resultMain: 'top' | 'bottom' | 'start' | 'end' = side as 'top' | 'bottom'
  if (side === 'left') resultMain = rtl ? 'end' : 'start'
  if (side === 'right') resultMain = rtl ? 'start' : 'end'
  return { ...position, location: `${resultMain}${align ? ` ${align}` : ''}` as McOverlayLocation }
}

export interface McOverlayEntry {
  id: symbol
  zIndex: number
  close: () => void
}

export interface McOverlayInstance {
  stack: McOverlayEntry[]
  register: (close: () => void) => McOverlayEntry
  unregister: (id: symbol) => void
  isTop: (id: symbol) => boolean
  closeTop: () => void
  lockScroll: () => void
  unlockScroll: () => void
  mount: () => void
  unmount: () => void
  dispose: () => void
}

export const mcOverlayKey: InjectionKey<McOverlayInstance> = Symbol.for('mcui:overlay')

interface DocumentOverlayCoordinator {
  locks: number
  nextZIndex: number
  previousOverflow: string
}

const documentCoordinators = new WeakMap<Document, DocumentOverlayCoordinator>()

function getDocumentCoordinator(documentValue: Document): DocumentOverlayCoordinator {
  let coordinator = documentCoordinators.get(documentValue)
  if (!coordinator) {
    coordinator = { locks: 0, nextZIndex: 2000, previousOverflow: '' }
    documentCoordinators.set(documentValue, coordinator)
  }
  return coordinator
}

export function createMcOverlay(): McOverlayInstance {
  const stack = reactive<McOverlayEntry[]>([])
  let localLocks = 0
  let browserConsumers = 0
  let ssrZIndex = 2000
  const nextDocumentZIndex = () => {
    const coordinator = getDocumentCoordinator(document)
    const zIndex = coordinator.nextZIndex
    coordinator.nextZIndex += 10
    return zIndex
  }
  const unlockDocument = () => {
    if (typeof document === 'undefined' || localLocks === 0) return
    const coordinator = getDocumentCoordinator(document)
    localLocks -= 1
    coordinator.locks = Math.max(0, coordinator.locks - 1)
    if (coordinator.locks === 0) document.documentElement.style.overflow = coordinator.previousOverflow
  }
  return {
    stack,
    register(close) {
      const zIndex = typeof document === 'undefined' || browserConsumers === 0 ? ssrZIndex : nextDocumentZIndex()
      if (typeof document === 'undefined' || browserConsumers === 0) ssrZIndex += 10
      const entry = { id: Symbol('mc-overlay'), zIndex, close }
      stack.push(entry)
      return entry
    },
    unregister(id) {
      const index = stack.findIndex((entry) => entry.id === id)
      if (index >= 0) stack.splice(index, 1)
    },
    isTop(id) {
      return stack.at(-1)?.id === id
    },
    closeTop() {
      stack.at(-1)?.close()
    },
    lockScroll() {
      if (typeof document === 'undefined') return
      const coordinator = getDocumentCoordinator(document)
      if (coordinator.locks === 0) {
        coordinator.previousOverflow = document.documentElement.style.overflow
        document.documentElement.style.overflow = 'hidden'
      }
      coordinator.locks += 1
      localLocks += 1
    },
    unlockScroll: unlockDocument,
    mount() {
      browserConsumers += 1
      if (browserConsumers !== 1 || typeof document === 'undefined') return
      for (const entry of stack) entry.zIndex = nextDocumentZIndex()
    },
    unmount() {
      browserConsumers = Math.max(0, browserConsumers - 1)
    },
    dispose() {
      while (localLocks > 0) unlockDocument()
      stack.splice(0)
      browserConsumers = 0
    },
  }
}

export function useMcOverlay(): McOverlayInstance {
  return useMcService(mcOverlayKey, createMcOverlay)
}
