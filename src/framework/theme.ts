import { computed, ref, type InjectionKey } from 'vue'
import { useMcService } from './fallback'
import type { McThemeDefinition, McThemeInstance, McThemeOptions } from './types'

export const defaultMcTheme: McThemeDefinition = {
  dark: true,
  colors: {
    background: '#48494a',
    surface: '#313233',
    'surface-light': '#58585a',
    primary: '#3c8527',
    'primary-hover': '#2a641c',
    'primary-active': '#1d4d13',
    'primary-tint': '#6cc349',
    secondary: '#d0d1d4',
    'secondary-hover': '#b1b2b5',
    'secondary-active': '#b1b2b5',
    error: '#ca3636',
    'error-hover': '#c02d2d',
    warning: '#ffe866',
    info: '#2e6be5',
    success: '#3c8527',
    border: '#1e1e1f',
    text: '#ffffff',
    'text-muted': '#d0d1d4',
    'text-dimmest': '#b1b2b5',
    disabled: '#d0d1d4',
    'disabled-shadow': '#b1b2b5',
    'disabled-border': '#8c8d90',
    'disabled-text': '#48494a',
    focus: '#ffffff',
    shadow: '#000000',
    scrim: 'rgba(0, 0, 0, .62)',
    'on-primary': '#ffffff',
    'on-secondary': '#1e1e1f',
    'on-warning': '#1e1e1f',
    'control-inactive': '#8c8d90',
    'surface-bright': '#e6e8eb',
    'surface-high': '#f4f6f9',
    'border-muted': '#a1a3a5',
    'border-strong': '#131313',
    'text-inverse': '#3c3c3c',
    'error-active': '#ad1d1d',
  },
  fonts: {
    title: "'Minecraft Ten', sans-serif",
    ui: "'Minecraft Seven', sans-serif",
    body: "'Noto Sans', sans-serif",
  },
}

export const mcThemeKey: InjectionKey<McThemeInstance> = Symbol.for('mcui:theme')

function toCssName(name: string): string {
  return name.startsWith('--') ? name : `--mc-${name}`
}

export function createMcTheme(options: McThemeOptions = {}, parent?: McThemeInstance): McThemeInstance {
  const themes = ref<Record<string, McThemeDefinition>>({
    ore: defaultMcTheme,
    ...(parent?.themes.value ?? {}),
    ...(options.themes ?? {}),
  })
  const name = ref(options.defaultTheme ?? parent?.name.value ?? 'ore')
  const current = computed(() => themes.value[name.value] ?? themes.value.ore ?? defaultMcTheme)
  const isDark = computed(() => current.value.dark ?? true)
  const classes = computed(() => [
    'mc-theme',
    `mc-theme--${name.value}`,
    isDark.value ? 'mc-theme--dark' : 'mc-theme--light',
  ])
  const styles = computed<Record<string, string>>(() => {
    const value: Record<string, string> = {}
    for (const [key, color] of Object.entries(current.value.colors ?? {})) {
      value[toCssName(key)] = color
    }
    for (const [key, variable] of Object.entries(current.value.variables ?? {})) {
      value[toCssName(key)] = String(variable)
    }
    for (const [key, font] of Object.entries(current.value.fonts ?? {})) {
      if (font) value[`--mc-font-${key}`] = font
    }
    value.colorScheme = 'only light'
    return value
  })

  return {
    name,
    current,
    isDark,
    classes,
    styles,
    themes,
    setTheme(nextName: string) {
      if (themes.value[nextName]) name.value = nextName
    },
  }
}

export function useMcTheme(): McThemeInstance {
  return useMcService(mcThemeKey, createMcTheme)
}
