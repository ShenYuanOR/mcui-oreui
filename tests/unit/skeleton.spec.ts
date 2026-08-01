import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { McSkeleton } from '../../src'

describe('McSkeleton', () => {
  it('normalizes numeric template dimensions to pixels without changing CSS lengths', async () => {
    const wrapper = mount(McSkeleton, { props: { width: '60%', height: '34' } })

    expect(wrapper.attributes('style')).toContain('width: 60%')
    expect(wrapper.attributes('style')).toContain('height: 34px')

    await wrapper.setProps({ width: '12.5', height: 18 })
    expect(wrapper.attributes('style')).toContain('width: 12.5px')
    expect(wrapper.attributes('style')).toContain('height: 18px')

    await wrapper.setProps({ width: 'calc(100% - 16px)', height: '2rem' })
    expect(wrapper.attributes('style')).toContain('width: calc(100% - 16px)')
    expect(wrapper.attributes('style')).toContain('height: 2rem')
  })

  it('keeps a stable status label and safe defaults', () => {
    const wrapper = mount(McSkeleton, { attrs: { 'aria-label': '正在加载世界列表' } })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('正在加载世界列表')
    expect(wrapper.attributes('style')).toContain('width: 100%')
    expect(wrapper.attributes('style')).toContain('height: 20px')
    expect(wrapper.get('.mc-visually-hidden').text()).toBe('正在加载世界列表')
  })
})
