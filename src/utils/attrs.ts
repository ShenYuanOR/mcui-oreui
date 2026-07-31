import { computed, useAttrs, type ComputedRef, type HTMLAttributes } from 'vue'

type McHTMLAttributes = HTMLAttributes & Record<string, unknown>

export interface McRoutedAttrs {
  rootAttrs: ComputedRef<McHTMLAttributes>
  controlAttrs: ComputedRef<McHTMLAttributes>
}

function isRootAttr(name: string): boolean {
  return name === 'class' || name === 'style' || name.startsWith('data-')
}

/**
 * Wrapper components keep layout/debugging attributes on their outer element,
 * while native, ARIA, and interaction attributes reach the semantic control.
 */
export function useMcRoutedAttrs(): McRoutedAttrs {
  const attrs = useAttrs()
  const rootAttrs = computed(
    () => Object.fromEntries(Object.entries(attrs).filter(([name]) => isRootAttr(name))) as McHTMLAttributes,
  )
  const controlAttrs = computed(
    () => Object.fromEntries(Object.entries(attrs).filter(([name]) => !isRootAttr(name))) as McHTMLAttributes,
  )
  return { rootAttrs, controlAttrs }
}
