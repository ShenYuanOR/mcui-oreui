import { cp, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(rootDir, 'dist')
const rootPackageUrl = new URL('../package.json', import.meta.url)
const rootPackage = JSON.parse(await readFile(rootPackageUrl, 'utf8'))

function stripDistPrefix(value) {
  if (typeof value === 'string') return value.replace(/^\.\/dist\//, './')
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, stripDistPrefix(item)]))
}

const distPackage = {
  name: rootPackage.name,
  version: rootPackage.version,
  description: rootPackage.description,
  keywords: rootPackage.keywords,
  license: rootPackage.license,
  author: rootPackage.author,
  repository: rootPackage.repository,
  homepage: rootPackage.homepage,
  bugs: rootPackage.bugs,
  type: 'module',
  sideEffects: ['**/*.css'],
  main: './index.js',
  module: './index.js',
  types: './index.d.ts',
  'web-types': './web-types.json',
  exports: stripDistPrefix(rootPackage.exports),
  peerDependencies: rootPackage.peerDependencies,
}

await writeFile(resolve(distDir, 'package.json'), `${JSON.stringify(distPackage, null, 2)}\n`, 'utf8')

await copyFile(resolve(rootDir, 'web-types.json'), resolve(distDir, 'web-types.json'))

await mkdir(resolve(distDir, 'styles'), { recursive: true })
for (const file of ['base.css', 'component-core.css', 'components.css', 'fonts.css', 'tokens.css', 'utilities.css']) {
  await copyFile(resolve(rootDir, 'src/styles', file), resolve(distDir, 'styles', file))
}
await cp(resolve(rootDir, 'src/styles/shared'), resolve(distDir, 'styles/shared'), { recursive: true })

const componentNames = (await readdir(resolve(rootDir, 'src/components'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^Mc[A-Z]/.test(entry.name))
  .map((entry) => entry.name)
for (const componentName of componentNames) {
  const targetDir = resolve(distDir, 'components', componentName)
  await mkdir(targetDir, { recursive: true })
  for (const file of ['component.css', 'style.css']) {
    await copyFile(resolve(rootDir, 'src/components', componentName, file), resolve(targetDir, file))
  }
  const componentDeclaration = await readFile(resolve(distDir, 'components', componentName, 'index.d.ts'), 'utf8')
  await writeFile(
    resolve(distDir, 'components', `${componentName}.d.ts`),
    componentDeclaration.replaceAll(`./${componentName}.vue`, `./${componentName}/${componentName}.vue`),
    'utf8',
  )
}
await mkdir(resolve(distDir, 'assets/fonts'), { recursive: true })
for (const file of ['Minecraft-Five-Bold.otf', 'Minecraft-Five.otf', 'Minecraft-Seven.otf', 'Minecraft-Ten.otf']) {
  await copyFile(resolve(rootDir, 'src/assets/fonts', file), resolve(distDir, 'assets/fonts', file))
}
