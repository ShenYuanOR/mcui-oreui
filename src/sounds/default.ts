import button from '../assets/sounds/button.ogg'
import click from '../assets/sounds/click.ogg'
import close from '../assets/sounds/drawer_close.ogg'
import open from '../assets/sounds/drawer_open.ogg'
import hide from '../assets/sounds/hide.ogg'
import pop from '../assets/sounds/pop.ogg'
import toast from '../assets/sounds/toast.ogg'
import xp from '../assets/sounds/xp.ogg'
import type { McSoundType } from '../framework/types'

export const mcDefaultSounds: Record<McSoundType, string> = {
  button,
  click,
  close,
  open,
  hide,
  pop,
  toast,
  xp,
}

export default mcDefaultSounds
