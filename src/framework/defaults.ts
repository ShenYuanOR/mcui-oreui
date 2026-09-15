import { cloneVNode, Fragment, isVNode, type InjectionKey, type VNode } from 'vue'
import { useMcService } from './fallback'
import type { McDefaultsOptions } from './types'

export interface McDefaultsInstance {
  options: McDefaultsOptions
  parent?: McDefaultsInstance
  get: <T>(component: string, prop: string, value?: T) => T | undefined
  component: (name: string) => Record<string, unknown>
}

export const mcDefaultsKey: InjectionKey<McDefaultsInstance> = Symbol.for('mcui:defaults')

export function createMcDefaults(options: McDefaultsOptions = {}, parent?: McDefaultsInstance): McDefaultsInstance {
  const instance: McDefaultsInstance = {
    options,
    parent,
    get<T>(component: string, prop: string, value?: T): T | undefined {
      if (value !== undefined) return value
      const componentValue = instance.options.components?.[component]?.[prop]
      if (componentValue !== undefined) return componentValue as T
      const globalValue = instance.options.global?.[prop]
      if (globalValue !== undefined) return globalValue as T
      return parent?.get<T>(component, prop)
    },
    component(name: string) {
      return {
        ...(parent?.component(name) ?? {}),
        ...(instance.options.global ?? {}),
        ...(instance.options.components?.[name] ?? {}),
      }
    },
  }
  return instance
}

export function useMcDefaults(componentName?: string): McDefaultsInstance | Record<string, unknown> {
  const defaults = useMcService(mcDefaultsKey, createMcDefaults)
  return componentName ? defaults.component(componentName) : defaults
}

type McDefaultVNode = VNode & { __mcDefaultKeys?: Set<string> }

function kebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function componentName(vnode: VNode): string | undefined {
  if (!vnode.type || typeof vnode.type === 'string' || typeof vnode.type === 'symbol') return undefined
  const type = vnode.type as { name?: string; __name?: string }
  return type.name ?? type.__name
}

function declaresProp(vnode: VNode, key: string): boolean {
  if (!vnode.type || typeof vnode.type === 'string' || typeof vnode.type === 'symbol') return false
  const props = (vnode.type as { props?: string[] | Record<string, unknown> }).props
  if (Array.isArray(props)) return props.includes(key) || props.includes(kebabCase(key))
  return Boolean(props && (key in props || kebabCase(key) in props))
}

export function hasConfiguredDefaults(defaults: McDefaultsInstance): boolean {
  let current: McDefaultsInstance | undefined = defaults
  while (current) {
    if (Object.keys(current.options.global ?? {}).length > 0) return true
    if (Object.keys(current.options.components ?? {}).length > 0) return true
    current = current.parent
  }
  return false
}

function isMcComponentName(name: string | undefined): boolean {
  return Boolean(name && (name.startsWith('Mc') || name.startsWith('mc-')))
}

type McDefaultSlot = ((...args: unknown[]) => unknown) & { __mcDefaultsWrapped?: true }

function wrapSlotFunctions(children: VNode['children'], defaults: McDefaultsInstance): VNode['children'] {
  if (Array.isArray(children)) return applyMcDefaults(children, defaults) as VNode['children']
  if (!children || typeof children !== 'object') return children
  const slots = children as Record<string, unknown>
  return Object.fromEntries(
    Object.entries(slots).map(([key, slot]) => {
      if (typeof slot !== 'function' || (slot as McDefaultSlot).__mcDefaultsWrapped) return [key, slot]
      const wrapped: McDefaultSlot = (...args: unknown[]) => applyMcDefaults(slot(...args), defaults)
      wrapped.__mcDefaultsWrapped = true
      return [key, wrapped]
    }),
  ) as VNode['children']
}

function patchArrayChildren(node: VNode, defaults: McDefaultsInstance): VNode {
  if (!Array.isArray(node.children)) return node
  const original = node.children
  const children = applyMcDefaults(original, defaults)
  if (children.length === original.length && children.every((child, index) => child === original[index])) return node
  const cloned = cloneVNode(node) as McDefaultVNode
  cloned.children = children as typeof cloned.children
  return cloned
}

/** Injects Defaults into McUI descendants. Empty config skips cloning so host trees stay hydratable. */
export function applyMcDefaults(nodes: unknown, defaults: McDefaultsInstance): unknown[] {
  const normalized = Array.isArray(nodes) ? nodes : [nodes]
  if (!hasConfiguredDefaults(defaults)) return normalized
  return normalized.map((node) => {
    if (!isVNode(node)) return node
    const name = componentName(node)
    if (isMcComponentName(name)) {
      const previousDefaultKeys = (node as McDefaultVNode).__mcDefaultKeys ?? new Set<string>()
      const patch: Record<string, unknown> = {}
      const nextDefaultKeys = new Set(previousDefaultKeys)
      for (const [key, value] of Object.entries(defaults.component(name as string))) {
        if (!declaresProp(node, key)) continue
        const explicit =
          (key in (node.props ?? {}) || kebabCase(key) in (node.props ?? {})) && !previousDefaultKeys.has(key)
        if (!explicit && value !== undefined) {
          patch[key] = value
          nextDefaultKeys.add(key)
        }
      }
      const cloned = cloneVNode(node, patch) as McDefaultVNode
      cloned.__mcDefaultKeys = nextDefaultKeys
      cloned.children = wrapSlotFunctions(node.children, defaults)
      return cloned
    }
    if (typeof node.type === 'string' || node.type === Fragment) return patchArrayChildren(node, defaults)
    if (node.children && typeof node.children === 'object' && !Array.isArray(node.children)) {
      node.children = wrapSlotFunctions(node.children, defaults)
    }
    return node
  })
}
