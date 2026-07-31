import {
  computed,
  inject,
  shallowReactive,
  toValue,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from 'vue'

export type McLayoutPosition = 'top' | 'bottom' | 'start' | 'end'
export interface McLayoutItemInput {
  position: MaybeRefOrGetter<McLayoutPosition>
  size: MaybeRefOrGetter<number>
  order?: MaybeRefOrGetter<number>
  active?: MaybeRefOrGetter<boolean>
}
export interface McLayoutOffsets {
  top: number
  bottom: number
  start: number
  end: number
}
export interface McLayoutInstance {
  register: (input: McLayoutItemInput) => () => void
  offsets: ComputedRef<McLayoutOffsets>
}
export const mcLayoutKey: InjectionKey<McLayoutInstance | null> = Symbol.for('mcui:layout')

export function createMcLayout(): McLayoutInstance {
  const items = shallowReactive(new Map<symbol, McLayoutItemInput>())
  const offsets = computed(() => {
    const result: McLayoutOffsets = { top: 0, bottom: 0, start: 0, end: 0 }
    const active = Array.from(items.values())
      .filter((item) => toValue(item.active ?? true))
      .sort((a, b) => toValue(a.order ?? 0) - toValue(b.order ?? 0))
    for (const item of active) result[toValue(item.position)] += Math.max(0, toValue(item.size))
    return result
  })
  return {
    register(input) {
      const id = Symbol('mc-layout-item')
      items.set(id, input)
      return () => items.delete(id)
    },
    offsets,
  }
}
export function useMcLayout(): McLayoutInstance | null {
  return inject(mcLayoutKey, null)
}
