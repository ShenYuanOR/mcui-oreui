import { type InjectionKey } from 'vue'
import { useMcService } from './fallback'
import type { McIconDefinition, McIconNode, McIconOptions, McIconSet, McIconValue } from './types'

export interface McIconInstance {
  defaultSet: string
  aliases: Record<string, string>
  sets: Record<string, McIconSet>
  get: (name?: string | null) => McIconValue | undefined
  register: (setName: string, icons: Record<string, McIconValue>) => void
  names: (setName?: string) => string[]
}

export const mcIconsKey: InjectionKey<McIconInstance> = Symbol.for('mcui:icons')

const safeAttributes = {
  svg: new Set(['xmlns', 'width', 'height', 'viewBox', 'shape-rendering']),
  path: new Set(['d', 'fill', 'fill-opacity', 'shape-rendering']),
  image: new Set(['width', 'height', 'x', 'y', 'href']),
} as const

function assertSafeNode(node: McIconNode, root = false): void {
  if (!node || !['svg', 'path', 'image'].includes(node.name))
    throw new TypeError('McIcon nodes only support svg, path and image')
  if (root && node.name !== 'svg') throw new TypeError('A McIcon definition must have an svg root node')
  for (const [name, rawValue] of Object.entries(node.attrs ?? {})) {
    if (/^on/i.test(name) || !(safeAttributes[node.name] as ReadonlySet<string>).has(name)) {
      throw new TypeError(`Unsafe McIcon ${node.name} attribute: ${name}`)
    }
    const value = String(rawValue)
    if (/javascript:|(?:^|\W)url\s*\(/i.test(value)) throw new TypeError(`Unsafe McIcon attribute value: ${name}`)
    if (node.name === 'image' && name === 'href' && !/^data:image\/png;base64,[a-z0-9+/=]+$/i.test(value)) {
      throw new TypeError('McIcon image href must be an embedded PNG data URL')
    }
  }
  if (node.name !== 'svg' && node.children?.length)
    throw new TypeError(`McIcon ${node.name} nodes cannot have children`)
  for (const child of node.children ?? []) {
    if (child.name === 'svg') throw new TypeError('Nested McIcon svg nodes are not allowed')
    assertSafeNode(child)
  }
}

export function assertSafeMcIconDefinition(value: unknown): asserts value is McIconDefinition {
  if (!isMcIconDefinition(value)) throw new TypeError('McIcon definitions must use a structured node')
  assertSafeNode(value.node, true)
}

export function createMcIcons(options: McIconOptions = {}): McIconInstance {
  const sets: Record<string, McIconSet> = {}
  for (const [setName, set] of Object.entries(options.sets ?? {})) {
    const icons = { ...(set.icons ?? {}) }
    for (const icon of Object.values(icons)) {
      if (typeof icon === 'string') throw new TypeError('Raw SVG strings are not supported by McIcon')
      if (isMcIconDefinition(icon)) assertSafeMcIconDefinition(icon)
    }
    sets[setName] = { ...set, icons }
  }
  const aliases = { ...(options.aliases ?? {}) }
  const defaultSet = options.defaultSet ?? 'mc'

  const instance: McIconInstance = {
    defaultSet,
    aliases,
    sets,
    get(name) {
      const rawName = name?.trim()
      if (!rawName) return undefined
      const aliased = aliases[rawName] ?? rawName
      const separator = aliased.indexOf(':')
      const setName = separator > 0 ? aliased.slice(0, separator) : defaultSet
      const iconName = separator > 0 ? aliased.slice(separator + 1) : aliased
      return sets[setName]?.icons?.[iconName]
    },
    register(setName, icons) {
      for (const icon of Object.values(icons)) {
        if (typeof icon === 'string') throw new TypeError('Raw SVG strings are not supported by McIcon')
        if (isMcIconDefinition(icon)) assertSafeMcIconDefinition(icon)
      }
      const current = sets[setName] ?? {}
      sets[setName] = { ...current, icons: { ...(current.icons ?? {}), ...icons } }
    },
    names(setName = defaultSet) {
      return Object.keys(sets[setName]?.icons ?? {}).sort()
    },
  }
  return instance
}

export const defaultMcIcons = createMcIcons()

export function useMcIcons(): McIconInstance {
  return useMcService(mcIconsKey, createMcIcons)
}

export function isMcIconDefinition(value: unknown): value is McIconDefinition {
  return Boolean(value && typeof value === 'object' && 'node' in value)
}
