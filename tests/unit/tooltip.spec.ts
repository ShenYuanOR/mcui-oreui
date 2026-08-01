import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { McTooltip } from '../../src'

describe('McTooltip content surface', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps multi-line slot content inside one block-level tooltip element', async () => {
    vi.useFakeTimers()
    const wrapper = mount(McTooltip, {
      props: { teleport: false },
      slots: {
        default: 'Trigger',
        content: () => [h('strong', 'Tooltip title'), h('br'), 'Tooltip text'],
      },
    })

    await wrapper.get('.mc-tooltip__trigger').trigger('mouseenter')
    vi.runAllTimers()
    await nextTick()

    const tooltip = wrapper.get('[role="tooltip"]')
    expect(tooltip.element.tagName).toBe('DIV')
    expect(tooltip.get('strong').text()).toBe('Tooltip title')
    expect(tooltip.text()).toContain('Tooltip text')

    wrapper.unmount()
  })
})
