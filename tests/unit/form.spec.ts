import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import McForm from '../../src/components/McForm'
import McTextField from '../../src/components/McTextField'

describe('McForm', () => {
  it('validates required and asynchronous rules, then resets', async () => {
    const Host = defineComponent({
      components: { McForm, McTextField },
      setup() {
        const value = ref('')
        return { value, rules: [async (input: string) => input === 'ok' || 'Must be ok'] }
      },
      template: '<mc-form ref="form"><mc-text-field v-model="value" required :rules="rules" label="Name" /></mc-form>',
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(McForm)
    expect((await (form.vm as unknown as { validate: () => Promise<{ valid: boolean }> }).validate()).valid).toBe(false)
    await wrapper.find('input').setValue('ok')
    await nextTick()
    expect((await (form.vm as unknown as { validate: () => Promise<{ valid: boolean }> }).validate()).valid).toBe(true)
    ;(form.vm as unknown as { reset: () => void }).reset()
    await nextTick()
    expect((wrapper.vm as unknown as { value: string }).value).toBe('')
  })
})
