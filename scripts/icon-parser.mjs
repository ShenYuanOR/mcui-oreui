const allowedElements = new Set(['svg', 'path', 'image'])
const allowedAttributes = {
  svg: new Set(['xmlns', 'width', 'height', 'viewBox', 'shape-rendering']),
  path: new Set(['d', 'fill', 'fill-opacity', 'shape-rendering', 'style']),
  image: new Set(['width', 'height', 'x', 'y', 'href']),
}

function normalizeStyle(value, source) {
  const result = {}
  for (const declaration of value.split(';').filter(Boolean)) {
    const separator = declaration.indexOf(':')
    if (separator < 1) throw new Error(`${source}: invalid style declaration`)
    const name = declaration.slice(0, separator).trim()
    const styleValue = declaration.slice(separator + 1).trim()
    if (!['fill', 'fill-opacity'].includes(name)) throw new Error(`${source}: unsafe style property ${name}`)
    result[name] = styleValue
  }
  return result
}

function normalizeAttribute(tag, name, value, source, colorable) {
  if (/^on/i.test(name) || !allowedAttributes[tag].has(name)) {
    throw new Error(`${source}: unsafe ${tag} attribute ${name}`)
  }
  if (name === 'href' && !/^data:image\/png;base64,[a-z0-9+/=]+$/i.test(value)) {
    throw new Error(`${source}: image href must be an embedded PNG data URL`)
  }
  if (/javascript:|(?:^|\W)url\s*\(/i.test(value)) throw new Error(`${source}: unsafe attribute value`)
  if (colorable && name === 'fill' && /^#(?:fff|ffffff)$/i.test(value)) return 'currentColor'
  return value
}

function parseAttributes(tag, sourceText, source, colorable) {
  const attrs = {}
  const attributePattern = /([A-Za-z_:][\w:.-]*)\s*=\s*(["'])(.*?)\2/gs
  let consumed = ''
  for (const match of sourceText.matchAll(attributePattern)) {
    consumed += sourceText.slice(consumed.length, match.index)
    consumed += match[0]
    const name = match[1]
    if (name === 'style') {
      const styleAttrs = normalizeStyle(match[3], source)
      for (const [styleName, styleValue] of Object.entries(styleAttrs)) {
        attrs[styleName] = normalizeAttribute(tag, styleName, styleValue, source, colorable)
      }
    } else {
      attrs[name] = normalizeAttribute(tag, name, match[3], source, colorable)
    }
  }
  const remainder = sourceText.replace(attributePattern, '').replace(/\/$/, '').trim()
  if (remainder) throw new Error(`${source}: malformed or unquoted attributes: ${remainder}`)
  return attrs
}

export function parseSafeSvg(svg, { source = 'SVG', colorable = false } = {}) {
  if (/<!|<\?|&(?:#\d+|#x[\da-f]+|\w+);/i.test(svg))
    throw new Error(`${source}: declarations and entities are not allowed`)
  const tokens = [...svg.matchAll(/<\s*(\/?)\s*([A-Za-z][\w:-]*)\b([^>]*)>/g)]
  if (!tokens.length) throw new Error(`${source}: no SVG element found`)
  const stack = []
  let root
  let lastIndex = 0
  for (const token of tokens) {
    if (svg.slice(lastIndex, token.index).trim()) throw new Error(`${source}: text nodes are not allowed`)
    lastIndex = token.index + token[0].length
    const closing = token[1] === '/'
    const name = token[2]
    if (!allowedElements.has(name)) throw new Error(`${source}: unsafe element ${name}`)
    if (closing) {
      if (token[3].trim() || stack.pop()?.name !== name) throw new Error(`${source}: invalid closing tag ${name}`)
      continue
    }
    const node = { name, attrs: parseAttributes(name, token[3], source, colorable) }
    if (stack.length) {
      const parent = stack.at(-1)
      parent.children ??= []
      parent.children.push(node)
    } else if (root) {
      throw new Error(`${source}: multiple root elements`)
    } else {
      root = node
    }
    if (!token[3].trimEnd().endsWith('/')) stack.push(node)
  }
  if (svg.slice(lastIndex).trim() || stack.length || root?.name !== 'svg') throw new Error(`${source}: malformed SVG`)
  return root
}
