import { cloneVNode, isVNode, type InjectionKey, type VNode } from 'vue'
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

/** Applies Defaults to arbitrary descendant VNodes, including components rendered through slots. */
export function applyMcDefaults(nodes: unknown, defaults: McDefaultsInstance): unknown[] {
  const normalized = Array.isArray(nodes) ? nodes : [nodes]
  return normalized.map((node) => {
    if (!isVNode(node)) return node
    const previousDefaultKeys = (node as McDefaultVNode).__mcDefaultKeys ?? new Set<string>()
    const name = componentName(node)
    const patch: Record<string, unknown> = {}
    const nextDefaultKeys = new Set(previousDefaultKeys)
    if (name) {
      for (const [key, value] of Object.entries(defaults.component(name))) {
        if (!declaresProp(node, key)) continue
        const explicit =
          (key in (node.props ?? {}) || kebabCase(key) in (node.props ?? {})) && !previousDefaultKeys.has(key)
        if (!explicit && value !== undefined) {
          patch[key] = value
          nextDefaultKeys.add(key)
        }
      }
    }
    const cloned = cloneVNode(node, patch) as McDefaultVNode
    cloned.__mcDefaultKeys = nextDefaultKeys
    if (Array.isArray(node.children))
      cloned.children = applyMcDefaults(node.children, defaults) as typeof cloned.children
    else if (node.children && typeof node.children === 'object') {
      const slots = node.children as Record<string, unknown>
      cloned.children = Object.fromEntries(
        Object.entries(slots).map(([key, slot]) => [
          key,
          typeof slot === 'function' ? (...args: unknown[]) => applyMcDefaults(slot(...args), defaults) : slot,
        ]),
      ) as typeof cloned.children
    }
    return cloned
  })
}
