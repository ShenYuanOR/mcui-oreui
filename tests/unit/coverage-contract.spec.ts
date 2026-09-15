import { mount } from '@vue/test-utils'
import { defineComponent, Fragment, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as defaultsEntry from '../../src/composables/defaults'
import * as displayEntry from '../../src/composables/display'
import * as formEntry from '../../src/composables/form'
import * as iconsEntry from '../../src/composables/icons'
import * as localeEntry from '../../src/composables/locale'
import * as overlayEntry from '../../src/composables/overlay'
import * as soundsEntry from '../../src/composables/sounds'
import * as themeEntry from '../../src/composables/theme'
import {
  McAutocomplete,
  McButton,
  McCheckbox,
  McBreadcrumbs,
  McDataTable,
  McDialog,
  McDrawer,
  McExpansionPanel,
  McExpansionPanels,
  McFileInput,
  McFormField,
  McIcon,
  McList,
  McListItem,
  McNumberInput,
  McOverlay,
  McPagination,
  McProgress,
  McRadio,
  McScrollView,
  McSelect,
  McSlider,
  McStepper,
  McSwitch,
  McTooltip,
  McVirtualScroll,
  createMcUI,
  createMcFormattingState,
  parseMcFormatCodes,
  renderMcFormatCodes,
  stripMcFormatCodes,
} from '../../src'
import mcAllIconSet from '../../src/icons/all'
import mcKeyIconSet from '../../src/icons/key'
import mcNormalIconSet from '../../src/icons/normal'
import mcXIconSet from '../../src/icons/x'
import mcDefaultSounds from '../../src/sounds/default'
import { createMcLocale } from '../../src/framework/locale'
import { calculateConnectedPosition } from '../../src/framework/overlay'
import { createMcPop } from '../../src/framework/pop'
import { createMcSounds } from '../../src/framework/sounds'
import { createMcTheme } from '../../src/framework/theme'
import { getMcIcon, hasMcIcon, registerMcIcons } from '../../src/utils/iconRegistry'
import { setPixelIconCache } from '../../src/utils/pixelIconCache'

interface ValidationVm {
  validate: () => Promise<boolean>
  reset: () => void
  onBlur: () => void
}

interface SelectVm extends ValidationVm {
  close: () => void
}

async function exerciseValidation(vm: unknown) {
  const validation = vm as ValidationVm
  expect(typeof (await validation.validate())).toBe('boolean')
  validation.onBlur()
  validation.reset()
  await nextTick()
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('coverage-enforced public contracts', () => {
  it('executes explicit entry points, format codes, and the icon registry', () => {
    expect([
      defaultsEntry.createMcDefaults,
      displayEntry.createMcDisplay,
      formEntry.createMcForm,
      iconsEntry.createMcIcons,
      localeEntry.createMcLocale,
      overlayEntry.createMcOverlay,
      soundsEntry.createMcSounds,
      themeEntry.createMcTheme,
    ]).not.toContain(undefined)
    expect(Object.keys(mcAllIconSet.icons ?? {}).length).toBe(
      Object.keys(mcKeyIconSet.icons ?? {}).length +
        Object.keys(mcNormalIconSet.icons ?? {}).length +
        Object.keys(mcXIconSet.icons ?? {}).length,
    )
    expect(mcDefaultSounds).toHaveProperty('click')

    expect(createMcFormattingState()).toMatchObject({ bold: false, color: undefined })
    const source = 'plain§a green§l bold§o italic§m strike§n underline§k magic§r reset§z unknown§'
    expect(parseMcFormatCodes(source)).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'unknown' })]))
    expect(parseMcFormatCodes('§Lbedrock', 'bedrock')[0]).toMatchObject({ type: 'format', code: 'l' })
    expect(renderMcFormatCodes(source)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: expect.any(String) }),
        expect.objectContaining({ bold: true }),
        expect.objectContaining({ italic: true }),
        expect.objectContaining({ strikethrough: true }),
        expect.objectContaining({ underline: true }),
        expect.objectContaining({ obfuscated: true }),
      ]),
    )
    expect(stripMcFormatCodes('§aGreen')).toBe('Green')

    const plugin = createMcUI()
    const appHost = mount(defineComponent({ template: '<span />' }), { global: { plugins: [plugin] } })
    registerMcIcons({ coverage: mcNormalIconSet.icons?.['mc-add'] ?? Object.values(mcNormalIconSet.icons ?? {})[0] })
    expect(hasMcIcon('coverage')).toBe(true)
    expect(getMcIcon('coverage')).toBeDefined()
    expect(getMcIcon(null)).toBeUndefined()
    expect(plugin.services.icons.get('coverage')).toBeDefined()
    appHost.unmount()
  })

  it('validates and interacts with native selection controls', async () => {
    const rule = vi.fn(() => true as const)
    const checkbox = mount(McCheckbox, {
      props: { modelValue: false, required: true, readonly: true, validateOn: 'blur', rules: [rule] },
    })
    await exerciseValidation(checkbox.vm)
    await checkbox.get('input').trigger('click')
    await checkbox.get('input').trigger('blur')
    await checkbox.setProps({ readonly: false })
    await checkbox.get('input').setValue(true)

    const toggle = mount(McSwitch, {
      props: { modelValue: false, required: true, readonly: true, validateOn: 'blur', rules: [rule] },
    })
    await exerciseValidation(toggle.vm)
    await toggle.get('input').trigger('click')
    await toggle.get('input').trigger('blur')
    await toggle.setProps({ readonly: false })
    await toggle.get('input').setValue(true)

    const radio = mount(McRadio, {
      props: { modelValue: '', value: 'x', required: true, readonly: true, validateOn: 'blur', rules: [rule] },
    })
    await exerciseValidation(radio.vm)
    await radio.get('input').trigger('click')
    await radio.get('input').trigger('blur')
    await radio.setProps({ readonly: false })
    await radio.get('input').setValue(true)

    expect(rule.mock.calls.length).toBeGreaterThanOrEqual(3)
    expect(checkbox.emitted('update:modelValue')).toBeTruthy()
    expect(toggle.emitted('change')).toBeTruthy()
    expect(radio.emitted('change')).toBeTruthy()
  })

  it('covers slider and number-input editing boundaries', async () => {
    const rule = () => true as const
    const slider = mount(McSlider, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
        step: 1,
        required: true,
        validateOn: 'blur',
        rules: [rule],
        showValue: true,
      },
    })
    await exerciseValidation(slider.vm)
    const range = slider.get('input')
    await range.setValue('8')
    await range.trigger('keydown', { key: 'PageUp' })
    await range.trigger('keydown', { key: 'Unknown' })
    await range.trigger('blur')
    await slider.setProps({ disabled: true })
    await range.setValue('9')

    const number = mount(McNumberInput, {
      props: {
        modelValue: null,
        min: 0,
        max: 10,
        step: 2,
        required: true,
        validateOn: 'blur',
        rules: [rule],
      },
    })
    await exerciseValidation(number.vm)
    const input = number.get('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowUp' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.setValue('not-a-number')
    await input.trigger('keydown', { key: 'Enter' })
    await input.setValue('4')
    await input.trigger('keydown', { key: 'Escape' })
    await input.trigger('keydown', { key: 'Unknown' })
    await number.findAll('button')[0].trigger('click')
    await number.findAll('button')[1].trigger('click')
    const numberVm = number.vm as unknown as { increment: () => void; decrement: () => void }
    numberVm.increment()
    numberVm.decrement()
    await number.setProps({ disabled: true })
    numberVm.increment()

    expect(slider.emitted('change')).toBeTruthy()
    expect(number.emitted('change')).toBeTruthy()
  })

  it('handles file filtering, input, drop, browse, clear, and sizes', async () => {
    const tiny = new File(['x'], 'tiny.txt', { type: 'text/plain' })
    const medium = new File([new Uint8Array(2048)], 'medium.png', { type: 'image/png' })
    const large = new File([new Uint8Array(1024 * 1024)], 'large.bin', { type: 'application/octet-stream' })
    const wrapper = mount(McFileInput, {
      props: {
        modelValue: [tiny, medium, large],
        multiple: true,
        accept: '.txt,image/*,application/json',
        required: true,
        validateOn: 'blur',
        rules: [() => true],
      },
    })
    const input = wrapper.get<HTMLInputElement>('input')
    const surface = wrapper.get<HTMLButtonElement>('.mc-file-input__surface')
    const click = vi.spyOn(input.element, 'click')
    await exerciseValidation(wrapper.vm)
    ;(wrapper.vm as unknown as { browse: () => void }).browse()
    expect(click).toHaveBeenCalled()
    expect(input.attributes('tabindex')).toBe('-1')
    expect(input.attributes('aria-hidden')).toBe('true')
    expect(surface.attributes('type')).toBe('button')
    expect(wrapper.text()).toContain('1 B')
    expect(wrapper.text()).toContain('2.0 KB')
    expect(wrapper.text()).toContain('1.0 MB')

    const json = new File(['{}'], 'data.json', { type: 'application/json' })
    Object.defineProperty(input.element, 'files', { configurable: true, value: [tiny, medium, json, large] })
    await input.trigger('change')
    await input.trigger('blur')
    const root = wrapper.get('.mc-file-input')
    await root.trigger('dragenter')
    await root.trigger('dragleave')
    await root.trigger('drop', { dataTransfer: { files: [medium] } })
    await wrapper.get('.mc-file-input__clear').trigger('click')
    await wrapper.setProps({ disabled: true })
    await root.trigger('dragenter')
    expect(root.classes()).not.toContain('mc-file-input--dragging')
    await root.trigger('drop', { dataTransfer: { files: [tiny] } })
    ;(wrapper.vm as unknown as { browse: () => void; clear: () => void }).browse()
    ;(wrapper.vm as unknown as { clear: () => void }).clear()

    expect(wrapper.emitted('change')?.length).toBeGreaterThanOrEqual(2)
  })

  it('exercises select and autocomplete pointer, watch, validation, and empty states', async () => {
    const options = [
      { title: 'Disabled', value: 'disabled', disabled: true },
      { title: 'One', value: 1 },
      { title: 'Two', value: 2 },
    ]
    const select = mount(McSelect, {
      props: { options, required: true, validateOn: 'blur', rules: [() => true] },
      attachTo: document.body,
    })
    await exerciseValidation(select.vm)
    const selectTrigger = select.get('[role="combobox"]')
    await selectTrigger.trigger('blur')
    await selectTrigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    const selectOptions = Array.from(document.body.querySelectorAll<HTMLElement>('.mc-select__option'))
    selectOptions[0].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    selectOptions[0].click()
    selectOptions[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    selectOptions[1].click()
    await nextTick()
    ;(select.vm as unknown as SelectVm).close()
    await selectTrigger.trigger('keydown', { key: 'Tab' })
    await selectTrigger.trigger('keydown', { key: 'Unknown' })
    await selectTrigger.trigger('click')
    await select.setProps({ disabled: true })

    const autocomplete = mount(McAutocomplete, {
      props: { options, required: true, validateOn: 'blur', rules: [() => true] },
      attachTo: document.body,
    })
    await exerciseValidation(autocomplete.vm)
    const autoInput = autocomplete.get<HTMLInputElement>('[role="combobox"]')
    await autoInput.trigger('focus')
    await autoInput.trigger('blur')
    await autoInput.setValue('missing')
    expect(document.body.querySelector('.mc-autocomplete__empty')).not.toBeNull()
    await autoInput.setValue('o')
    const autoOption = document.body.querySelector<HTMLElement>('.mc-autocomplete__option')
    autoOption?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    autoOption?.click()
    await nextTick()
    ;(autocomplete.vm as unknown as SelectVm).close()
    await autoInput.trigger('keydown', { key: 'Tab' })
    await autoInput.trigger('keydown', { key: 'Unknown' })
    await autocomplete.setProps({ disabled: true })

    expect(select.emitted('change')).toBeTruthy()
    expect(autocomplete.emitted('change')).toBeTruthy()
  })

  it('selects table rows, changes page size, sorts, and clamps pages', async () => {
    const items = [
      { id: 1, name: 'One', score: 2 },
      { id: 2, name: 'Two', score: 1 },
    ]
    const wrapper = mount(McDataTable, {
      props: {
        headers: [
          { title: 'Name', key: 'name', width: 120 },
          { title: 'Score', key: 'score', align: 'end' },
          { title: 'Fixed', key: 'fixed', sortable: false },
        ],
        items,
        itemKey: (item) => item.id,
        showSelect: true,
        modelValue: [1],
        multiSort: true,
        options: { page: 1, itemsPerPage: 1, sortBy: [], search: '' },
        itemsPerPageOptions: [1, 2],
      },
    })
    const checks = wrapper.findAll('input[type="checkbox"]')
    await checks[0].setValue(true)
    await checks[1].setValue(false)
    await wrapper.setProps({ modelValue: [1, 2] })
    await wrapper.findAll('input[type="checkbox"]')[0].setValue(false)
    const sort = wrapper.findAll('.mc-data-table__sort')
    await sort[0].trigger('click')
    await sort[0].trigger('click')
    await sort[1].trigger('click')
    const pageSize = wrapper.get('.mc-data-table__page-size [role="combobox"]')
    await pageSize.trigger('keydown', { key: 'Enter' })
    await nextTick()
    const pageOption = Array.from(document.body.querySelectorAll<HTMLElement>('.mc-select__option')).find(
      (option) => option.textContent?.trim() === '2',
    )
    pageOption?.click()
    await nextTick()
    await wrapper.setProps({ options: { page: 9, itemsPerPage: 1, sortBy: [], search: '' }, items: items.slice(0, 1) })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:options')).toBeTruthy()
  })

  it('renders list vnode variants and exercises its selection keyboard model', async () => {
    const wrapper = mount(McList, {
      props: { modelValue: ['one'], mode: 'multiple' },
      slots: {
        default: () =>
          h(Fragment, null, [
            h(
              McListItem,
              { label: 'One', value: 'one', subtitle: 'First', icon: 'mc-add' },
              { left: () => h('button', 'left'), right: () => h('button', 'right') },
            ),
            h('mc-list-item', {
              label: 'Disabled',
              value: 2,
              disabled: '',
              interactive: 'false',
              'icon-right': 'mc-add',
            }),
            h(McListItem, { label: 'Three', value: 'three', disabled: false }),
          ]),
      },
      attachTo: document.body,
    })
    const items = wrapper.findAll('.mc-list__item')
    await items[0].trigger('click')
    await wrapper.setProps({ modelValue: [] })
    await items[0].trigger('click')
    await items[1].trigger('click')
    await items[0].trigger('keydown', { key: 'Enter', repeat: true })
    await items[0].trigger('keydown', { key: ' ' })
    for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Unknown']) await items[0].trigger('keydown', { key })

    const single = mount(McList, {
      props: { modelValue: 'one', mode: 'single', showRadio: false },
      slots: {
        default: () => [
          h(McListItem, { label: 'One', value: 'one' }),
          h(McListItem, { label: 'Two', value: 'two', interactive: false }),
        ],
      },
    })
    await single.findAll('.mc-list__item')[1].trigger('click')
    const plain = mount(McList, { slots: { default: () => h(McListItem, { label: '', value: true }) } })

    expect(wrapper.find('.mc-list__item-slot--left').exists()).toBe(true)
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(single.emitted('change')).toEqual([['two']])
    expect(plain.attributes('role')).toBe('list')
  })

  it('renders icon paths, component icons, slot names, and accessibility variants', () => {
    const path = 'M0 0h1v1H0z'
    setPixelIconCache(`${path}:0 0 1 1:#ffffff:8`, 'data:image/png;base64,cached')
    setPixelIconCache(`${path}:0 0 1 1:#ff0000:8`, 'data:image/png;base64,colored')
    const mask = mount(McIcon, { props: { path, viewBox: '0 0 1 1', pixelSize: 8, size: '2em' } })
    const colored = mount(McIcon, {
      props: { path, viewBox: '0 0 1 1', pixelSize: 8, color: '#ff0000', 'aria-label': 'pixel' },
    })
    const CustomIcon = defineComponent({ render: () => h('i', { class: 'custom-icon' }) })
    const component = mount(McIcon, {
      props: { name: 'custom', size: 16, 'aria-label': 'custom' },
      global: { plugins: [createMcUI({ icons: { sets: { mc: { icons: { custom: CustomIcon } } } } })] },
    })
    const fromSlot = mount(McIcon, { slots: { default: ' coverage ' } })

    expect(mask.find('.mc-icon--pixel-mask').exists()).toBe(true)
    expect(colored.find('[role="img"]').exists()).toBe(true)
    expect(component.find('.custom-icon').exists()).toBe(true)
    expect(fromSlot.find('.mc-icon--missing').exists()).toBe(true)
  })

  it('covers progress, dialog, drawer, breadcrumb, form-field, and virtual-scroll variants', async () => {
    const determinate = mount(McProgress, {
      props: { value: 150, max: 0, label: 'Progress', color: '#fff', showValue: true },
      attrs: { 'aria-label': 'custom progress' },
    })
    const negative = mount(McProgress, { props: { value: -10, max: 10, showValue: false } })
    const indeterminate = mount(McProgress, { props: { indeterminate: true, showValue: true } })
    expect(determinate.text()).toContain('100%')
    expect(negative.find('.mc-progress__header').exists()).toBe(false)
    expect(indeterminate.text()).toContain('...')

    const dialog = mount(McDialog, {
      props: { modelValue: true, title: 'Dialog', teleport: false, width: '30rem' },
      slots: {
        activator: ({ open }: { open: () => void }) => h('button', { class: 'dialog-open', onClick: open }),
        title: 'Custom title',
        actions: ({ close }: { close: () => void }) => h('button', { class: 'dialog-close', onClick: close }),
      },
    })
    await dialog.get('.dialog-close').trigger('click')
    dialog.findComponent(McOverlay).vm.$emit('update:modelValue', true)
    dialog.findComponent(McOverlay).vm.$emit('close')
    const bareDialog = mount(McDialog, { props: { modelValue: true, teleport: false, showClose: false, width: 400 } })
    expect(bareDialog.find('.mc-dialog__header').exists()).toBe(false)

    const persistent = mount(McDrawer, {
      props: { modelValue: true, mode: 'persistent', title: 'Persistent', teleport: false },
      slots: { footer: 'footer' },
    })
    await persistent.get('.mc-drawer__close').trigger('click')
    const permanent = mount(McDrawer, { props: { mode: 'permanent', title: 'Permanent', position: 'end' } })
    expect(permanent.classes()).toContain('mc-drawer--end')
    expect(permanent.find('.mc-drawer__close').exists()).toBe(false)

    const breadcrumbs = mount(McBreadcrumbs, {
      props: {
        items: [
          { title: 'Home', href: '/' },
          { title: 'Disabled', href: '/disabled', disabled: true },
          { title: 'Current' },
        ],
      },
      slots: { divider: '>', item: ({ item }: { item: { title: string } }) => h('strong', item.title) },
    })
    expect(breadcrumbs.findAll('strong')).toHaveLength(3)

    const errors = mount(McFormField, {
      props: { label: 'Field', description: 'Description', error: ['One', 'Two'], required: true },
      slots: { default: ({ id }: { id: string }) => h('input', { id }) },
    })
    const success = mount(McFormField, { props: { success: 'Done', hint: 'Hint', disabled: true } })
    expect(errors.get('[role="alert"]').text()).toBe('One, Two')
    expect(success.get('[role="status"]').text()).toBe('Done')

    const objectItems = [{ id: 'a' }, { id: 'b' }]
    const byProperty = mount(McVirtualScroll, {
      props: { items: objectItems, itemHeight: 20, height: 'bad', itemKey: 'id' },
      slots: { default: ({ index }: { index: number }) => String(index) },
    })
    const byFunction = mount(McVirtualScroll, {
      props: {
        items: objectItems,
        itemHeight: 20,
        height: '40px',
        itemKey: (item, index) => `${index}-${String(item)}`,
      },
    })
    expect(byProperty.find('.mc-virtual-scroll').exists()).toBe(true)
    expect(byFunction.findAll('[role="listitem"]')).toHaveLength(2)
  })

  it('covers expansion multi-select navigation and service branch fallbacks', async () => {
    const Host = defineComponent({
      components: { McExpansionPanel, McExpansionPanels },
      setup() {
        return { selected: ref<Array<string>>(['one']) }
      },
      template: `<mc-expansion-panels v-model="selected" multiple><mc-expansion-panel value="one" title="One"/><mc-expansion-panel value="disabled" title="Disabled" disabled/><mc-expansion-panel value="three" title="Three"/></mc-expansion-panels>`,
    })
    const expansion = mount(Host, { attachTo: document.body })
    const headers = expansion.findAll('.mc-expansion-panel__header')
    await headers[0].trigger('click')
    await headers[2].trigger('click')
    for (const key of ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Unknown']) await headers[0].trigger('keydown', { key })

    const parentLocale = createMcLocale({
      locale: 'ar',
      messages: { ar: { nested: { value: 'Parent' } } },
      rtl: ['ar'],
    })
    const locale = createMcLocale(
      {
        locale: 'ar',
        fallback: 'missing',
        messages: { ar: { page: 'Page {page} {missing}' } },
        rtl: { ar: true, en: false },
      },
      parentLocale,
    )
    expect(locale.t('page', { page: 2 })).toBe('Page 2 {missing}')
    expect(locale.t('nested.missing')).toBe('nested.missing')
    expect(locale.dir.value).toBe('rtl')
    locale.setLocale('en')
    expect(locale.dir.value).toBe('ltr')

    const parentTheme = createMcTheme({ themes: { parent: { dark: false, colors: { '--special': '#fff' } } } })
    const theme = createMcTheme(
      { defaultTheme: 'custom', themes: { custom: { dark: false, variables: { density: 2 }, fonts: { title: '' } } } },
      parentTheme,
    )
    expect(theme.classes.value).toContain('mc-theme--light')
    expect(theme.styles.value).toHaveProperty('--mc-density', '2')
    theme.setTheme('parent')
    expect(theme.styles.value).toHaveProperty('--special', '#fff')
    theme.setTheme('missing')

    const rect = { top: 2, right: 98, bottom: 22, left: 78, width: 20, height: 20 }
    for (const location of ['top start', 'top end', 'bottom', 'start top', 'start bottom', 'end'] as const) {
      const result = calculateConnectedPosition({
        activator: rect,
        content: { width: 40, height: 30 },
        viewport: { width: 100, height: 80 },
        location,
        offset: [4, 2],
        rtl: location === 'end',
      })
      expect(result.top).toBeGreaterThanOrEqual(8)
      expect(result.left).toBeGreaterThanOrEqual(8)
    }
  })

  it('covers pagination, stepper, drawer, button, and tooltip actions', async () => {
    const pagination = mount(McPagination, {
      props: { modelValue: 5, length: 12, totalVisible: 5, showFirstLast: true },
    })
    const buttons = pagination.findAll('button')
    await buttons[0].trigger('click')
    await buttons[1].trigger('click')
    await buttons.at(-2)!.trigger('click')
    await buttons.at(-1)!.trigger('click')
    const nav = pagination.get('nav')
    for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Unknown']) await nav.trigger('keydown', { key })
    await pagination.setProps({ disabled: true })
    await buttons[2].trigger('click')

    const stepper = mount(McStepper, {
      props: {
        modelValue: 'two',
        items: [
          { title: 'One', value: 'one' },
          { title: 'Two', value: 'two', optional: true },
          { title: 'Three', value: 'three', editable: true },
        ],
      },
    })
    const actions = stepper.find('.mc-stepper__actions').findAll('button')
    await actions[0].trigger('click')
    await actions[1].trigger('click')

    const drawer = mount(McDrawer, {
      props: { modelValue: true, title: 'Drawer', teleport: false },
      slots: {
        default: ({ close }: { close: () => void }) => h('button', { class: 'slot-close', onClick: close }, 'x'),
      },
    })
    await drawer.get('.slot-close').trigger('click')
    drawer.findComponent(McOverlay).vm.$emit('update:modelValue', false)
    drawer.findComponent(McOverlay).vm.$emit('close')

    const button = mount(McButton, { props: { variant: 'primary' }, slots: { default: 'Save' } })
    await button.get('button').trigger('click')
    await button.setProps({ disabled: true })
    await button.get('button').trigger('click')

    vi.useFakeTimers()
    const tooltip = mount(McTooltip, {
      props: { content: 'Tip', delay: 10, teleport: false },
      slots: { default: 'Target' },
      attachTo: document.body,
    })
    const trigger = tooltip.get('.mc-tooltip__trigger')
    await trigger.trigger('mouseenter')
    vi.advanceTimersByTime(10)
    await nextTick()
    await trigger.trigger('mouseleave')
    await trigger.trigger('focusin')
    vi.advanceTimersByTime(10)
    await nextTick()
    await trigger.trigger('focusout')

    expect(stepper.emitted('change')).toBeTruthy()
    expect(drawer.emitted('update:modelValue')).toBeTruthy()
    expect(button.emitted('click')).toHaveLength(1)
  })

  it('drags the custom scrollbar and closes/repositions overlays', async () => {
    class ResizeObserverStub {
      observe = vi.fn()
      disconnect = vi.fn()
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverStub)
    const scroll = mount(McScrollView, { slots: { default: '<div>long</div>' } })
    const container = scroll.get<HTMLElement>('.mc-scroll-view__container').element
    const track = scroll.get<HTMLElement>('.mc-scroll-view__track').element
    Object.defineProperties(container, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 500 },
      scrollTop: { configurable: true, writable: true, value: 40 },
    })
    Object.defineProperty(track, 'clientHeight', { configurable: true, value: 100 })
    await scroll.get('.mc-scroll-view__container').trigger('scroll')
    const thumb = scroll.get('.mc-scroll-view__thumb')
    Object.defineProperty(thumb.element, 'setPointerCapture', { configurable: true, value: vi.fn() })
    await thumb.trigger('pointerdown', { clientY: 10, pointerId: 1 })
    await thumb.trigger('pointermove', { clientY: 30, pointerId: 1 })
    await thumb.trigger('pointerup')
    await thumb.trigger('pointercancel')

    const ConnectedHost = defineComponent({
      components: { McOverlay },
      setup() {
        return { open: ref(true) }
      },
      template: `<mc-overlay v-model="open" :teleport="false" location-strategy="connected" scroll-strategy="reposition"><template #activator="{ open: activate }"><button class="activate" @click="activate">open</button></template><div>content</div></mc-overlay>`,
    })
    const connected = mount(ConnectedHost, { attachTo: document.body })
    await connected.get('.activate').trigger('click')
    window.dispatchEvent(new Event('resize'))
    window.dispatchEvent(new Event('scroll'))
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()

    const backdrop = mount(McOverlay, {
      props: { modelValue: true, teleport: false, locationStrategy: 'static' },
      slots: { default: 'content' },
    })
    await backdrop.get('.mc-overlay').trigger('mousedown')

    expect(container.scrollTop).toBeGreaterThan(40)
    expect(backdrop.emitted('update:modelValue')).toEqual([[false]])
  })

  it('releases browser audio and all pop timer paths', async () => {
    const listeners = new Map<string, EventListener>()
    const pause = vi.fn()
    const removeAttribute = vi.fn()
    const load = vi.fn()
    const play = vi.fn().mockResolvedValue(undefined)
    class AudioStub {
      constructor(readonly src: string) {}
      play = play
      pause = pause
      removeAttribute = removeAttribute
      load = load
      addEventListener(type: string, listener: EventListener) {
        listeners.set(type, listener)
      }
    }
    vi.stubGlobal('Audio', AudioStub)
    const sounds = createMcSounds({ enabled: true, sounds: { click: '/click.ogg' } })
    sounds.play('click')
    sounds.play('toast')
    await Promise.resolve()
    listeners.get('ended')?.(new Event('ended'))
    sounds.play('click')
    await Promise.resolve()
    sounds.dispose()
    expect(play).toHaveBeenCalled()
    expect(pause).toHaveBeenCalled()

    vi.useFakeTimers()
    const request = vi.fn((callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    vi.stubGlobal('requestAnimationFrame', request)
    const pop = createMcPop(sounds)
    for (let index = 0; index < 7; index += 1) pop.show(`message-${index}`, index === 0 ? Number.NaN : 10)
    expect(pop.state.value).toHaveLength(5)
    pop.dismiss(-1)
    pop.dismiss(pop.state.value[0].id)
    vi.runAllTimers()
    pop.clear()
    pop.dispose()
    pop.dispose()
    expect(pop.show('disposed')).toBe(-1)
  })
})
