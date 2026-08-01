import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { McCheckbox, McList, McListItem, McRadio, McSlider, McSwitch, McTabs } from '../../src'

describe('accessible input controls', () => {
  it('uses native checkbox, switch, and radio controls', async () => {
    const checkbox = mount(McCheckbox, { props: { modelValue: false, label: 'Enabled' } })
    await checkbox.find('input').setValue(true)
    expect(checkbox.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(checkbox.find('.mc-checkbox__mark img').exists()).toBe(true)
    expect(checkbox.find('.mc-checkbox__mark').text()).toBe('')

    const mixed = mount(McCheckbox, { props: { indeterminate: true, label: 'Mixed' } })
    expect(mixed.find('.mc-checkbox__mark--mixed').exists()).toBe(true)
    expect(mixed.find('.mc-checkbox__mark img').exists()).toBe(false)
    expect(mixed.find('.mc-checkbox__mark').text()).toBe('')

    const toggle = mount(McSwitch, { props: { modelValue: false, label: 'Music' } })
    expect(toggle.find('input').attributes('role')).toBe('switch')
    expect(toggle.find('.mc-switch__track').exists()).toBe(true)
    expect(toggle.findAll('.mc-switch__mark')).toHaveLength(2)
    expect(toggle.find('.mc-switch__thumb').exists()).toBe(true)
    await toggle.find('input').setValue(true)
    expect(toggle.emitted('change')?.[0]).toEqual([true])

    const radio = mount(McRadio, { props: { modelValue: 'a', value: 'b', label: 'B' } })
    expect(radio.find('input').attributes('type')).toBe('radio')
    await radio.find('input').setValue(true)
    expect(radio.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('uses the pixel check asset for list multiple-selection indicators', () => {
    const list = mount(McList, {
      props: { modelValue: ['selected'], mode: 'multiple' },
      slots: { default: () => h(McListItem, { label: 'Selected', value: 'selected' }) },
    })
    expect(list.find('.mc-list__checkbox img').exists()).toBe(true)
    expect(list.find('.mc-list__checkbox').text()).toBe('')
  })

  it('renders the single-selection indicator as a square radio control', () => {
    const list = mount(McList, {
      props: { modelValue: 'selected', mode: 'single' },
      slots: { default: () => h(McListItem, { label: 'Selected', value: 'selected' }) },
    })
    expect(list.find('.mc-list__radio').classes()).toContain('mc-list__radio--checked')
  })

  it('exposes slider values and supports Home/End/Page keys', async () => {
    const wrapper = mount(McSlider, {
      props: { modelValue: 50, min: 0, max: 100, step: 5 },
      attrs: { 'aria-label': 'Volume' },
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('range')
    expect(input.attributes('role')).toBe('slider')
    expect(input.attributes('aria-label')).toBe('Volume')
    expect(input.attributes('aria-valuemin')).toBe('0')
    expect(input.attributes('aria-valuemax')).toBe('100')
    expect(input.attributes('aria-valuenow')).toBe('50')
    expect(wrapper.find('.mc-slider__visual').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.mc-slider__track').exists()).toBe(true)
    expect(wrapper.find('.mc-slider__fill').exists()).toBe(true)
    expect(wrapper.find('.mc-slider__thumb').exists()).toBe(true)
    await input.trigger('keydown', { key: 'Home' })
    await input.trigger('keydown', { key: 'End' })
    await input.trigger('keydown', { key: 'PageDown' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[0], [100], [0]])
  })

  it('implements tabs roving focus and panel relationships', async () => {
    const wrapper = mount(McTabs, {
      props: {
        modelValue: 'one',
        items: [
          { label: 'One', value: 'one' },
          { label: 'Disabled', value: 'disabled', disabled: true },
          { label: 'Three', value: 'three' },
        ],
      },
      attachTo: document.body,
    })
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs[0].attributes('tabindex')).toBe('0')
    expect(tabs[2].attributes('tabindex')).toBe('-1')
    const panels = wrapper.findAll('[role="tabpanel"]')
    expect(panels).toHaveLength(tabs.length)
    expect(tabs[0].attributes('aria-controls')).toBe(panels[0].attributes('id'))
    expect(tabs[2].attributes('aria-controls')).toBe(panels[2].attributes('id'))
    await tabs[0].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['three'])
    expect(document.activeElement).toBe(tabs[2].element)
    await tabs[2].trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(tabs[0].element)
    await tabs[0].trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(tabs[2].element)
  })
})
