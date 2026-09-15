import type { Component, Ref } from 'vue'

export type McThemeColorValue = string

export interface McThemeDefinition {
  dark?: boolean
  colors?: Record<string, McThemeColorValue>
  variables?: Record<string, string | number>
  fonts?: Partial<Record<'title' | 'ui' | 'body', string>>
}

export interface McThemeOptions {
  defaultTheme?: string
  themes?: Record<string, McThemeDefinition>
}

export interface McDefaultsOptions {
  global?: Record<string, unknown>
  components?: Record<string, Record<string, unknown>>
}

export interface McLocaleMessages {
  [key: string]: string | McLocaleMessages
}

export interface McLocaleOptions {
  locale?: string
  fallback?: string
  messages?: Record<string, McLocaleMessages>
  rtl?: string[] | Record<string, boolean>
}

export type McValidateOn = 'input' | 'blur' | 'submit' | 'lazy'

export type McIconType = 'normal' | 'key' | 'x' | 'custom'

export type McIconNodeName = 'svg' | 'path' | 'image'

export interface McIconNode {
  readonly name: McIconNodeName
  readonly attrs?: Readonly<Record<string, string | number>>
  readonly children?: readonly McIconNode[]
}

export interface McIconDefinition {
  name?: string
  type?: McIconType
  node: McIconNode
  colorable?: boolean
}

export type McIconValue = McIconDefinition | Component

export interface McIconSet {
  component?: Component
  icons?: Record<string, McIconValue>
}

export interface McIconOptions {
  defaultSet?: string
  aliases?: Record<string, string>
  sets?: Record<string, McIconSet>
}

export type McSoundType = 'click' | 'button' | 'pop' | 'hide' | 'open' | 'close' | 'toast' | 'xp'
export type McSoundAdapter = (source: string, type: McSoundType) => void | Promise<void>

export interface McSoundOptions {
  enabled?: boolean
  sounds?: Partial<Record<McSoundType, string>>
  adapter?: McSoundAdapter
}

export type McBreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface McDisplayOptions {
  thresholds?: Partial<Record<Exclude<McBreakpointName, 'xs'>, number>>
  mobileBreakpoint?: McBreakpointName | number
  /** SSR and first-paint width. Defaults to the `md` threshold (960) so hydration matches a desktop-first layout. */
  ssrWidth?: number
}

export interface McUIOptions {
  theme?: McThemeOptions
  defaults?: McDefaultsOptions
  locale?: McLocaleOptions
  icons?: McIconOptions
  sounds?: McSoundOptions
  display?: McDisplayOptions
}

export interface McThemeInstance {
  name: Ref<string>
  current: Readonly<Ref<McThemeDefinition>>
  isDark: Readonly<Ref<boolean>>
  classes: Readonly<Ref<string[]>>
  styles: Readonly<Ref<Record<string, string>>>
  themes: Ref<Record<string, McThemeDefinition>>
  setTheme: (name: string) => void
}
