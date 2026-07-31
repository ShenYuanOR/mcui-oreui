import type { McIconSet } from '../framework/types'
import { mcKeyIconSet } from './key'
import { mcNormalIconSet } from './normal'
import { mcXIconSet } from './x'

export const mcAllIconSet: McIconSet = {
  icons: {
    ...(mcNormalIconSet.icons ?? {}),
    ...(mcKeyIconSet.icons ?? {}),
    ...(mcXIconSet.icons ?? {}),
  },
}

export default mcAllIconSet
