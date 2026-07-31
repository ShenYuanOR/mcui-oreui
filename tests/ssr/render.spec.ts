import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import {
  createMcUI,
  McApp,
  McButton,
  McDataTable,
  McDialog,
  McLayout,
  McMain,
  McSelect,
  McVirtualScroll,
} from '../../src'

describe('SSR rendering', () => {
  it('renders core and closed overlay components without browser globals', async () => {
    const app = createSSRApp({
      render: () =>
        h(McApp, null, {
          default: () => [
            h(McButton, null, () => 'Play'),
            h(McSelect, { options: ['A', 'B'] }),
            h(McDialog, { modelValue: false }),
            h(McDataTable, { headers: [{ title: 'Name', key: 'name' }], items: [{ id: 1, name: 'Alex' }] }),
            h(
              McVirtualScroll,
              { items: ['A', 'B'], itemHeight: 32, height: 64 },
              { default: ({ item }: { item: string }) => item },
            ),
            h(McLayout, null, { default: () => h(McMain, null, { default: () => 'Content' }) }),
          ],
        }),
    })
    app.use(createMcUI({ display: { ssrWidth: 1280 } }))
    const html = await renderToString(app)
    expect(html).toContain('mc-app')
    expect(html).toContain('mc-button')
    expect(html).toContain('role="combobox"')
    expect(html).toContain('mc-data-table')
    expect(html).toContain('mc-virtual-scroll')
  })

  it('renders an open inline overlay without browser globals', async () => {
    const app = createSSRApp({
      render: () => h(McDialog, { modelValue: true, teleport: false, title: 'Settings' }, { default: () => 'Body' }),
    })
    app.use(createMcUI())
    const html = await renderToString(app)
    expect(html).toContain('role="dialog"')
    expect(html).toContain('Settings')
  })
})
