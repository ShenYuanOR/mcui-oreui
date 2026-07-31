import { gzipSync } from 'node:zlib'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { build } from 'esbuild'

const fixtures = {
  Button: "import McButton from './dist/components/McButton.js'; console.log(McButton)",
  Icon: "import McIcon from './dist/components/McIcon.js'; console.log(McIcon)",
  Container: "import McContainer from './dist/components/McContainer.js'; console.log(McContainer)",
  Plugin: "import { createMcUI } from './dist/index.js'; console.log(createMcUI)",
}

const forbiddenAssets = ['drawer_open.ogg', 'data:audio/', 'Minecraft-Ten.otf', 'xbox-a.svg', 'mc-x-achievements']

for (const [name, contents] of Object.entries(fixtures)) {
  const result = await build({
    absWorkingDir: process.cwd(),
    stdin: { contents, resolveDir: process.cwd(), sourcefile: `${name}.ts` },
    bundle: true,
    external: ['vue'],
    format: 'esm',
    minify: true,
    treeShaking: true,
    write: false,
    outdir: 'out',
  })
  const source = result.outputFiles.find((file) => file.path.endsWith('.js'))?.text ?? ''
  const gzipBytes = gzipSync(source).byteLength
  if (name !== 'Plugin' && gzipBytes > 25 * 1024) {
    throw new Error(`${name} fixture is ${gzipBytes} bytes gzip; budget is 25600`)
  }
  for (const marker of forbiddenAssets) {
    if (source.includes(marker))
      throw new Error(`${name} fixture unexpectedly contains optional asset marker: ${marker}`)
  }
  process.stdout.write(`${name}: ${gzipBytes} bytes gzip\n`)
}

const utilityCss = await readFile('dist/styles/utilities.css')
const tokenCss = await readFile('dist/styles/tokens.css')
const componentCoreCss = await readFile('dist/styles/component-core.css')
const sharedCss = await Promise.all(
  (await readdir('dist/styles/shared'))
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFile(resolve('dist/styles/shared', file))),
)
const componentCss = await Promise.all(
  (await readdir('dist/components', { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^Mc[A-Z]/.test(entry.name))
    .map((entry) => readFile(resolve('dist/components', entry.name, 'component.css'))),
)
const utilityGzipBytes = gzipSync(utilityCss).byteLength
const automaticComponentCss = Buffer.concat([
  tokenCss,
  Buffer.from(componentCoreCss.toString().replace(/^@import ['"]\.\/tokens\.css['"];?\s*/m, '')),
  ...sharedCss,
  ...componentCss,
])
const automaticComponentGzipBytes = gzipSync(automaticComponentCss).byteLength
const completeCssGzipBytes = gzipSync(
  Buffer.concat([
    automaticComponentCss,
    Buffer.from(utilityCss.toString().replace(/^@import ['"]\.\/tokens\.css['"];?\s*/m, '')),
  ]),
).byteLength
if (utilityGzipBytes > 60 * 1024) throw new Error(`utilities.css exceeds the 60 KB gzip budget`)
if (automaticComponentGzipBytes > 30 * 1024) throw new Error(`automatic component CSS exceeds the 30 KB gzip budget`)
if (completeCssGzipBytes > 60 * 1024) throw new Error(`the complete optional CSS exceeds the 60 KB gzip budget`)
process.stdout.write(`utilities.css: ${utilityGzipBytes} bytes gzip\n`)
process.stdout.write(`automatic component CSS: ${automaticComponentGzipBytes} bytes gzip\n`)
process.stdout.write(`complete optional CSS (components + Utilities): ${completeCssGzipBytes} bytes gzip\n`)
