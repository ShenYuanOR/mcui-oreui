import { ref, type InjectionKey } from 'vue'
import { useMcService } from './fallback'
import type { McSoundAdapter, McSoundOptions, McSoundType } from './types'

export interface McSoundInstance {
  enabled: ReturnType<typeof ref<boolean>>
  sounds: Partial<Record<McSoundType, string>>
  adapter: McSoundAdapter
  play: (type: McSoundType) => void
  setEnabled: (enabled: boolean) => void
  dispose: () => void
}

function createBrowserAudioAdapter(): { adapter: McSoundAdapter; dispose: () => void } {
  const activeAudio = new Set<HTMLAudioElement>()
  const adapter: McSoundAdapter = async (source) => {
    if (typeof Audio === 'undefined') return
    const audio = new Audio(source)
    activeAudio.add(audio)
    const release = () => activeAudio.delete(audio)
    audio.addEventListener('ended', release, { once: true })
    audio.addEventListener('error', release, { once: true })
    try {
      await audio.play()
    } catch {
      release()
      // Autoplay policy and unavailable audio devices are intentionally non-fatal.
    }
  }
  return {
    adapter,
    dispose() {
      for (const audio of activeAudio) {
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      }
      activeAudio.clear()
    },
  }
}

export const mcSoundsKey: InjectionKey<McSoundInstance> = Symbol.for('mcui:sounds')

export function createMcSounds(options: McSoundOptions = {}): McSoundInstance {
  const enabled = ref(options.enabled ?? false)
  const sounds = { ...(options.sounds ?? {}) }
  const browser = options.adapter ? undefined : createBrowserAudioAdapter()
  const adapter = options.adapter ?? browser!.adapter
  return {
    enabled,
    sounds,
    adapter,
    play(type) {
      const source = sounds[type]
      if (!enabled.value || !source) return
      void adapter(source, type)
    },
    setEnabled(value) {
      enabled.value = value
    },
    dispose() {
      browser?.dispose()
    },
  }
}

export function useMcSounds(): McSoundInstance {
  return useMcService(mcSoundsKey, createMcSounds)
}
