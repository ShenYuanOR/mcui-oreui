import { createMcUIPlugin } from './framework/createMcUI'
import type { McUIPlugin } from './framework/createMcUI'
import type { McUIOptions } from './framework/types'
import mcComponents from './generated/component-registry'

export function createMcUI(options: McUIOptions = {}): McUIPlugin {
  return createMcUIPlugin(options, mcComponents)
}
