import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMcUI, McApp, McButton, useMcForm } from '../../src'
import { useMcDisplay, useMcLocale, useMcTheme } from '../../src'
import { createMcDisplay } from '../../src/framework/display'

describe('framework services', () => {
  it('applies themes and component defaults without touching the host root', async () => {
    const Probe = defineComponent({
      setup() {
        const theme = useMcTheme()
        const locale = useMcLocale()
        theme.setTheme('light')
        return () => h(McApp, null, { default: () => h(McButton, null, () => locale.t('hello')) })
      },
    })
    const wrapper = mount(Probe, {
      global: {
        plugins: [
          createMcUI({
            theme: { defaultTheme: 'ore', themes: { light: { dark: false, colors: { primary: '#123456' } } } },
            defaults: { components: { McButton: { variant: 'primary', size: 'large' } } },
            locale: { locale: 'ar', fallback: 'en', messages: { ar: { hello: 'مرحبا' } }, rtl: ['ar'] },
          }),
        ],
      },
    })
    expect(wrapper.find('.mc-app').classes()).toContain('mc-theme--light')
    expect(wrapper.find('.mc-app').attributes('dir')).toBe('rtl')
    expect(wrapper.find('.mc-app').attributes('style')).toContain('--mc-primary: #123456')
    expect(wrapper.find('button').classes()).toContain('mc-button--primary')
    expect(wrapper.find('button').classes()).toContain('mc-button--large')
    expect(document.documentElement.getAttribute('style') ?? '').not.toContain('--mc-primary')
  })

  it('uses the configured SSR width before mounting', () => {
    const display = createMcDisplay({ ssrWidth: 800 })
    expect(display.width.value).toBe(800)
    expect(display.name.value).toBe('sm')
    expect(display.mobile.value).toBe(true)

    const Probe = defineComponent({
      setup() {
        const runtime = useMcDisplay()
        return () => h('span', { 'data-name': runtime.name.value, 'data-mobile': String(runtime.mobile.value) })
      },
    })
    const wrapper = mount(Probe, { global: { plugins: [createMcUI({ display: { ssrWidth: 800 } })] } })
    expect(wrapper.attributes('data-name')).toBeTruthy()
  })

  it('defaults SSR width to md and does not provide a global form', () => {
    const display = createMcDisplay()
    expect(display.width.value).toBe(960)
    expect(display.name.value).toBe('md')

    const Probe = defineComponent({
      setup() {
        return () => h('span', { 'data-form': String(useMcForm() !== null) })
      },
    })
    const wrapper = mount(Probe, { global: { plugins: [createMcUI()] } })
    expect(wrapper.attributes('data-form')).toBe('false')
  })
})
