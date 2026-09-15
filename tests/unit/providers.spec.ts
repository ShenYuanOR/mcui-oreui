import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  createMcUI,
  McAlert,
  McApp,
  McButton,
  McDefaultsProvider,
  McLocaleProvider,
  McThemeProvider,
  useMcLocale,
} from '../../src'

describe('scoped providers', () => {
  it('applies nested defaults with explicit props taking priority and does not leak', () => {
    const wrapper = mount(
      defineComponent({
        components: { McApp, McButton, McDefaultsProvider },
        template: `<mc-app><mc-button id="outside">Outside</mc-button><mc-defaults-provider :defaults="{ components: { McButton: { variant: 'error', size: 'large' } } }"><mc-button id="local">Local</mc-button><mc-button id="explicit" variant="primary">Explicit</mc-button></mc-defaults-provider></mc-app>`,
      }),
      {
        global: {
          plugins: [createMcUI({ defaults: { components: { McButton: { variant: 'plain', size: 'small' } } } })],
        },
      },
    )
    expect(wrapper.get('#outside').classes()).toContain('mc-button--plain')
    expect(wrapper.get('#local').classes()).toContain('mc-button--error')
    expect(wrapper.get('#local').classes()).toContain('mc-button--large')
    expect(wrapper.get('#explicit').classes()).toContain('mc-button--primary')
    expect(wrapper.get('#outside').classes()).not.toContain('mc-button--error')
  })

  it('applies nested McUI defaults through a third-party host without cloning that host', () => {
    const Foreign = defineComponent({
      setup(_, { slots }) {
        return () => h('div', { id: 'foreign' }, slots.default?.())
      },
    })
    const wrapper = mount(
      defineComponent({
        components: { McApp, McAlert, Foreign },
        template: `<mc-app><foreign><mc-alert id="nested">Hi</mc-alert></foreign></mc-app>`,
      }),
      {
        global: {
          plugins: [createMcUI({ defaults: { components: { McAlert: { variant: 'error' } } } })],
        },
      },
    )
    expect(wrapper.get('#foreign').exists()).toBe(true)
    expect(wrapper.get('#nested').classes()).toContain('mc-alert--error')
  })

  it('scopes theme and locale including English missing-key fallback', () => {
    const Probe = defineComponent({
      setup() {
        const locale = useMcLocale()
        return () => h('span', { id: 'message' }, `${locale.t('hello')} / ${locale.t('next')}`)
      },
    })
    const wrapper = mount(
      defineComponent({
        components: { McApp, McThemeProvider, McLocaleProvider, Probe },
        template: `<mc-app><div id="outside"/><mc-theme-provider :theme="{ colors: { primary: '#123456' } }"><mc-locale-provider locale="ar" :messages="{ ar: { hello: 'مرحبا' } }" :rtl="['ar']"><probe /></mc-locale-provider></mc-theme-provider></mc-app>`,
      }),
    )
    expect(wrapper.get('.mc-theme-provider').attributes('style')).toContain('--mc-primary: #123456')
    expect(wrapper.get('.mc-locale-provider').attributes('dir')).toBe('rtl')
    expect(wrapper.get('#message').text()).toBe('مرحبا / Next page')
    expect(wrapper.get('.mc-app').attributes('style')).not.toContain('#123456')
  })

  it('updates McThemeProvider name after mount', async () => {
    const wrapper = mount(McThemeProvider, {
      props: { name: 'purple', theme: { colors: { primary: '#7b4ab5' } } },
      slots: { default: 'Local' },
      global: { plugins: [createMcUI()] },
    })
    expect(wrapper.classes()).toContain('mc-theme--purple')
    await wrapper.setProps({ name: 'copper', theme: { colors: { primary: '#b36a3c' } } })
    expect(wrapper.classes()).toContain('mc-theme--copper')
    expect(wrapper.classes()).not.toContain('mc-theme--purple')
    expect(wrapper.attributes('style')).toContain('#b36a3c')
  })
})
