import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import McCheckbox from '../../src/components/McCheckbox'
import McForm from '../../src/components/McForm'
import McFormField from '../../src/components/McFormField'
import McRadio from '../../src/components/McRadio'
import McFileInput from '../../src/components/McFileInput'
import McRadioGroup from '../../src/components/McRadioGroup'
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
    expect(form.find('.mc-form-field--error').exists()).toBe(false)
  })

  it('treats empty error arrays as no error and required false as empty', async () => {
    const emptyErrors = mount(McFormField, { props: { error: [] } })
    expect(emptyErrors.find('.mc-form-field--error').exists()).toBe(false)

    const Host = defineComponent({
      components: { McForm, McCheckbox },
      setup() {
        return { enabled: ref(false) }
      },
      template: '<mc-form ref="form"><mc-checkbox v-model="enabled" required label="Enabled" /></mc-form>',
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(McForm)
    expect((await (form.vm as unknown as { validate: () => Promise<{ valid: boolean }> }).validate()).valid).toBe(false)
    await wrapper.find('input').setValue(true)
    expect((await (form.vm as unknown as { validate: () => Promise<{ valid: boolean }> }).validate()).valid).toBe(true)
  })

  it('registers a radio group as a single field', async () => {
    const Host = defineComponent({
      components: { McForm, McRadioGroup, McRadio },
      setup() {
        return { value: ref('') }
      },
      template: `
        <mc-form ref="form">
          <mc-radio-group v-model="value" required label="Mode">
            <mc-radio value="a">A</mc-radio>
            <mc-radio value="b">B</mc-radio>
          </mc-radio-group>
        </mc-form>`,
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(McForm)
    const result = await (form.vm as unknown as { validate: () => Promise<{ valid: boolean; errors: string[] }> }).validate()
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveLength(1)
  })

  it('ignores stale async validation after reset', async () => {
    let release: (value: true | string) => void = () => undefined
    const Host = defineComponent({
      components: { McForm, McTextField },
      setup() {
        const value = ref('wait')
        return {
          value,
          rules: [
            () =>
              new Promise<true | string>((resolve) => {
                release = resolve
              }),
          ],
        }
      },
      template: '<mc-form ref="form"><mc-text-field v-model="value" :rules="rules" label="Name" /></mc-form>',
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(McForm)
    const pending = (form.vm as unknown as { validate: () => Promise<{ valid: boolean; errors: string[] }> }).validate()
    ;(form.vm as unknown as { reset: () => void }).reset()
    await nextTick()
    release('stale')
    await pending
    await nextTick()
    expect(form.find('.mc-form-field--error').exists()).toBe(false)
  })

  it('counts FileInput type errors in form validity', async () => {
    const Host = defineComponent({
      components: { McForm, McFileInput },
      setup() {
        return { files: ref<File | null>(null) }
      },
      template: '<mc-form ref="form"><mc-file-input v-model="files" accept=".txt" /></mc-form>',
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(McForm)
    const input = wrapper.get('input')
    const png = new File(['x'], 'skin.png', { type: 'image/png' })
    Object.defineProperty(input.element, 'files', { configurable: true, value: [png] })
    await input.trigger('change')
    await nextTick()
    expect(wrapper.text()).toContain('仅支持')
    expect((await (form.vm as unknown as { validate: () => Promise<{ valid: boolean }> }).validate()).valid).toBe(false)
  })
})
