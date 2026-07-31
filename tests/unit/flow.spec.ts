import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { McExpansionPanel, McExpansionPanels, McNumberInput, McStepper } from '../../src'

describe('flow and advanced inputs', () => {
  it('uses the accordion keyboard model', async () => {
    const Host = defineComponent({
      components: { McExpansionPanels, McExpansionPanel },
      setup() {
        return { open: ref<string | null>(null) }
      },
      template: `<mc-expansion-panels v-model="open"><mc-expansion-panel value="a" title="A">Alpha</mc-expansion-panel><mc-expansion-panel value="b" title="B">Beta</mc-expansion-panel></mc-expansion-panels>`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const buttons = wrapper.findAll('.mc-expansion-panel__header')
    await buttons[0].trigger('click')
    expect((wrapper.vm as unknown as { open: string }).open).toBe('a')
    await buttons[0].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(buttons[1].element)
  })

  it('enforces linear stepper navigation', async () => {
    const wrapper = mount(McStepper, {
      props: {
        modelValue: 'one',
        linear: true,
        items: [
          { title: 'One', value: 'one' },
          { title: 'Two', value: 'two' },
          { title: 'Three', value: 'three' },
        ],
      },
    })
    expect(wrapper.findAll('.mc-stepper__step button')[2].attributes()).toHaveProperty('disabled')
    await wrapper.findAll('.mc-stepper__step button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two'])
  })

  it('keeps temporary number text and clamps on commit', async () => {
    const wrapper = mount(McNumberInput, { props: { modelValue: 2, min: 0, max: 10 } })
    const input = wrapper.get('input')
    await input.setValue('25')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10])
  })
})
