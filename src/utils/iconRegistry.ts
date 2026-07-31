import { defaultMcIcons, isMcIconDefinition } from '../framework/icons'
import type { McIconDefinition, McIconValue } from '../framework/types'

export type { McIconDefinition, McIconType } from '../framework/types'
export type McIconName = string

export function registerMcIcons(icons: Record<string, McIconValue>, setName = 'mc'): void {
  defaultMcIcons.register(setName, icons)
}

export function getMcIcon(name: string | undefined | null): McIconDefinition | undefined {
  const icon = defaultMcIcons.get(name)
  return isMcIconDefinition(icon) ? icon : undefined
}

export function hasMcIcon(name: string | undefined | null): boolean {
  return Boolean(defaultMcIcons.get(name))
}

export const mcIconNames: string[] = []
export const mcNormalIconNames: string[] = []
export const mcKeyIconNames: string[] = []
export const mcXIconNames: string[] = []
