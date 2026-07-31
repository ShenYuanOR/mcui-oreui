import { createApp, defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMcUI, usePop, useSound, type McPopInstance } from '../../src'

const mountedApps: ReturnType<typeof createApp>[] = []

function mountApp(component: ReturnType<typeof defineComponent>, plugin?: ReturnType<typeof createMcUI>) {
  const target = document.createElement('div')
  document.body.append(target)
  const app = createApp(component)
  if (plugin) app.use(plugin)
  app.mount(target)
  mountedApps.push(app)
  return app
}

afterEach(() => {
  while (mountedApps.length) mountedApps.pop()?.unmount()
  document.body.innerHTML = ''
  document.documentElement.style.overflow = ''
  vi.restoreAllMocks()
})

describe('app-scoped services', () => {
  it('exposes isolated Pop, Sound and Theme services and disposes them with the app', async () => {
    const firstSound = vi.fn()
    const secondSound = vi.fn()
    const first = createMcUI({ sounds: { enabled: true, sounds: { toast: '/first.ogg' }, adapter: firstSound } })
    const second = createMcUI({ sounds: { enabled: true, sounds: { toast: '/second.ogg' }, adapter: secondSound } })
    const Root = defineComponent({ render: () => h('div') })
    const firstApp = mountApp(Root, first)
    mountApp(Root, second)

    first.services.theme.setTheme('missing')
    first.services.pop.show('first')
    second.services.pop.show('second')
    await nextTick()

    expect(Object.isFrozen(first.services)).toBe(true)
    expect(first.services.pop.state.value.map((item) => item.message)).toEqual(['first'])
    expect(second.services.pop.state.value.map((item) => item.message)).toEqual(['second'])
    expect(firstSound).toHaveBeenCalledWith('/first.ogg', 'toast')
    expect(secondSound).toHaveBeenCalledWith('/second.ogg', 'toast')

    firstApp.unmount()
    mountedApps.splice(mountedApps.indexOf(firstApp), 1)
    expect(first.services.pop.state.value).toEqual([])
    expect(second.services.pop.state.value).toHaveLength(1)

    const replacement = createApp(Root)
    expect(() => replacement.use(first)).toThrow(/only be installed into one Vue app/)
  })

  it('isolates plugin-less fallback services by app context', () => {
    const pops: McPopInstance[] = []
    const enabled = [] as boolean[]
    const Probe = defineComponent({
      setup() {
        const pop = usePop()
        const sound = useSound()
        pops.push(pop)
        enabled.push(sound.enabled.value)
        return () => h('div')
      },
    })
    mountApp(Probe)
    mountApp(Probe)
    pops[0].show('only first')

    expect(pops[0]).not.toBe(pops[1])
    expect(pops[0].state.value).toHaveLength(1)
    expect(pops[1].state.value).toHaveLength(0)
    expect(enabled).toEqual([false, false])
  })

  it('coordinates scroll locks and z-index across multiple apps sharing a document', () => {
    const first = createMcUI()
    const second = createMcUI()
    first.services.overlay.mount()
    second.services.overlay.mount()
    const firstEntry = first.services.overlay.register(() => undefined)
    const secondEntry = second.services.overlay.register(() => undefined)
    expect(secondEntry.zIndex).toBeGreaterThan(firstEntry.zIndex)

    document.documentElement.style.overflow = 'clip'
    first.services.overlay.lockScroll()
    second.services.overlay.lockScroll()
    expect(document.documentElement.style.overflow).toBe('hidden')
    first.services.overlay.unlockScroll()
    expect(document.documentElement.style.overflow).toBe('hidden')
    second.services.overlay.unlockScroll()
    expect(document.documentElement.style.overflow).toBe('clip')
  })
})
