import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMcUI } from '../../src'
import McDialog from '../../src/components/McDialog'

describe('overlay behavior', () => {
  it('traps focus, closes on Escape, restores focus, and unlocks scrolling', async () => {
    const Host = defineComponent({
      components: { McDialog },
      setup() {
        return { open: ref(false), closes: ref(0) }
      },
      template: `
        <mc-dialog v-model="open" title="Settings" @close="closes++">
          <template #activator="{ props }"><button id="activate" v-bind="props">Open</button></template>
          <button id="first">First</button><button id="last">Last</button>
        </mc-dialog>`,
    })
    const wrapper = mount(Host, { attachTo: document.body, global: { plugins: [createMcUI()] } })
    const activator = wrapper.find('#activate')
    await activator.trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(document.querySelector('[role="dialog"]')?.contains(document.activeElement)).toBe(true)
    const last = document.querySelector<HTMLButtonElement>('#last')!
    last.focus()
    last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(document.activeElement).toBe(document.querySelector('.mc-dialog__close'))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(activator.element)
    expect(document.documentElement.style.overflow).toBe('')
    expect(wrapper.vm.closes).toBe(1)

    await activator.trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 0))
    document.querySelector<HTMLButtonElement>('.mc-dialog__close')!.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.closes).toBe(2)
  })

  it('keeps Tab cycling when focus is outside the overlay content', async () => {
    const Host = defineComponent({
      components: { McDialog },
      setup() {
        return { open: ref(true) }
      },
      template: `
        <button id="outside">Outside</button>
        <mc-dialog v-model="open" title="Settings" :teleport="false" :show-close="false">
          <button id="first">First</button><button id="last">Last</button>
        </mc-dialog>`,
    })
    const wrapper = mount(Host, { attachTo: document.body, global: { plugins: [createMcUI()] } })
    await new Promise((resolve) => setTimeout(resolve, 0))
    document.getElementById('outside')!.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(document.activeElement).toBe(document.querySelector('#first'))
    wrapper.unmount()
  })
})
