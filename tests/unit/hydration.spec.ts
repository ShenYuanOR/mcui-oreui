import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it, vi } from 'vitest'
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

describe('hydration', () => {
  it('hydrates stable core markup without warnings', async () => {
    const render = () =>
      h(McApp, null, {
        default: () => [
          h(McButton, null, () => 'Play'),
          h(McSelect, { options: ['A', 'B'] }),
          h(McDialog, { modelValue: true, teleport: false, title: 'Open' }, { default: () => 'Body' }),
          h(McDataTable, { headers: [{ title: 'Name', key: 'name' }], items: [{ id: 1, name: 'Alex' }] }),
          h(
            McVirtualScroll,
            { items: ['A'], itemHeight: 32, height: 64 },
            { default: ({ item }: { item: string }) => item },
          ),
          h(McLayout, null, { default: () => h(McMain, null, { default: () => 'Content' }) }),
        ],
      })
    const server = createSSRApp({ render })
    server.use(createMcUI({ display: { ssrWidth: 1024 } }))
    const container = document.createElement('div')
    container.innerHTML = await renderToString(server)
    document.body.appendChild(container)
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const client = createSSRApp({ render })
    client.use(createMcUI({ display: { ssrWidth: 1024 } }))
    client.mount(container)
    const messages = [...warning.mock.calls, ...error.mock.calls]
      .flat()
      .map((value) => (typeof value === 'symbol' ? (value.description ?? 'symbol') : String(value)))
      .join(' ')
    expect(messages.toLowerCase()).not.toContain('hydration')
    expect(messages).not.toContain("Cannot read properties of undefined (reading 'refs')")
    client.unmount()
  })

  it('hydrates McApp around third-party trees without cloning them', async () => {
    const Foreign = defineComponent({
      setup(_, { slots }) {
        return () => h('section', { class: 'foreign', 'data-foreign': '1' }, slots.default?.())
      },
    })
    const render = () =>
      h(McApp, null, {
        default: () =>
          h(Foreign, null, {
            default: () => [
              h(McButton, null, () => 'Play'),
              h(McLayout, null, { default: () => h(McMain, null, { default: () => 'Docs' }) }),
            ],
          }),
      })
    const server = createSSRApp({ render })
    server.use(createMcUI())
    const container = document.createElement('div')
    container.innerHTML = await renderToString(server)
    document.body.appendChild(container)
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const client = createSSRApp({ render })
    client.use(createMcUI())
    client.mount(container)
    const messages = [...warning.mock.calls, ...error.mock.calls]
      .flat()
      .map((value) => (typeof value === 'symbol' ? (value.description ?? 'symbol') : String(value)))
      .join(' ')
    expect(messages.toLowerCase()).not.toContain('hydration')
    expect(messages).not.toContain("Cannot read properties of undefined (reading 'refs')")
    expect(container.querySelector('[data-foreign="1"]')?.textContent).toContain('Play')
    client.unmount()
  })
})
