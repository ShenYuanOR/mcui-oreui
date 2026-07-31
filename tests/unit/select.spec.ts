import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import McAutocomplete from '../../src/components/McAutocomplete'
import McSelect from '../../src/components/McSelect'

describe('McSelect', () => {
  it('navigates enabled options, selects, and closes with Escape', async () => {
    const wrapper = mount(McSelect, {
      props: {
        modelValue: null,
        options: [
          { title: 'Disabled', value: 'disabled', disabled: true },
          { title: 'Survival', value: 'survival' },
          { title: 'Creative', value: 'creative' },
        ],
      },
      attachTo: document.body,
    })
    const trigger = wrapper.find('[role="combobox"]')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(document.body.querySelector('[aria-disabled="true"]')?.textContent).toContain('Disabled')
    await trigger.trigger('keydown', { key: 'End' })
    expect(trigger.attributes('aria-activedescendant')).toMatch(/-option-2$/)
    await trigger.trigger('keydown', { key: 'Home' })
    expect(trigger.attributes('aria-activedescendant')).toMatch(/-option-1$/)
    await trigger.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['survival'])

    await trigger.trigger('click')
    await trigger.trigger('keydown', { key: 'Escape' })
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })
})

describe('McAutocomplete', () => {
  it('filters options and selects the active enabled result from the keyboard', async () => {
    const wrapper = mount(McAutocomplete, {
      props: {
        modelValue: null,
        options: [
          { title: 'Survival', value: 'survival', disabled: true },
          { title: 'Creative', value: 'creative' },
          { title: 'Adventure', value: 'adventure' },
        ],
      },
      attachTo: document.body,
    })
    const input = wrapper.find<HTMLInputElement>('[role="combobox"]')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'End' })
    expect(input.attributes('aria-activedescendant')).toMatch(/-option-2$/)
    await input.trigger('keydown', { key: 'Home' })
    expect(input.attributes('aria-activedescendant')).toMatch(/-option-1$/)
    await input.setValue('cre')
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(1)
    expect(document.body.querySelector('[role="option"]')?.textContent).toBe('Creative')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['creative'])
    expect(input.attributes('aria-expanded')).toBe('false')
  })
})
