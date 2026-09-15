import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { McConfirm, McDialog } from '../../src'

describe('Dialog component family', () => {
  it('uses the Dialog body and actions sections for Confirm', () => {
    const wrapper = mount(McConfirm, {
      props: { modelValue: true, teleport: false, title: 'Delete world?', danger: true },
      slots: { default: 'This action cannot be undone.' },
    })
    const dialog = wrapper.get('.mc-confirm.mc-dialog')

    expect(Array.from(dialog.element.children).map((child) => child.className)).toEqual([
      'mc-dialog__header',
      'mc-dialog__body',
      'mc-dialog__actions',
    ])
    expect(dialog.get('.mc-dialog__body').text()).toBe('This action cannot be undone.')
    expect(dialog.find('.mc-confirm__content').exists()).toBe(false)
    expect(dialog.find('.mc-confirm__actions').exists()).toBe(true)
    expect(dialog.findAll('.mc-confirm__action')).toHaveLength(2)
  })

  it('defaults Confirm to the Dialog teleport target and preserves action events', async () => {
    const defaults = mount(McConfirm)
    expect(defaults.findComponent(McDialog).props('teleport')).toBe('body')

    const wrapper = mount(McConfirm, {
      props: { modelValue: true, teleport: false, stackActions: true },
      slots: { default: 'Confirm action' },
    })
    expect(wrapper.get('.mc-confirm').classes()).toContain('mc-confirm--stack-actions')

    const actions = wrapper.findAll('.mc-confirm__action button')
    await actions[0].trigger('click')
    await actions[1].trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false], [false]])
  })

  it('emits cancel when Dialog closes without confirming', async () => {
    const wrapper = mount(McConfirm, {
      props: { modelValue: true, teleport: false, showClose: true, title: 'Delete?' },
    })
    await wrapper.get('.mc-dialog__close').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })
})
