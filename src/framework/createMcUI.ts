import type { App, Component, Plugin } from 'vue'
import { createMcDefaults, mcDefaultsKey, type McDefaultsInstance } from './defaults'
import { createMcDisplay, mcDisplayKey, type McDisplayInstance } from './display'
import { createMcForm, mcFormKey, type McFormInstance } from './form'
import { createMcIcons, mcIconsKey, type McIconInstance } from './icons'
import { createMcLocale, mcLocaleKey, type McLocaleInstance } from './locale'
import { createMcOverlay, mcOverlayKey, type McOverlayInstance } from './overlay'
import { createMcPop, mcPopKey, type McPopInstance } from './pop'
import { createMcSounds, mcSoundsKey, type McSoundInstance } from './sounds'
import { createMcTheme, mcThemeKey } from './theme'
import type { McThemeInstance, McUIOptions } from './types'

export type McComponentRegistry = Record<string, Component>

export interface McUIServices {
  theme: McThemeInstance
  defaults: McDefaultsInstance
  locale: McLocaleInstance
  display: McDisplayInstance
  icons: McIconInstance
  sounds: McSoundInstance
  overlay: McOverlayInstance
  form: McFormInstance
  pop: McPopInstance
}

export type McUIPlugin = Plugin & { readonly services: Readonly<McUIServices> }

export function createMcUIPlugin(options: McUIOptions, components: McComponentRegistry): McUIPlugin {
  const theme = createMcTheme(options.theme)
  const defaults = createMcDefaults(options.defaults)
  const locale = createMcLocale(options.locale)
  const icons = createMcIcons(options.icons)
  const sounds = createMcSounds(options.sounds)
  const display = createMcDisplay(options.display)
  const overlay = createMcOverlay()
  const form = createMcForm()
  const pop = createMcPop(sounds)
  const services = Object.freeze({ theme, defaults, locale, display, icons, sounds, overlay, form, pop })
  let installedApp: App | undefined

  return {
    services,
    install(app: App) {
      if (installedApp && installedApp !== app) {
        throw new Error(
          'A McUI plugin instance can only be installed into one Vue app. Call createMcUI() for each app.',
        )
      }
      if (installedApp === app) return
      installedApp = app
      app.provide(mcThemeKey, theme)
      app.provide(mcDefaultsKey, defaults)
      app.provide(mcLocaleKey, locale)
      app.provide(mcIconsKey, icons)
      app.provide(mcSoundsKey, sounds)
      app.provide(mcDisplayKey, display)
      app.provide(mcOverlayKey, overlay)
      app.provide(mcFormKey, form)
      app.provide(mcPopKey, pop)
      display.mount()
      for (const [name, component] of Object.entries(components)) {
        app.component(name, component)
        app.component(name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(), component)
      }
      app.onUnmount(() => {
        pop.dispose()
        form.dispose()
        overlay.dispose()
        display.dispose()
        sounds.dispose()
      })
    },
  }
}
