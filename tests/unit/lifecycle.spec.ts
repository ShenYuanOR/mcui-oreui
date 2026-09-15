import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { McScrollView, McSkinViewer } from '../../src'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('browser resource lifecycle', () => {
  it('runs SkinViewer animation only while mounted and enabled', async () => {
    let callback: FrameRequestCallback | undefined
    const request = vi.fn((next: FrameRequestCallback) => {
      callback = next
      return 42
    })
    const cancel = vi.fn()
    vi.stubGlobal('requestAnimationFrame', request)
    vi.stubGlobal('cancelAnimationFrame', cancel)

    const wrapper = mount(McSkinViewer, { props: { skin: '/skin.png', autoRotate: false } })
    expect(request).not.toHaveBeenCalled()
    await wrapper.setProps({ autoRotate: true })
    await nextTick()
    expect(request).toHaveBeenCalledTimes(1)
    callback?.(16)
    expect(request).toHaveBeenCalledTimes(2)
    await wrapper.setProps({ autoRotate: false })
    await nextTick()
    expect(cancel).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('ignores SkinViewer image load after unmount', async () => {
    const loaders: Array<{ onload: ((this: GlobalEventHandlers, ev: Event) => unknown) | null; src: string }> = []
    class FakeImage {
      onload: ((this: GlobalEventHandlers, ev: Event) => unknown) | null = null
      onerror: OnErrorEventHandler = null
      src = ''
      naturalWidth = 64
      naturalHeight = 64
      constructor() {
        loaders.push(this)
      }
    }
    vi.stubGlobal('Image', FakeImage)
    const wrapper = mount(McSkinViewer, { props: { skin: '/skin.png', autoRotate: false } })
    expect(wrapper.emitted('load')).toBeUndefined()
    wrapper.unmount()
    expect(() => {
      loaders[0].onload?.call(loaders[0] as unknown as GlobalEventHandlers, new Event('load'))
    }).not.toThrow()
  })

  it('falls back when ResizeObserver is unavailable', () => {
    const addWindowListener = vi.spyOn(window, 'addEventListener')
    vi.stubGlobal('ResizeObserver', undefined)
    const wrapper = mount(McScrollView, { slots: { default: '<div>content</div>' } })
    expect(addWindowListener).toHaveBeenCalledWith('resize', expect.any(Function))
    wrapper.unmount()
  })
})
