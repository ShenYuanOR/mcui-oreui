import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const cssPath = resolve(rootDir, 'src/styles/utilities.css')
const catalogPath = resolve(rootDir, 'docs/.vitepress/generated/utilities-catalog.json')
const catalogDirectory = resolve(rootDir, 'docs/.vitepress/generated/utility-catalogs')
const checkOnly = process.argv.includes('--check')

const breakpoints = {
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560,
}

const themeColors = {
  background: '#48494a',
  surface: '#313233',
  'surface-pressed': '#242425',
  'surface-light': '#58585a',
  'surface-hover': '#8c8d90',
  'surface-bright': '#e6e8eb',
  'surface-high': '#f4f6f9',
  primary: '#3c8527',
  'primary-hover': '#2a641c',
  'primary-active': '#1d4d13',
  'primary-tint': '#6cc349',
  secondary: '#d0d1d4',
  'secondary-hover': '#b1b2b5',
  'secondary-active': '#b1b2b5',
  error: '#ca3636',
  'error-hover': '#c02d2d',
  'error-active': '#ad1d1d',
  'error-tint': '#f46d6d',
  warning: '#ffe866',
  'warning-active': '#e5c317',
  info: '#2e6be5',
  'info-tint': '#8cb3ff',
  success: '#3c8527',
  border: '#1e1e1f',
  'border-strong': '#131313',
  'border-muted': '#a1a3a5',
  text: '#ffffff',
  'text-muted': '#d0d1d4',
  'text-dimmest': '#b1b2b5',
  'text-inverse': '#1e1e1f',
  disabled: '#d0d1d4',
  'disabled-shadow': '#b1b2b5',
  'disabled-border': '#8c8d90',
  'disabled-text': '#48494a',
  focus: '#ffffff',
  shadow: '#000000',
  scrim: 'rgba(0, 0, 0, .7)',
  'on-primary': '#ffffff',
  'on-secondary': '#1e1e1f',
  'on-warning': '#1e1e1f',
  'control-inactive': '#8c8d90',
}

const typography = {
  'display-large': ['3.5625rem', '400', '1.1228070175', '-.0043859649em', 'var(--mc-font-title, sans-serif)'],
  'display-medium': ['2.8125rem', '400', '1.1555555556', 'normal', 'var(--mc-font-title, sans-serif)'],
  'display-small': ['2.25rem', '400', '1.2222222222', 'normal', 'var(--mc-font-title, sans-serif)'],
  'headline-large': ['2rem', '400', '1.25', 'normal', 'var(--mc-font-title, sans-serif)'],
  'headline-medium': ['1.75rem', '400', '1.2857142857', 'normal', 'var(--mc-font-title, sans-serif)'],
  'headline-small': ['1.5rem', '400', '1.3333333333', 'normal', 'var(--mc-font-title, sans-serif)'],
  'title-large': ['1.375rem', '400', '1.2727272727', 'normal', 'var(--mc-font-ui, sans-serif)'],
  'title-medium': ['1rem', '500', '1.5', '.009375em', 'var(--mc-font-ui, sans-serif)'],
  'title-small': ['.875rem', '500', '1.4285714286', '.0071428571em', 'var(--mc-font-ui, sans-serif)'],
  'body-large': ['1rem', '400', '1.5', '.03125em', 'var(--mc-font-body, sans-serif)'],
  'body-medium': ['.875rem', '400', '1.4285714286', '.0178571429em', 'var(--mc-font-body, sans-serif)'],
  'body-small': ['.75rem', '400', '1.3333333333', '.0333333333em', 'var(--mc-font-body, sans-serif)'],
  'label-large': ['.875rem', '500', '1.4285714286', '.0071428571em', 'var(--mc-font-ui, sans-serif)'],
  'label-medium': ['.75rem', '500', '1.3333333333', '.0416666667em', 'var(--mc-font-ui, sans-serif)'],
  'label-small': ['.6875rem', '500', '1.4545454545', '.0454545455em', 'var(--mc-font-ui, sans-serif)'],
}

const sections = new Map([['base', []]])
const selectorRegistry = new Set()
const catalog = new Map()

function classSelector(prefix, value, breakpoint = '') {
  return `.${prefix}${breakpoint ? `-${breakpoint}` : ''}${value === '' ? '' : `-${value}`}`
}

function declarationsSummary(declarations) {
  return Object.entries(declarations)
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ')
}

function addRule(selector, declarations, family, media = 'base', includeInCatalog = true) {
  if (selectorRegistry.has(selector)) throw new Error(`Duplicate utility selector: ${selector}`)
  selectorRegistry.add(selector)
  if (!sections.has(media)) sections.set(media, [])
  sections.get(media).push({ selector, declarations })

  if (includeInCatalog) {
    const match = selector.match(/^\.([a-z0-9-]+)/)
    if (match && !catalog.has(match[1])) {
      catalog.set(match[1], {
        name: match[1],
        family,
        declaration: declarationsSummary(declarations),
      })
    }
  }
}

function responsiveRules(prefix, values, properties, family) {
  for (const [value, declarationValue] of Object.entries(values)) {
    const declarations = Object.fromEntries(properties.map((property) => [property, declarationValue]))
    addRule(classSelector(prefix, value), declarations, family)
    for (const [breakpoint, minWidth] of Object.entries(breakpoints)) {
      addRule(classSelector(prefix, value, breakpoint), declarations, family, `(min-width: ${minWidth}px)`)
    }
  }
}

function spacingValue(step, negative = false) {
  if (step === 0) return '0'
  return `calc(var(--mc-spacer, 4px) * ${negative ? -step : step})`
}

function generateDisplayAndFloat() {
  const displays = Object.fromEntries(
    ['none', 'inline', 'inline-block', 'block', 'table', 'table-row', 'table-cell', 'flex', 'inline-flex'].map(
      (value) => [value, value],
    ),
  )
  responsiveRules('d', displays, ['display'], 'Display')

  const floats = Object.fromEntries(['none', 'left', 'right'].map((value) => [value, value]))
  responsiveRules('float', floats, ['float'], 'Float / RTL')

  for (const [logical, ltr, rtl] of [
    ['start', 'left', 'right'],
    ['end', 'right', 'left'],
  ]) {
    const baseSelector = classSelector('float', logical)
    addRule(baseSelector, { float: ltr }, 'Float / RTL')
    addRule(`${baseSelector}:dir(rtl)`, { float: rtl }, 'Float / RTL', 'base', false)
    for (const [breakpoint, minWidth] of Object.entries(breakpoints)) {
      const selector = classSelector('float', logical, breakpoint)
      const media = `(min-width: ${minWidth}px)`
      addRule(selector, { float: ltr }, 'Float / RTL', media)
      addRule(`${selector}:dir(rtl)`, { float: rtl }, 'Float / RTL', media, false)
    }
  }

  for (const [value, display] of Object.entries(displays)) {
    addRule(classSelector('d', value, 'print'), { display }, 'Display / Print', 'print')
  }
  for (const [value, float] of Object.entries({ ...floats, start: 'left', end: 'right' })) {
    const selector = classSelector('float', value, 'print')
    addRule(selector, { float }, 'Float / Print', 'print')
    if (value === 'start' || value === 'end') {
      addRule(`${selector}:dir(rtl)`, { float: value === 'start' ? 'right' : 'left' }, 'Float / Print', 'print', false)
    }
  }
}

function generateFlex() {
  responsiveRules(
    'flex',
    {
      fill: '1 1 auto',
      '1-1': '1 1 auto',
      '1-0': '1 0 auto',
      '0-1': '0 1 auto',
      '0-0': '0 0 auto',
      '1-1-100': '1 1 100%',
      '1-0-100': '1 0 100%',
      '0-1-100': '0 1 100%',
      '0-0-100': '0 0 100%',
      '1-1-0': '1 1 0',
      '1-0-0': '1 0 0',
      '0-1-0': '0 1 0',
      '0-0-0': '0 0 0',
    },
    ['flex'],
    'Flex',
  )
  responsiveRules(
    'flex',
    Object.fromEntries(['row', 'column', 'row-reverse', 'column-reverse'].map((value) => [value, value])),
    ['flex-direction'],
    'Flex',
  )
  responsiveRules('flex', { 'grow-0': '0', 'grow-1': '1' }, ['flex-grow'], 'Flex')
  responsiveRules('flex', { 'shrink-0': '0', 'shrink-1': '1' }, ['flex-shrink'], 'Flex')
  responsiveRules(
    'flex',
    Object.fromEntries(['wrap', 'nowrap', 'wrap-reverse'].map((value) => [value, value])),
    ['flex-wrap'],
    'Flex',
  )
  responsiveRules(
    'justify',
    {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      'space-between': 'space-between',
      'space-around': 'space-around',
      'space-evenly': 'space-evenly',
    },
    ['justify-content'],
    'Flex',
  )
  responsiveRules(
    'justify-items',
    { start: 'start', end: 'end', center: 'center', stretch: 'stretch' },
    ['justify-items'],
    'Flex',
  )
  responsiveRules(
    'align',
    { start: 'flex-start', end: 'flex-end', center: 'center', baseline: 'baseline', stretch: 'stretch' },
    ['align-items'],
    'Flex',
  )
  responsiveRules(
    'align-content',
    {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      'space-between': 'space-between',
      'space-around': 'space-around',
      'space-evenly': 'space-evenly',
      stretch: 'stretch',
    },
    ['align-content'],
    'Flex',
  )
  responsiveRules(
    'align-self',
    { auto: 'auto', start: 'flex-start', end: 'flex-end', center: 'center', baseline: 'baseline', stretch: 'stretch' },
    ['align-self'],
    'Flex',
  )
  responsiveRules(
    'order',
    {
      first: '-1',
      ...Object.fromEntries(Array.from({ length: 13 }, (_, value) => [value, String(value)])),
      last: '13',
    },
    ['order'],
    'Flex',
  )
}

function generateSpacing() {
  const marginProperties = {
    ma: ['margin'],
    mx: ['margin-right', 'margin-left'],
    my: ['margin-top', 'margin-bottom'],
    mt: ['margin-top'],
    mr: ['margin-right'],
    mb: ['margin-bottom'],
    ml: ['margin-left'],
    ms: ['margin-inline-start'],
    me: ['margin-inline-end'],
  }
  const paddingProperties = {
    pa: ['padding'],
    px: ['padding-right', 'padding-left'],
    py: ['padding-top', 'padding-bottom'],
    pt: ['padding-top'],
    pr: ['padding-right'],
    pb: ['padding-bottom'],
    pl: ['padding-left'],
    ps: ['padding-inline-start'],
    pe: ['padding-inline-end'],
  }
  const positive = Object.fromEntries(Array.from({ length: 17 }, (_, step) => [step, spacingValue(step)]))
  const margins = { ...positive, auto: 'auto' }
  const negative = Object.fromEntries(
    Array.from({ length: 16 }, (_, index) => [`n${index + 1}`, spacingValue(index + 1, true)]),
  )

  for (const [prefix, properties] of Object.entries(marginProperties)) {
    responsiveRules(prefix, margins, properties, 'Spacing / Margin')
    responsiveRules(prefix, negative, properties, 'Spacing / Negative margin')
  }
  for (const [prefix, properties] of Object.entries(paddingProperties)) {
    responsiveRules(prefix, positive, properties, 'Spacing / Padding')
  }
  for (const [prefix, property] of Object.entries({ ga: 'gap', gr: 'row-gap', gc: 'column-gap' })) {
    responsiveRules(prefix, positive, [property], 'Spacing / Gap')
  }
}

function generateOverflow() {
  const values = Object.fromEntries(['auto', 'hidden', 'visible', 'scroll', 'clip'].map((value) => [value, value]))
  for (const [prefix, property] of Object.entries({
    overflow: 'overflow',
    'overflow-x': 'overflow-x',
    'overflow-y': 'overflow-y',
  })) {
    for (const [value, declarationValue] of Object.entries(values)) {
      addRule(classSelector(prefix, value), { [property]: declarationValue }, 'Overflow')
    }
  }
}

function generateBorders() {
  const radii = {
    '': '4px',
    0: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '24px',
    pill: '9999px',
    circle: '50%',
    shaped: '24px 0',
  }
  const radiusProperties = {
    rounded: ['border-radius'],
    'rounded-t': ['border-start-start-radius', 'border-start-end-radius'],
    'rounded-e': ['border-start-end-radius', 'border-end-end-radius'],
    'rounded-b': ['border-end-start-radius', 'border-end-end-radius'],
    'rounded-s': ['border-start-start-radius', 'border-end-start-radius'],
    'rounded-ts': ['border-start-start-radius'],
    'rounded-te': ['border-start-end-radius'],
    'rounded-be': ['border-end-end-radius'],
    'rounded-bs': ['border-end-start-radius'],
  }
  for (const [prefix, properties] of Object.entries(radiusProperties)) {
    for (const [value, radius] of Object.entries(radii)) {
      addRule(
        classSelector(prefix, value),
        Object.fromEntries(properties.map((property) => [property, radius])),
        'Border / Radius',
      )
    }
  }

  const color = 'color-mix(in srgb, var(--mc-border, #1e1e1f) calc(var(--mc-border-opacity, 1) * 100%), transparent)'
  const widths = { '': 'var(--mc-border-width, 2px)', 0: '0', thin: '1px', sm: '1px', md: '2px', lg: '4px', xl: '8px' }
  const borderProperties = {
    border: ['border-width', 'border-style', 'border-color'],
    'border-t': ['border-block-start-width', 'border-block-start-style', 'border-block-start-color'],
    'border-e': ['border-inline-end-width', 'border-inline-end-style', 'border-inline-end-color'],
    'border-b': ['border-block-end-width', 'border-block-end-style', 'border-block-end-color'],
    'border-s': ['border-inline-start-width', 'border-inline-start-style', 'border-inline-start-color'],
  }
  for (const [prefix, properties] of Object.entries(borderProperties)) {
    for (const [value, width] of Object.entries(widths)) {
      addRule(
        classSelector(prefix, value),
        {
          [properties[0]]: width,
          [properties[1]]: 'solid',
          [properties[2]]: color,
        },
        'Border / Width',
      )
    }
  }
  for (const style of ['solid', 'dashed', 'dotted', 'double', 'none']) {
    addRule(classSelector('border', style), { 'border-style': style }, 'Border / Style')
  }
  addRule('.border-current', { 'border-color': 'currentColor' }, 'Border / Color')
  for (const [name, value] of Object.entries({ '': '.12', 0: '0', 25: '.25', 50: '.5', 75: '.75', 100: '1' })) {
    addRule(classSelector('border-opacity', name), { '--mc-border-opacity': value }, 'Border / Opacity')
  }
}

function generateTypography() {
  responsiveRules(
    'text',
    {
      left: 'left',
      right: 'right',
      center: 'center',
      justify: 'justify',
      start: 'start',
      end: 'end',
    },
    ['text-align'],
    'Text / Alignment',
  )
  for (const value of ['line-through', 'none', 'overline', 'underline']) {
    addRule(classSelector('text-decoration', value), { 'text-decoration': value }, 'Text / Decoration')
  }
  for (const [value, whiteSpace] of Object.entries({
    wrap: 'normal',
    'no-wrap': 'nowrap',
    pre: 'pre',
    'pre-line': 'pre-line',
    'pre-wrap': 'pre-wrap',
  })) {
    addRule(classSelector('text', value), { 'white-space': whiteSpace }, 'Text / Wrapping')
  }
  addRule('.text-break', { 'overflow-wrap': 'break-word', 'word-break': 'break-word' }, 'Text / Wrapping')
  addRule(
    '.text-truncate',
    { 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis' },
    'Text / Truncation',
  )
  for (const value of ['none', 'capitalize', 'lowercase', 'uppercase']) {
    addRule(classSelector('text', value), { 'text-transform': value }, 'Text / Transform')
  }
  for (const [value, weight] of Object.entries({
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  })) {
    addRule(classSelector('font-weight', value), { 'font-weight': weight }, 'Typography / Weight')
  }
  addRule('.font-italic', { 'font-style': 'italic' }, 'Typography')
  addRule('.text-mono', { 'font-family': 'monospace' }, 'Typography')

  for (const [name, [size, weight, lineHeight, letterSpacing, family]] of Object.entries(typography)) {
    const declarations = {
      'font-size': size,
      'font-weight': weight,
      'line-height': lineHeight,
      'letter-spacing': letterSpacing,
      'font-family': family,
    }
    addRule(classSelector('text', name), declarations, 'Typography / Scale')
    for (const [breakpoint, minWidth] of Object.entries(breakpoints)) {
      addRule(classSelector('text', name, breakpoint), declarations, 'Typography / Scale', `(min-width: ${minWidth}px)`)
    }
  }
}

function generatePositionAndSizing() {
  for (const value of ['static', 'relative', 'fixed', 'absolute', 'sticky']) {
    addRule(classSelector('position', value), { position: value }, 'Position')
  }
  for (const property of ['top', 'right', 'bottom', 'left']) {
    addRule(classSelector(property, '0'), { [property]: '0' }, 'Position')
  }
  addRule('.fill-height', { height: '100%' }, 'Sizing')
  responsiveRules(
    'h',
    { auto: 'auto', screen: '100dvh', 0: '0', 25: '25%', 50: '50%', 75: '75%', 100: '100%' },
    ['height'],
    'Sizing',
  )
  responsiveRules(
    'w',
    { auto: 'auto', screen: '100dvw', 0: '0', 25: '25%', 33: '33%', 50: '50%', 66: '66%', 75: '75%', 100: '100%' },
    ['width'],
    'Sizing',
  )
}

function generateCursorOpacityAndHelpers() {
  for (const value of [
    'auto',
    'default',
    'pointer',
    'wait',
    'text',
    'move',
    'help',
    'not-allowed',
    'progress',
    'grab',
    'grabbing',
    'none',
  ]) {
    addRule(classSelector('cursor', value), { cursor: value }, 'Cursor')
  }
  for (let opacity = 0; opacity <= 100; opacity += 10) {
    addRule(classSelector('opacity', String(opacity)), { opacity: String(opacity / 100) }, 'Opacity')
  }

  const screenReaderDeclarations = {
    border: '0',
    clip: 'rect(0, 0, 0, 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    'white-space': 'nowrap',
    width: '1px',
  }
  addRule('.d-sr-only', screenReaderDeclarations, 'Accessibility')
  addRule('.d-sr-only-focusable:not(:focus)', screenReaderDeclarations, 'Accessibility')
  addRule('.pointer-events-none', { 'pointer-events': 'none' }, 'Pointer events')
  addRule('.pointer-events-auto', { 'pointer-events': 'auto' }, 'Pointer events')
  addRule('.pointer-pass-through', { 'pointer-events': 'none' }, 'Pointer events')
  addRule('.pointer-pass-through > *', { 'pointer-events': 'auto' }, 'Pointer events', 'base', false)

  const widths = {
    xs: [null, 599.98],
    sm: [600, 959.98],
    md: [960, 1279.98],
    lg: [1280, 1919.98],
    xl: [1920, 2559.98],
    xxl: [2560, null],
  }
  for (const [name, [min, max]] of Object.entries(widths)) {
    const parts = [min == null ? null : `(min-width: ${min}px)`, max == null ? null : `(max-width: ${max}px)`].filter(
      Boolean,
    )
    addRule(classSelector('hidden', name), { display: 'none' }, 'Responsive hidden', parts.join(' and '))
  }
  for (const [name, min] of Object.entries(breakpoints)) {
    addRule(
      classSelector('hidden', `${name}-and-up`),
      { display: 'none' },
      'Responsive hidden',
      `(min-width: ${min}px)`,
    )
  }
  for (const [name, max] of Object.entries({ sm: 959.98, md: 1279.98, lg: 1919.98, xl: 2559.98 })) {
    addRule(
      classSelector('hidden', `${name}-and-down`),
      { display: 'none' },
      'Responsive hidden',
      `(max-width: ${max}px)`,
    )
  }
  addRule('.hidden-print-only', { display: 'none' }, 'Responsive hidden', 'only print')
  addRule('.hidden-screen-only', { display: 'none' }, 'Responsive hidden', 'only screen')
}

function generateElevationAndColors() {
  addRule('.elevation-0', { 'box-shadow': 'none' }, 'Elevation')
  for (let level = 1; level <= 24; level += 1) {
    addRule(
      classSelector('elevation', String(level)),
      { 'box-shadow': `${level}px ${level}px 0 var(--mc-shadow, #000000)` },
      'Elevation',
    )
  }
  for (const [name, fallback] of Object.entries(themeColors)) {
    const value = `var(--mc-${name}, ${fallback})`
    addRule(classSelector('text', name), { color: value }, 'Theme colors / Text')
    addRule(classSelector('bg', name), { 'background-color': value }, 'Theme colors / Background')
    const borderValue = `color-mix(in srgb, ${value} calc(var(--mc-border-opacity, 1) * 100%), transparent)`
    addRule(classSelector('border', name), { 'border-color': borderValue }, 'Theme colors / Border')
  }
}

generateDisplayAndFloat()
generateFlex()
generateSpacing()
generateOverflow()
generateBorders()
generateTypography()
generatePositionAndSizing()
generateCursorOpacityAndHelpers()
generateElevationAndColors()

function renderDeclarations(declarations, indent) {
  return Object.entries(declarations)
    .map(([property, value]) => `${indent}${property}: ${value} !important;`)
    .join('\n')
}

function renderRule(rule, indent = '') {
  return `${indent}${rule.selector} {\n${renderDeclarations(rule.declarations, `${indent}  `)}\n${indent}}`
}

const cssSections = [
  '/* This file is generated by scripts/generate-utilities.mjs. Do not edit by hand. */',
  '/* Vuetify 4.1.6-compatible class names, Ore UI tokens, and McUI breakpoints. */',
  "@import './tokens.css';",
  '',
  ...sections.get('base').map((rule) => renderRule(rule)),
]

for (const [media, rules] of sections) {
  if (media === 'base') continue
  const query = media === 'print' ? 'print' : media
  cssSections.push('', `@media ${query} {`, ...rules.map((rule) => renderRule(rule, '  ')), '}')
}

const generatedCss = `${cssSections.join('\n')}\n`
const catalogClasses = [...catalog.values()]
const generatedCatalog = `${JSON.stringify(
  {
    generatedBy: 'scripts/generate-utilities.mjs',
    breakpoints,
    classes: catalogClasses,
  },
  null,
  2,
)}\n`

const catalogGroups = {
  display: ['Display', 'Display / Print'],
  flex: ['Flex'],
  spacing: ['Spacing / Margin', 'Spacing / Negative margin', 'Spacing / Padding', 'Spacing / Gap'],
  overflow: ['Overflow'],
  borders: ['Border / Radius', 'Border / Width', 'Border / Style', 'Border / Color', 'Border / Opacity'],
  typography: [
    'Text / Alignment',
    'Text / Decoration',
    'Text / Wrapping',
    'Text / Truncation',
    'Text / Transform',
    'Typography / Weight',
    'Typography',
    'Typography / Scale',
  ],
  'position-float': ['Float / RTL', 'Float / Print', 'Position'],
  sizing: ['Sizing'],
  'cursor-opacity': ['Cursor', 'Opacity'],
  helpers: ['Accessibility', 'Pointer events', 'Responsive hidden'],
  elevation: ['Elevation'],
  'theme-colors': ['Theme colors / Text', 'Theme colors / Background', 'Theme colors / Border'],
}
const generatedGroupCatalogs = Object.fromEntries(
  Object.entries(catalogGroups).map(([name, families]) => [
    name,
    `${JSON.stringify(
      {
        generatedBy: 'scripts/generate-utilities.mjs',
        families,
        classes: catalogClasses.filter((item) => families.includes(item.family)),
      },
      null,
      2,
    )}\n`,
  ]),
)

async function checkFile(path, expected) {
  let actual = ''
  try {
    actual = await readFile(path, 'utf8')
  } catch {
    throw new Error(`${path} is missing; run npm run generate:utilities`)
  }
  if (actual !== expected) throw new Error(`${path} is out of date; run npm run generate:utilities`)
}

if (checkOnly) {
  await checkFile(cssPath, generatedCss)
  await checkFile(catalogPath, generatedCatalog)
  for (const [name, contents] of Object.entries(generatedGroupCatalogs)) {
    await checkFile(resolve(catalogDirectory, `${name}.json`), contents)
  }
  process.stdout.write(`Utilities are current: ${catalog.size} classes, ${selectorRegistry.size} selectors.\n`)
} else {
  await mkdir(dirname(catalogPath), { recursive: true })
  await mkdir(catalogDirectory, { recursive: true })
  await writeFile(cssPath, generatedCss, 'utf8')
  await writeFile(catalogPath, generatedCatalog, 'utf8')
  for (const [name, contents] of Object.entries(generatedGroupCatalogs)) {
    await writeFile(resolve(catalogDirectory, `${name}.json`), contents, 'utf8')
  }
  process.stdout.write(`Generated ${catalog.size} classes and ${selectorRegistry.size} selectors.\n`)
}
