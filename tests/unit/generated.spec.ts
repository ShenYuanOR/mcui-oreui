import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as publicApi from '../../src'

describe('generated public contract', () => {
  it('keeps component directories, web-types and explicit exports aligned', () => {
    const names = readdirSync(resolve(process.cwd(), 'src/components'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^Mc[A-Z]/.test(entry.name))
      .map((entry) => entry.name)
      .sort()
    const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'))
    const webTypes = JSON.parse(readFileSync(resolve(process.cwd(), 'web-types.json'), 'utf8'))
    const symbols = webTypes.contributions.html.tags
      .map((tag: { source: { symbol: string } }) => tag.source.symbol)
      .sort()
    const componentExports = Object.keys(packageJson.exports)
      .filter((key) => key.startsWith('./components/'))
      .map((key) => key.slice('./components/'.length))
      .sort()

    expect(names).toHaveLength(63)
    expect(symbols).toEqual(names)
    expect(componentExports).toEqual(names)
    expect(names.every((name) => name in publicApi)).toBe(true)
    expect(packageJson.exports).not.toHaveProperty('./composables/useTooltipFlip')
    expect(Object.keys(packageJson.exports).some((key) => key.includes('*'))).toBe(false)
  })

  it('does not expose removed unscoped Pop and Sound helpers', () => {
    expect(publicApi).not.toHaveProperty('showPop')
    expect(publicApi).not.toHaveProperty('popState')
    expect(publicApi).not.toHaveProperty('playSound')
    expect(publicApi).not.toHaveProperty('playSoundType')
    expect(publicApi).not.toHaveProperty('setSoundEnabled')
  })
})
