import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { McPanel } from '../../src'

describe('McPanel workspace structure', () => {
  it('renders fixed header and footer regions around the default body', () => {
    const wrapper = mount(McPanel, {
      props: { title: 'World settings', subtitle: 'Workspace' },
      slots: {
        actions: () => h('button', 'Refresh'),
        default: () => h('div', { class: 'content' }, 'Panel body'),
        footer: () => h('button', 'Save'),
      },
    })

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.get('.mc-panel__header').element.tagName).toBe('HEADER')
    expect(wrapper.get('.mc-panel__title').text()).toBe('World settings')
    expect(wrapper.get('.mc-panel__subtitle').text()).toBe('Workspace')
    expect(wrapper.get('.mc-panel__actions').get('button').text()).toBe('Refresh')
    expect(wrapper.get('.mc-panel__body').text()).toBe('Panel body')
    expect(wrapper.get('.mc-panel__footer').element.tagName).toBe('FOOTER')
    expect(wrapper.get('.mc-panel__footer').get('button').text()).toBe('Save')
    expect(wrapper.classes()).not.toContain('mc-panel--bordered')
    expect(wrapper.classes()).not.toContain('mc-panel--elevated')
  })

  it('keeps a body-only panel structurally independent from optional regions', () => {
    const wrapper = mount(McPanel, { slots: { default: 'Body only' } })

    expect(wrapper.find('.mc-panel__header').exists()).toBe(false)
    expect(wrapper.get('.mc-panel__body').text()).toBe('Body only')
    expect(wrapper.find('.mc-panel__footer').exists()).toBe(false)
  })
})
