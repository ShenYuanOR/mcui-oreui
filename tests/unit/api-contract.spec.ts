import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import {
  McAlert,
  McApp,
  McAppbarButton,
  McAutocomplete,
  McButton,
  McCard,
  McCheckbox,
  McChip,
  McDataTable,
  McDialog,
  McFileInput,
  McNumberInput,
  McOverlay,
  McProgress,
  McRadio,
  McRadioGroup,
  McSelect,
  McSlider,
  McSnackbar,
  McSwitch,
  McTextarea,
  McTextField,
  McThemeProvider,
} from '../../src'

function runtimeProps(component: unknown): string[] {
  const props = (component as { props?: string[] | Record<string, unknown> }).props
  return Array.isArray(props) ? props : Object.keys(props ?? {})
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('2.0 public API contract', () => {
  it('does not expose removed aliases or slot-duplicate text props', () => {
    expect(runtimeProps(McButton)).not.toContain('bgcolor')
    expect(runtimeProps(McButton)).not.toContain('ariaLabel')
    expect(runtimeProps(McAppbarButton)).not.toContain('bgColor')
    expect(runtimeProps(McAlert)).not.toEqual(expect.arrayContaining(['type', 'title', 'text']))
    expect(runtimeProps(McCard)).not.toEqual(expect.arrayContaining(['title', 'description']))
    expect(runtimeProps(McChip)).not.toContain('text')
    expect(runtimeProps(McSnackbar)).not.toEqual(expect.arrayContaining(['color', 'message']))
    expect(runtimeProps(McProgress)).not.toEqual(expect.arrayContaining(['status', 'bgcolor']))
    expect(runtimeProps(McTextField)).not.toEqual(expect.arrayContaining(['inputType', 'password', 'error', 'success']))
    expect(runtimeProps(McDataTable)).not.toEqual(expect.arrayContaining(['page', 'itemsPerPage', 'sortBy', 'search']))
  })

  it('keeps the flat field contract across all input wrappers', () => {
    const common = [
      'label',
      'description',
      'hint',
      'disabled',
      'readonly',
      'required',
      'rules',
      'errorMessages',
      'validateOn',
      'id',
    ]
    for (const component of [
      McTextField,
      McTextarea,
      McSelect,
      McAutocomplete,
      McCheckbox,
      McRadio,
      McRadioGroup,
      McSwitch,
      McSlider,
      McFileInput,
      McNumberInput,
    ]) {
      expect(runtimeProps(component)).toEqual(expect.arrayContaining(common))
    }
  })

  it('routes wrapper and native attributes to their semantic elements', async () => {
    const field = mount(McTextField, {
      props: { modelValue: '', filter: 'number', type: 'password' },
      attrs: {
        class: 'outer-field',
        style: 'width: 240px',
        'data-field': 'account',
        'aria-label': 'PIN',
        autocomplete: 'one-time-code',
      },
    })
    expect(field.get('.mc-form-field').classes()).toContain('outer-field')
    expect(field.get('.mc-form-field').attributes('data-field')).toBe('account')
    expect(field.get('input').attributes('type')).toBe('password')
    expect(field.get('input').attributes('aria-label')).toBe('PIN')
    expect(field.get('input').attributes('autocomplete')).toBe('one-time-code')
    await field.get('input').setValue('a1b2')
    expect(field.emitted('update:modelValue')?.at(-1)).toEqual(['12'])

    const button = mount(McButton, {
      props: { color: '#ff6600' },
      attrs: { class: 'outer-button', 'data-action': 'play', 'aria-label': 'Play', name: 'play' },
    })
    expect(button.get('.mc-tooltip').classes()).toContain('outer-button')
    expect(button.get('.mc-tooltip').attributes('data-action')).toBe('play')
    expect(button.get('button').attributes('aria-label')).toBe('Play')
    expect(button.get('button').attributes('name')).toBe('play')
    expect(button.get('button').attributes()).not.toHaveProperty('color')

    const progress = mount(McProgress, {
      props: { value: 40, variant: 'success' },
      attrs: { class: 'outer-progress', 'data-progress': 'download', 'aria-label': 'Download progress' },
    })
    expect(progress.get('.mc-progress').classes()).toContain('outer-progress')
    expect(progress.get('.mc-progress').attributes('data-progress')).toBe('download')
    expect(progress.get('[role="progressbar"]').attributes('aria-label')).toBe('Download progress')
  })

  it('routes direct overlay attributes without leaking implementation props', () => {
    const overlay = mount(McOverlay, {
      props: { modelValue: true, teleport: false, scrim: false, locationStrategy: 'static' },
      attrs: { class: 'outer-overlay', 'data-layer': 'test', 'aria-label': 'Overlay content' },
      slots: { default: 'Body' },
    })
    expect(overlay.get('.mc-overlay').classes()).toContain('outer-overlay')
    expect(overlay.get('.mc-overlay').attributes('data-layer')).toBe('test')
    expect(overlay.get('.mc-overlay__content').attributes('aria-label')).toBe('Overlay content')
    expect(overlay.get('.mc-overlay').attributes()).not.toHaveProperty('locationstrategy')
  })

  it('keeps teleported overlays inside the active theme context', async () => {
    const Host = defineComponent({
      components: { McApp, McThemeProvider, McDialog },
      template: `<mc-app><mc-theme-provider name="portal" :theme="{ colors: { primary: '#123456' } }"><mc-dialog :model-value="true" title="Portal">Body</mc-dialog></mc-theme-provider></mc-app>`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await new Promise((resolve) => setTimeout(resolve, 0))
    const overlay = document.body.querySelector<HTMLElement>('.mc-overlay')
    expect(overlay?.classList.contains('mc-theme--portal')).toBe(true)
    expect(overlay?.style.getPropertyValue('--mc-primary')).toBe('#123456')
    expect(overlay?.getAttribute('dir')).toBe('ltr')
    wrapper.unmount()
  })

  it('keeps default styles host-safe and disables motion when requested', () => {
    const componentRoot = resolve(process.cwd(), 'src/components')
    const componentStyles = readdirSync(componentRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^Mc[A-Z]/.test(entry.name))
      .map((entry) => readFileSync(resolve(componentRoot, entry.name, 'component.css'), 'utf8'))
    const sharedRoot = resolve(process.cwd(), 'src/styles/shared')
    const sharedStyles = readdirSync(sharedRoot)
      .filter((file) => file.endsWith('.css'))
      .map((file) => readFileSync(resolve(sharedRoot, file), 'utf8'))
    const components = [
      readFileSync(resolve(process.cwd(), 'src/styles/component-core.css'), 'utf8'),
      ...sharedStyles,
      ...componentStyles,
    ].join('\n')
    const tokens = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8')
    const defaultCss = `${tokens}\n${components}`
    expect(defaultCss).not.toMatch(/(^|[},]\s*)(html|body|header|main|a|button|\*)\s*[{,]/m)
    expect(components).toContain('@media (prefers-reduced-motion: reduce)')
    expect(components).toMatch(/transition:\s*none\s*!important/)
  })
})
