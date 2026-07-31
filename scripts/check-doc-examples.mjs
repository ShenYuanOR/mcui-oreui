import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentsDir = path.join(rootDir, 'docs', 'components')
const write = process.argv.includes('--write')

function scanFences(source) {
  const ranges = []
  const pattern = /^(`{3,})([^\r\n]*)\r?\n([\s\S]*?)^\1[ \t]*(?:\r?\n|$)/gm
  let match

  while ((match = pattern.exec(source))) {
    ranges.push({
      start: match.index,
      end: pattern.lastIndex,
      marker: match[1],
      info: match[2].trim(),
      content: match[3].replace(/\r?\n$/, ''),
    })
  }

  return ranges
}

function isInRange(index, ranges) {
  return ranges.some((range) => index >= range.start && index < range.end)
}

function findDemos(source) {
  const fences = scanFences(source)
  const demos = []
  const opening = /<div\b[^>]*\bclass=(['"])[^'"]*\bmc-demo\b[^'"]*\1[^>]*>/gi
  let match

  while ((match = opening.exec(source))) {
    if (isInRange(match.index, fences)) continue

    const tags = /<\/?div\b[^>]*>/gi
    tags.lastIndex = match.index
    let depth = 0
    let tag
    let end = -1

    while ((tag = tags.exec(source))) {
      if (isInRange(tag.index, fences)) continue
      if (/^<\/div/i.test(tag[0])) depth -= 1
      else if (!/\/>$/.test(tag[0])) depth += 1

      if (depth === 0) {
        end = tags.lastIndex
        break
      }
    }

    if (end === -1) throw new Error(`Unclosed mc-demo at character ${match.index}`)

    demos.push({ start: match.index, end, markup: source.slice(match.index, end).trim() })
    opening.lastIndex = end
  }

  return demos
}

function findPageBlock(source, tagName) {
  const fences = scanFences(source)
  const pattern = new RegExp(`<${tagName}([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, 'g')
  let match

  while ((match = pattern.exec(source))) {
    if (!isInRange(match.index, fences)) return { attrs: match[1], content: match[2].trim() }
  }

  return null
}

function exampleScript(source) {
  const block = findPageBlock(source, 'script')
  if (!block || !/\bsetup\b/.test(block.attrs)) return ''

  return block.content.replace(/from\s+(['"])\.\.\/\.\.\/src\/composables\/usePop\1/g, "from 'mcui-oreui'")
}

function exampleStyle(source) {
  const block = findPageBlock(source, 'style')
  if (!block) return ''
  const attrs = block.attrs.trim()
  return `<style${attrs ? ` ${attrs}` : ''}>\n${block.content}\n</style>`
}

function renderExample(markup, script, style) {
  const setup = script ? `${script}\n` : ''
  const styleBlock = style ? `\n\n${style}` : ''
  return [
    '```vue',
    '<script setup lang="ts">',
    setup + '</script>',
    '',
    '<template>',
    markup,
    '</template>' + styleBlock,
    '```',
  ].join('\n')
}

function findFollowingExample(source, offset) {
  const whitespace = /^[\s\r\n]*/.exec(source.slice(offset))?.[0].length ?? 0
  const start = offset + whitespace
  const match = /^```(vue|html)[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*(?=\r?\n|$)/.exec(source.slice(start))

  if (!match) return null
  return { start, end: start + match[0].length, language: match[1], content: match[2] }
}

function normalizedMarkup(value) {
  return value
    .replace(/,\s*([\]}])/g, '$1')
    .replace(/\s+/g, '')
    .replace(/async\(([A-Za-z_$][\w$]*)\)=>/g, 'async$1=>')
    .replace(/\(([A-Za-z_$][\w$]*)\)=>/g, '$1=>')
}

function extractRootTemplate(source) {
  const opening = /<template(?:\s[^>]*)?>/.exec(source)
  if (!opening) return null

  const tags = /<\/?template\b[^>]*>/g
  tags.lastIndex = opening.index
  let depth = 0
  let tag

  while ((tag = tags.exec(source))) {
    if (/^<\/template/i.test(tag[0])) {
      depth -= 1
      if (depth === 0) {
        return source.slice(opening.index + opening[0].length, tag.index)
      }
    } else if (!/\/>$/.test(tag[0])) {
      depth += 1
    }
  }

  return null
}

function syncExamples(source) {
  const script = exampleScript(source)
  const style = exampleStyle(source)
  const demos = findDemos(source)

  for (const demo of [...demos].reverse()) {
    const existing = findFollowingExample(source, demo.end)
    const end = existing?.end ?? demo.end
    const replacement = `\n\n${renderExample(demo.markup, script, style)}`
    source = source.slice(0, demo.end) + replacement + source.slice(end)
  }

  return source
}

function validatePage(file, source) {
  const errors = []
  const demos = findDemos(source)
  const fences = scanFences(source)

  if (demos.length === 0) errors.push('page has no element with the mc-demo class')

  let previousDemoEnd = 0
  for (const [index, demo] of demos.entries()) {
    const section = source.slice(previousDemoEnd, demo.start)
    const headingMatches = [...section.matchAll(/^## (?!#).+$/gm)]
    if (headingMatches.length === 0) {
      errors.push(`example ${index + 1} is not preceded by its own level-two heading`)
    }

    const example = findFollowingExample(source, demo.end)
    if (!example) {
      errors.push(`example ${index + 1} is not immediately followed by a Vue source block`)
      previousDemoEnd = demo.end
      continue
    }

    if (example.language !== 'vue') {
      errors.push(`example ${index + 1} uses a ${example.language} block instead of vue`)
    }
    if (!/<script setup lang="ts">[\s\S]*?<\/script>/.test(example.content)) {
      errors.push(`example ${index + 1} source is missing <script setup lang="ts">`)
    }
    const template = extractRootTemplate(example.content)
    if (template === null) {
      errors.push(`example ${index + 1} source is missing <template>`)
    } else if (normalizedMarkup(template) !== normalizedMarkup(demo.markup)) {
      errors.push(`example ${index + 1} template does not match the live demo`)
    }

    previousDemoEnd = demo.end
  }

  for (const fence of fences) {
    if (!['html', 'vue'].includes(fence.info)) continue
    if (fence.info === 'html') {
      errors.push(`HTML source block at character ${fence.start} must be a complete Vue SFC`)
      continue
    }
    if (
      !/<script setup lang="ts">[\s\S]*?<\/script>/.test(fence.content) ||
      !/<template>[\s\S]*?<\/template>/.test(fence.content)
    ) {
      errors.push(`Vue source block at character ${fence.start} is not a complete TypeScript SFC`)
    }
  }

  return errors.map((error) => `${file}: ${error}`)
}

const files = (await readdir(componentsDir)).filter((file) => file.endsWith('.md')).sort()
const allErrors = []

for (const file of files) {
  const filePath = path.join(componentsDir, file)
  let source = await readFile(filePath, 'utf8')
  if (write) {
    source = syncExamples(source)
    await writeFile(filePath, source)
  }
  allErrors.push(...validatePage(file, source))
}

if (allErrors.length > 0) {
  console.error(`Component documentation example check failed (${allErrors.length}):`)
  for (const error of allErrors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Checked ${files.length} component documentation pages.`)
}
