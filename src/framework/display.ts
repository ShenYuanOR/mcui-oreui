import { computed, onBeforeUnmount, onMounted, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import { useMcService } from './fallback'
import type { McBreakpointName, McDisplayOptions } from './types'

const defaultThresholds = { sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 }

export interface McDisplayInstance {
  width: Ref<number>
  height: Ref<number>
  name: ComputedRef<McBreakpointName>
  mobile: ComputedRef<boolean>
  xs: ComputedRef<boolean>
  sm: ComputedRef<boolean>
  md: ComputedRef<boolean>
  lg: ComputedRef<boolean>
  xl: ComputedRef<boolean>
  xxl: ComputedRef<boolean>
  smAndUp: ComputedRef<boolean>
  mdAndUp: ComputedRef<boolean>
  lgAndUp: ComputedRef<boolean>
  xlAndUp: ComputedRef<boolean>
  smAndDown: ComputedRef<boolean>
  mdAndDown: ComputedRef<boolean>
  lgAndDown: ComputedRef<boolean>
  xlAndDown: ComputedRef<boolean>
  thresholds: Readonly<typeof defaultThresholds>
  update: () => void
  mount: () => void
  unmount: () => void
  dispose: () => void
}

export const mcDisplayKey: InjectionKey<McDisplayInstance> = Symbol.for('mcui:display')

export function createMcDisplay(options: McDisplayOptions = {}): McDisplayInstance {
  const thresholds = { ...defaultThresholds, ...(options.thresholds ?? {}) }
  const width = ref(options.ssrWidth ?? defaultThresholds.md)
  const height = ref(0)
  const name = computed<McBreakpointName>(() => {
    if (width.value < thresholds.sm) return 'xs'
    if (width.value < thresholds.md) return 'sm'
    if (width.value < thresholds.lg) return 'md'
    if (width.value < thresholds.xl) return 'lg'
    if (width.value < thresholds.xxl) return 'xl'
    return 'xxl'
  })
  const mobileLimit =
    typeof options.mobileBreakpoint === 'number'
      ? options.mobileBreakpoint
      : thresholds[options.mobileBreakpoint && options.mobileBreakpoint !== 'xs' ? options.mobileBreakpoint : 'md']
  const update = () => {
    if (typeof window === 'undefined') return
    width.value = window.innerWidth
    height.value = window.innerHeight
  }
  let consumers = 0
  const mount = () => {
    consumers += 1
    if (consumers > 1 || typeof window === 'undefined') return
    update()
    window.addEventListener('resize', update, { passive: true })
  }
  const unmount = () => {
    if (consumers === 0) return
    consumers -= 1
    if (consumers > 0 || typeof window === 'undefined') return
    window.removeEventListener('resize', update)
  }
  const dispose = () => {
    if (consumers > 0 && typeof window !== 'undefined') window.removeEventListener('resize', update)
    consumers = 0
  }
  const is = (value: McBreakpointName) => computed(() => name.value === value)
  return {
    width,
    height,
    name,
    mobile: computed(() => width.value < mobileLimit),
    xs: is('xs'),
    sm: is('sm'),
    md: is('md'),
    lg: is('lg'),
    xl: is('xl'),
    xxl: is('xxl'),
    smAndUp: computed(() => width.value >= thresholds.sm),
    mdAndUp: computed(() => width.value >= thresholds.md),
    lgAndUp: computed(() => width.value >= thresholds.lg),
    xlAndUp: computed(() => width.value >= thresholds.xl),
    smAndDown: computed(() => width.value < thresholds.md),
    mdAndDown: computed(() => width.value < thresholds.lg),
    lgAndDown: computed(() => width.value < thresholds.xl),
    xlAndDown: computed(() => width.value < thresholds.xxl),
    thresholds,
    update,
    mount,
    unmount,
    dispose,
  }
}

export function useMcDisplay(): McDisplayInstance {
  const display = useMcService(mcDisplayKey, createMcDisplay)
  onMounted(display.mount)
  onBeforeUnmount(display.unmount)
  return display
}
