import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import catalog from '../../docs/.vitepress/generated/utilities-catalog.json'

const root = process.cwd()
const utilities = readFileSync(resolve(root, 'src/styles/utilities.css'), 'utf8')
const components = readFileSync(resolve(root, 'src/styles/components.css'), 'utf8')
const tokens = readFileSync(resolve(root, 'src/styles/tokens.css'), 'utf8')
const classNames = new Set(catalog.classes.map((item) => item.name))

describe('utilities generator contract', () => {
  it('keeps generated CSS and the searchable catalog deterministic', () => {
    expect(() =>
      execFileSync(process.execPath, ['scripts/generate-utilities.mjs', '--check'], { cwd: root }),
    ).not.toThrow()
    expect(catalog.classes).toHaveLength(4152)
    expect(catalog.breakpoints).toEqual({ sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 })
  })

  it('generates unique selectors and only important utility declarations', () => {
    const selectors = utilities
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.endsWith('{') && !line.startsWith('@'))
      .map((line) => line.slice(0, -1).trim())
    expect(selectors).toHaveLength(4167)
    expect(new Set(selectors).size).toBe(selectors.length)

    const declarationLines = utilities
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^(?:--)?[a-z][a-z-]*:/.test(line))
    expect(declarationLines.length).toBeGreaterThan(5000)
    expect(declarationLines.every((line) => line.endsWith('!important;'))).toBe(true)
    expect(utilities).not.toMatch(/\b(?:undefined|null|NaN)\b/)
    expect(utilities).not.toMatch(/(?:gap|row-gap|column-gap): auto/)
  })

  it('covers every configured breakpoint, spacing step, theme color, and helper family', () => {
    for (const breakpoint of ['', 'sm', 'md', 'lg', 'xl', 'xxl']) {
      const infix = breakpoint ? `-${breakpoint}` : ''
      for (const display of ['none', 'block', 'table', 'table-row', 'table-cell', 'flex', 'inline-flex']) {
        expect(classNames.has(`d${infix}-${display}`)).toBe(true)
      }
      for (let step = 0; step <= 16; step += 1) {
        expect(classNames.has(`ma${infix}-${step}`)).toBe(true)
        expect(classNames.has(`pa${infix}-${step}`)).toBe(true)
        expect(classNames.has(`ga${infix}-${step}`)).toBe(true)
      }
      for (let step = 1; step <= 16; step += 1) {
        expect(classNames.has(`mt${infix}-n${step}`)).toBe(true)
      }
      expect(classNames.has(`mx${infix}-auto`)).toBe(true)
      expect(classNames.has(`flex${infix}-1-1-100`)).toBe(true)
      expect(classNames.has(`justify${infix}-space-evenly`)).toBe(true)
      expect(classNames.has(`align-content${infix}-stretch`)).toBe(true)
      expect(classNames.has(`order${infix}-last`)).toBe(true)
      expect(classNames.has(`text${infix}-display-large`)).toBe(true)
    }

    for (const name of ['primary', 'surface', 'error', 'warning', 'info', 'success', 'text', 'border']) {
      expect(classNames.has(`text-${name}`)).toBe(true)
      expect(classNames.has(`bg-${name}`)).toBe(true)
      expect(classNames.has(`border-${name}`)).toBe(true)
    }
    for (let elevation = 0; elevation <= 24; elevation += 1) expect(classNames.has(`elevation-${elevation}`)).toBe(true)
    for (const name of [
      'd-sr-only',
      'd-sr-only-focusable',
      'pointer-events-none',
      'pointer-pass-through',
      'hidden-md-and-up',
    ]) {
      expect(classNames.has(name)).toBe(true)
    }
  })

  it('keeps utilities opt-in without inventing component-prop classes', () => {
    expect(components).not.toContain('utilities.css')
    expect(tokens).toContain('--mc-spacer: 4px')
    expect(utilities).not.toMatch(/\.d-grid\b|\.object-fit-|\.aspect-ratio-|\.z-index-|\.user-select-/)
    const defaultCss = `${tokens}\n${utilities}\n${components}`
    expect(defaultCss).not.toMatch(/(^|[},]\s*)(html|body|header|main|a|button|\*)\s*[{,]/m)
  })
})
