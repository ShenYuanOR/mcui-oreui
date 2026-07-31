import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { calculateConnectedPosition, createMcUI, McAppbar, McDrawer, McLayout, McMain } from '../../src'

describe('connected overlay positioning', () => {
  it('flips and shifts content at viewport edges', () => {
    const result = calculateConnectedPosition({
      activator: { top: 180, bottom: 200, left: 170, right: 200, width: 30, height: 20 },
      content: { width: 100, height: 80 },
      viewport: { width: 220, height: 220 },
      location: 'bottom start',
      padding: 8,
    })
    expect(result.location).toBe('top start')
    expect(result.top).toBe(100)
    expect(result.left).toBeLessThanOrEqual(112)
  })

  it('uses logical start in RTL', () => {
    const result = calculateConnectedPosition({
      activator: { top: 40, bottom: 60, left: 100, right: 140, width: 40, height: 20 },
      content: { width: 80, height: 40 },
      viewport: { width: 300, height: 200 },
      location: 'bottom start',
      rtl: true,
    })
    expect(result.left).toBe(60)
  })
})

describe('application layout', () => {
  it('registers appbar and permanent drawer offsets for McMain', async () => {
    const Host = defineComponent({
      components: { McLayout, McAppbar, McDrawer, McMain },
      setup() {
        return { drawer: ref(true) }
      },
      template: `<mc-layout><mc-appbar :height="52"/><mc-drawer v-model="drawer" mode="permanent" :size="280"/><mc-main id="main">Content</mc-main></mc-layout>`,
    })
    const wrapper = mount(Host, { global: { plugins: [createMcUI({ display: { ssrWidth: 1280 } })] } })
    await nextTick()
    expect(wrapper.get('#main').attributes('style')).toContain('--mc-layout-top: 52px')
    expect(wrapper.get('#main').attributes('style')).toContain('--mc-layout-start: 280px')
  })
})
