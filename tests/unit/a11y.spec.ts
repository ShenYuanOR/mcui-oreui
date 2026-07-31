import axe from 'axe-core'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  McBreadcrumbs,
  McButton,
  McCheckbox,
  McDataTable,
  McExpansionPanel,
  McExpansionPanels,
  McFileInput,
  McNumberInput,
  McPagination,
  McSelect,
  McSlider,
  McStepper,
  McTabs,
} from '../../src'
import { defineComponent } from 'vue'

describe('axe baseline', () => {
  it('has no serious accessibility violations in core controls', async () => {
    const Host = defineComponent({
      components: { McButton, McCheckbox, McSelect, McSlider, McTabs },
      template: `<main>
        <h1>Controls</h1><mc-button>Play</mc-button><mc-checkbox label="Music" />
        <mc-select label="Mode" :options="['Survival', 'Creative']" />
        <mc-slider aria-label="Volume" /><mc-tabs model-value="one" :items="[{ label: 'One', value: 'one' }]" />
      </main>`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const results = await axe.run(wrapper.element, {
      resultTypes: ['violations'],
      rules: { 'color-contrast': { enabled: false } },
    })
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual(
      [],
    )
  })

  it('has no serious violations in new data, input and flow components', async () => {
    const Host = defineComponent({
      components: {
        McBreadcrumbs,
        McDataTable,
        McExpansionPanels,
        McExpansionPanel,
        McFileInput,
        McNumberInput,
        McPagination,
        McStepper,
      },
      template: `<main><h1>Advanced controls</h1>
        <mc-breadcrumbs :items="[{ title: 'Home', href: '/' }, { title: 'Worlds' }]" />
        <mc-file-input label="Resource pack" /><mc-number-input label="Players" />
        <mc-pagination :length="4" />
        <mc-data-table :headers="[{ title: 'Name', key: 'name' }]" :items="[{ id: 1, name: 'Alex' }]" />
        <mc-expansion-panels><mc-expansion-panel value="one" title="Details">Content</mc-expansion-panel></mc-expansion-panels>
        <mc-stepper model-value="one" :items="[{ title: 'One', value: 'one' }, { title: 'Two', value: 'two' }]" />
      </main>`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const results = await axe.run(wrapper.element, {
      resultTypes: ['violations'],
      rules: { 'color-contrast': { enabled: false } },
    })
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual(
      [],
    )
  })
})
