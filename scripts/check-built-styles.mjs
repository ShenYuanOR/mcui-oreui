import { readFile, readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { build as buildWithVite } from 'vite'

const rootDir = resolve(import.meta.dirname, '..')
const sourceComponentsDir = resolve(rootDir, 'src/components')
const distDir = resolve(rootDir, 'dist')
const componentNames = (await readdir(sourceComponentsDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^Mc[A-Z]/.test(entry.name))
  .map((entry) => entry.name)
  .sort()
const componentCssSources = new Map()

function importsWithExtension(source, extension) {
  return Array.from(
    source.matchAll(new RegExp(`(?:import\\s+|from\\s+)["']([^"']+\\.${extension})["']`, 'g')),
    (match) => match[1],
  )
}

function cssComponentOwner(file) {
  return file
    .split('/')
    .at(-1)
    ?.match(/^(Mc[A-Za-z0-9]+)-[^/]+\.css$/)?.[1]
}

function containsClass(source, className) {
  return new RegExp(`\\.${className}(?![a-z0-9_-])`).test(source)
}

async function readImportedCss(javaScriptPath, javaScriptSource) {
  const imports = importsWithExtension(javaScriptSource, 'css')
  const uniqueImports = [...new Set(imports)]
  if (uniqueImports.length !== imports.length) throw new Error(`${javaScriptPath} contains duplicate CSS imports`)
  const sources = await Promise.all(
    uniqueImports.map(async (file) => ({
      file,
      source: await readFile(resolve(dirname(javaScriptPath), file), 'utf8'),
    })),
  )
  return { imports: uniqueImports, sources }
}

for (const componentName of componentNames) {
  const entryPath = resolve(distDir, 'components', `${componentName}.js`)
  const entry = await readFile(entryPath, 'utf8')
  const entryCss = await readImportedCss(entryPath, entry)
  const chunkImport = importsWithExtension(entry, 'js').find((file) => file.includes('/chunks/'))
  if (!chunkImport) throw new Error(`${componentName}.js does not reference its implementation chunk`)
  const chunkPath = resolve(dirname(entryPath), chunkImport)
  const chunk = await readFile(chunkPath, 'utf8')
  const chunkCss = await readImportedCss(chunkPath, chunk)
  const emittedCss = {
    imports: [...entryCss.imports, ...chunkCss.imports],
    sources: [...entryCss.sources, ...chunkCss.sources],
  }
  if (emittedCss.imports.filter((file) => file.includes('/component-core-')).length !== 1) {
    throw new Error(`${componentName}.js must import component-core exactly once`)
  }

  const sourceComponentCss = await readFile(resolve(sourceComponentsDir, componentName, 'component.css'), 'utf8')
  componentCssSources.set(componentName, sourceComponentCss)
  const hasLocalRules = sourceComponentCss.includes('{')
  const componentAssets = emittedCss.imports
    .map((file) => ({ file, owner: cssComponentOwner(file) }))
    .filter((asset) => asset.owner)
  for (const asset of componentAssets) {
    if (asset.owner !== componentName) {
      throw new Error(`${componentName}.js imports sibling component CSS ${asset.owner}: ${asset.file}`)
    }
  }
  if (hasLocalRules !== componentAssets.some((asset) => asset.owner === componentName)) {
    throw new Error(`${componentName}.js local CSS asset does not match component.css ownership`)
  }

  const sourceVue = await readFile(resolve(sourceComponentsDir, componentName, `${componentName}.vue`), 'utf8')
  const expectsInputControl = sourceVue.includes('class="mc-input')
  const inputControlImports = emittedCss.imports.filter((file) => file.includes('/input-control-'))
  if (inputControlImports.length !== (expectsInputControl ? 1 : 0)) {
    throw new Error(`${componentName}.js input-control dependency does not match its rendered classes`)
  }

  for (const file of chunkCss.imports) {
    const owner = cssComponentOwner(file)
    if (owner && owner !== componentName) {
      throw new Error(`${componentName}'s implementation chunk imports sibling component CSS ${owner}: ${file}`)
    }
  }
  if (hasLocalRules && !chunkCss.imports.some((file) => cssComponentOwner(file) === componentName)) {
    throw new Error(`${componentName}'s implementation chunk lost its component CSS`)
  }

  for (const file of ['component.css', 'style.css', 'index.d.ts']) {
    await readFile(resolve(distDir, 'components', componentName, file), 'utf8')
  }
  await readFile(resolve(distDir, 'components', `${componentName}.d.ts`), 'utf8')
}

for (const [componentName, marker] of [
  ['McButton', '.mc-button'],
  ['McIcon', '.mc-icon--pixel'],
  ['McSkinViewer', '.mc-skin-viewer'],
]) {
  const entryPath = resolve(distDir, 'components', `${componentName}.js`)
  const entry = await readFile(entryPath, 'utf8')
  const chunkImport = importsWithExtension(entry, 'js').find((file) => file.includes('/chunks/'))
  if (!chunkImport) throw new Error(`${componentName}.js does not reference its implementation chunk`)
  const chunkPath = resolve(dirname(entryPath), chunkImport)
  const chunk = await readFile(chunkPath, 'utf8')
  const css = (await readImportedCss(chunkPath, chunk)).sources.map((asset) => asset.source).join('\n')
  if (!css.includes(marker)) throw new Error(`${componentName}'s emitted CSS is missing ${marker}`)
  if (css.includes('.d-flex')) throw new Error(`${componentName}'s emitted CSS unexpectedly includes Utilities`)
}

const containerEntryPath = resolve(distDir, 'components/McContainer.js')
const containerEntry = await readFile(containerEntryPath, 'utf8')
const containerChunkImport = importsWithExtension(containerEntry, 'js').find((file) => file.includes('/chunks/'))
if (!containerChunkImport) throw new Error('McContainer.js does not reference its implementation chunk')
const containerChunkPath = resolve(dirname(containerEntryPath), containerChunkImport)
const containerChunk = await readFile(containerChunkPath, 'utf8')
const containerCss = (await readImportedCss(containerChunkPath, containerChunk)).sources
  .map((asset) => asset.source)
  .join('\n')
for (const unusedClass of ['mc-row', 'mc-col', 'mc-spacer', 'mc-data-table', 'mc-overlay', 'mc-button']) {
  if (containsClass(containerCss, unusedClass)) {
    throw new Error(`McContainer's emitted CSS unexpectedly includes .${unusedClass}`)
  }
}

async function collectJavaScriptFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await collectJavaScriptFiles(path)))
    else if (entry.name.endsWith('.js')) files.push(path)
  }
  return files
}

for (const file of await collectJavaScriptFiles(distDir)) {
  const source = await readFile(file, 'utf8')
  if (/document\.createElement\(\s*["']style["']/i.test(source)) {
    throw new Error(`Runtime style injection found in ${file}`)
  }
}

await readFile(resolve(distDir, 'styles/component-core.css'), 'utf8')
await readFile(resolve(distDir, 'styles/shared/input-control.css'), 'utf8')

async function bundleConsumerCss(source, name) {
  const virtualId = `\0mcui-${name}`
  const result = await buildWithVite({
    configFile: false,
    logLevel: 'silent',
    plugins: [
      {
        name: `mcui:${name}-fixture`,
        resolveId(id) {
          if (id === virtualId.slice(1)) return virtualId
        },
        load(id) {
          if (id === virtualId) return source
        },
      },
    ],
    build: {
      minify: false,
      write: false,
      rollupOptions: { input: virtualId.slice(1), external: ['vue'], output: { format: 'es' } },
    },
  })
  const outputs = (Array.isArray(result) ? result[0] : result).output
  return outputs
    .filter((output) => output.type === 'asset' && output.fileName.endsWith('.css'))
    .map((output) => String(output.source))
    .join('\n')
}

const namedRootCss = await bundleConsumerCss(
  "import { McContainer } from 'mcui-oreui'; console.log(McContainer)",
  'named-root',
)
if (!containsClass(namedRootCss, 'mc-container')) throw new Error('Named root import lost McContainer styles')
for (const unusedClass of ['mc-row', 'mc-col', 'mc-spacer', 'mc-button', 'mc-data-table', 'mc-overlay', 'd-flex']) {
  if (containsClass(namedRootCss, unusedClass)) {
    throw new Error(`Named root import unexpectedly includes .${unusedClass}`)
  }
}

for (const probe of [
  {
    name: 'select',
    source: "import { McSelect } from 'mcui-oreui'; console.log(McSelect)",
    required: ['mc-select', 'mc-form-field', 'mc-overlay'],
    forbidden: ['mc-autocomplete', 'mc-input', 'mc-checkbox', 'mc-radio', 'mc-switch'],
  },
  {
    name: 'autocomplete',
    source: "import { McAutocomplete } from 'mcui-oreui'; console.log(McAutocomplete)",
    required: ['mc-autocomplete', 'mc-input', 'mc-form-field', 'mc-overlay'],
    forbidden: ['mc-select', 'mc-checkbox', 'mc-radio', 'mc-switch'],
  },
  {
    name: 'checkbox',
    source: "import { McCheckbox } from 'mcui-oreui'; console.log(McCheckbox)",
    required: ['mc-checkbox', 'mc-form-field'],
    forbidden: ['mc-radio', 'mc-switch', 'mc-input', 'mc-select', 'mc-autocomplete'],
  },
  {
    name: 'radio-group',
    source: "import { McRadioGroup } from 'mcui-oreui'; console.log(McRadioGroup)",
    required: ['mc-radio-group', 'mc-radio', 'mc-form-field'],
    forbidden: ['mc-checkbox', 'mc-switch', 'mc-input'],
  },
  {
    name: 'dialog',
    source: "import { McDialog } from 'mcui-oreui'; console.log(McDialog)",
    required: ['mc-dialog', 'mc-overlay'],
    forbidden: ['mc-drawer', 'mc-menu', 'mc-tooltip', 'mc-select', 'mc-autocomplete'],
  },
]) {
  const css = await bundleConsumerCss(probe.source, probe.name)
  for (const requiredClass of probe.required) {
    if (!containsClass(css, requiredClass)) throw new Error(`${probe.name} consumer CSS is missing .${requiredClass}`)
  }
  for (const forbiddenClass of probe.forbidden) {
    if (containsClass(css, forbiddenClass))
      throw new Error(`${probe.name} consumer CSS includes sibling .${forbiddenClass}`)
  }
  if (containsClass(css, 'd-flex')) throw new Error(`${probe.name} consumer CSS unexpectedly includes Utilities`)
}

const pluginCss = await bundleConsumerCss(
  "import { createMcUI } from 'mcui-oreui'; console.log(createMcUI)",
  'full-plugin',
)
if (!containsClass(pluginCss, 'mc-theme')) throw new Error('Full plugin CSS is missing component Core')
if (!containsClass(pluginCss, 'mc-input')) throw new Error('Full plugin CSS is missing input-control styles')
for (const [componentName, sourceCss] of componentCssSources) {
  const ownedClass = sourceCss.match(/\.(mc-[a-z0-9_-]+)/)?.[1]
  if (ownedClass && !containsClass(pluginCss, ownedClass)) {
    throw new Error(`Full plugin CSS is missing ${componentName} selector .${ownedClass}`)
  }
}
if (containsClass(pluginCss, 'd-flex')) throw new Error('Full plugin CSS unexpectedly includes Utilities')

process.stdout.write(`Built style contract passed for ${componentNames.length} component entries.\n`)
