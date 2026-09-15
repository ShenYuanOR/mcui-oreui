import { getCurrentInstance } from 'vue'
import { defaultMcIcons, isMcIconDefinition, useMcIcons, type McIconInstance } from '../framework/icons'
import type { McIconDefinition, McIconValue } from '../framework/types'

export type { McIconDefinition, McIconType } from '../framework/types'
export type McIconName = string

let lastInstalledIcons: McIconInstance | undefined

export function setActiveMcIcons(instance: McIconInstance | undefined): void {
  lastInstalledIcons = instance
}

function resolveIcons(): McIconInstance {
  if (getCurrentInstance()) return useMcIcons()
  return lastInstalledIcons ?? defaultMcIcons
}

export function registerMcIcons(icons: Record<string, McIconValue>, setName = 'mc'): void {
  resolveIcons().register(setName, icons)
}

export function getMcIcon(name: string | undefined | null): McIconDefinition | undefined {
  const icon = resolveIcons().get(name)
  return isMcIconDefinition(icon) ? icon : undefined
}

export function hasMcIcon(name: string | undefined | null): boolean {
  return Boolean(resolveIcons().get(name))
}

export const mcIconNames: string[] = []
export const mcNormalIconNames: string[] = []
export const mcKeyIconNames: string[] = []
export const mcXIconNames: string[] = []
