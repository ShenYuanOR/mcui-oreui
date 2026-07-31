import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { createMcUI } from '../../src'

describe('SSR service isolation', () => {
  it('does not share state across concurrent app instances', async () => {
    const first = createMcUI()
    const second = createMcUI()
    first.services.pop.show('request one')
    second.services.pop.show('request two')
    first.services.theme.themes.value.first = { colors: { primary: '#111111' } }

    const firstApp = createSSRApp({ render: () => h('div', first.services.pop.state.value[0]?.message) }).use(first)
    const secondApp = createSSRApp({ render: () => h('div', second.services.pop.state.value[0]?.message) }).use(second)
    const [firstHtml, secondHtml] = await Promise.all([renderToString(firstApp), renderToString(secondApp)])

    expect(firstHtml).toContain('request one')
    expect(secondHtml).toContain('request two')
    expect(second.services.theme.themes.value).not.toHaveProperty('first')
  })
})
