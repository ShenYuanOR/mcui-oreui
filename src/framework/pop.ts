import { readonly, ref, type DeepReadonly, type InjectionKey, type Ref } from 'vue'
import { useMcService } from './fallback'
import type { McSoundInstance } from './sounds'

export interface McPopItem {
  readonly id: number
  readonly message: string
  readonly styleClass?: string
  readonly show: boolean
}

export interface McPopInstance {
  readonly state: DeepReadonly<Ref<McPopItem[]>>
  show: (message: string, duration?: number, styleClass?: string) => number
  dismiss: (id: number) => void
  clear: () => void
  dispose: () => void
}

export const mcPopKey: InjectionKey<McPopInstance> = Symbol.for('mcui:pop')

const maxVisible = 5
/** Keep in sync with `.mc-pop-host__item` leave transition (`--mc-motion-normal`). */
const leaveDuration = 160

export function createMcPop(sounds?: McSoundInstance): McPopInstance {
  const items = ref<McPopItem[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  const frames = new Map<number, number>()
  let sequence = 0
  let disposed = false

  const cancelResources = (id: number) => {
    const timer = timers.get(id)
    if (timer !== undefined) clearTimeout(timer)
    timers.delete(id)
    const frame = frames.get(id)
    if (frame !== undefined && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(frame)
    frames.delete(id)
  }

  const remove = (id: number) => {
    cancelResources(id)
    items.value = items.value.filter((item) => item.id !== id)
  }

  const dismiss = (id: number) => {
    if (disposed) return
    cancelResources(id)
    const item = items.value.find((current) => current.id === id)
    if (!item) return
    items.value = items.value.map((current) => (current.id === id ? { ...current, show: false } : current))
    if (typeof window === 'undefined') {
      remove(id)
      return
    }
    timers.set(
      id,
      setTimeout(() => remove(id), leaveDuration),
    )
  }

  const clear = () => {
    for (const item of items.value) cancelResources(item.id)
    items.value = []
  }

  const instance: McPopInstance = {
    state: readonly(items),
    show(message, duration = 3000, styleClass) {
      if (disposed) return -1
      const parsedDuration = Number(duration)
      const ttl = Number.isFinite(parsedDuration) && parsedDuration > 0 ? parsedDuration : 3000
      const id = ++sequence
      items.value = [{ id, message, styleClass, show: typeof window === 'undefined' }, ...items.value].slice(
        0,
        maxVisible,
      )
      for (const currentId of [...timers.keys(), ...frames.keys()]) {
        if (!items.value.some((item) => item.id === currentId)) cancelResources(currentId)
      }
      sounds?.play('toast')

      if (typeof window !== 'undefined') {
        if (typeof requestAnimationFrame === 'function') {
          frames.set(
            id,
            requestAnimationFrame(() => {
              frames.delete(id)
              if (disposed) return
              items.value = items.value.map((item) => (item.id === id ? { ...item, show: true } : item))
            }),
          )
        } else {
          items.value = items.value.map((item) => (item.id === id ? { ...item, show: true } : item))
        }
        timers.set(
          id,
          setTimeout(() => dismiss(id), ttl),
        )
      }
      return id
    },
    dismiss,
    clear,
    dispose() {
      if (disposed) return
      clear()
      disposed = true
    },
  }
  return instance
}

export function useMcPop(): McPopInstance {
  return useMcService(mcPopKey, createMcPop)
}
