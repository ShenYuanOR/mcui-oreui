import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMcUI, McIcon, type McIconDefinition } from '../../src'
import { getPixelIconCache, getPixelIconCacheSize, setPixelIconCache } from '../../src/utils/pixelIconCache'

const safeIcon: McIconDefinition = {
  name: 'safe',
  type: 'normal',
  colorable: true,
  node: {
    name: 'svg',
    attrs: { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24' },
    children: [{ name: 'path', attrs: { d: 'M0 0h24v24H0z', fill: 'currentColor' } }],
  },
}

describe('structured icon security', () => {
  it('renders safe nodes without v-html', () => {
    const wrapper = mount(McIcon, {
      props: { name: 'safe', color: '#ffffff' },
      global: { plugins: [createMcUI({ icons: { sets: { mc: { icons: { safe: safeIcon } } } } })] },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('path').attributes('d')).toBe('M0 0h24v24H0z')
  })

  it.each([
    { name: 'script' },
    { name: 'svg', attrs: { onload: 'alert(1)' } },
    { name: 'svg', children: [{ name: 'image', attrs: { href: 'javascript:alert(1)' } }] },
    { name: 'svg', children: [{ name: 'image', attrs: { href: 'https://example.com/icon.png' } }] },
  ])('rejects unsafe icon node %#', (node) => {
    expect(() =>
      createMcUI({
        icons: { sets: { mc: { icons: { unsafe: { node } as unknown as McIconDefinition } } } },
      }),
    ).toThrow()
  })

  it('bounds the shared pixel cache to 128 least-recently-used entries', () => {
    for (let index = 0; index < 129; index += 1) setPixelIconCache(`key-${index}`, `value-${index}`)
    expect(getPixelIconCacheSize()).toBe(128)
    expect(getPixelIconCache('key-0')).toBeUndefined()
    expect(getPixelIconCache('key-128')).toBe('value-128')
  })
})
