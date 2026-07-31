import { useMcSounds } from '../framework/sounds'

export type { McSoundType } from '../framework/types'

export function useSound() {
  const sounds = useMcSounds()
  return {
    enabled: sounds.enabled,
    play: sounds.play,
    playSound: sounds.play,
    playVariant: (variant: 'primary' | 'normal' | 'error' | 'plain') =>
      sounds.play(variant === 'primary' ? 'button' : 'click'),
    playSoundType: (variant: 'primary' | 'normal' | 'error' | 'plain') =>
      sounds.play(variant === 'primary' ? 'button' : 'click'),
    setEnabled: sounds.setEnabled,
    setSoundEnabled: sounds.setEnabled,
  }
}
