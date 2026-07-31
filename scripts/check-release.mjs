import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const packageLock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'))
const changelog = await readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8')
const npmCommand = process.platform === 'win32' ? process.execPath : 'npm'
const npmPrefix =
  process.platform === 'win32'
    ? [process.env.npm_execpath ?? resolve(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js')]
    : []
const skipRegistry = process.argv.includes('--skip-registry')
const runNpm = (args, options) => execFileSync(npmCommand, [...npmPrefix, ...args], options)

if (packageLock.version !== packageJson.version || packageLock.packages?.['']?.version !== packageJson.version) {
  throw new Error('package.json and package-lock.json versions are not synchronized')
}
if (!changelog.includes(`## [${packageJson.version}]`)) {
  throw new Error(`CHANGELOG.md has no release section for ${packageJson.version}`)
}
if (packageJson.style || packageJson.exports?.['.']?.style) {
  throw new Error('Package metadata must not imply automatic full CSS loading')
}

if (!skipRegistry) {
  try {
    runNpm(['view', `${packageJson.name}@${packageJson.version}`, 'version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    throw new Error(`${packageJson.name}@${packageJson.version} already exists on npm`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) throw error
    const stderr = String(error?.stderr ?? '')
    if (!/E404|is not in this registry/i.test(stderr)) throw error
  }
}

const pack = JSON.parse(runNpm(['pack', '--dry-run', '--json'], { encoding: 'utf8' }))[0]
if (pack.size >= 800 * 1024) throw new Error(`npm tarball is ${pack.size} bytes; budget is below 800 KB`)
if (pack.unpackedSize >= 2 * 1024 * 1024) {
  throw new Error(`npm unpacked size is ${pack.unpackedSize} bytes; budget is below 2 MB`)
}
const forbidden = /(^|\/)(?:AGENTS\.md|CLAUDE\.md|SESSION_STATE(?:\.md|\.json)?|\.codex|\.env(?:\.|$))/i
for (const file of pack.files) {
  if (forbidden.test(file.path)) throw new Error(`Private file found in npm pack: ${file.path}`)
}

process.stdout.write(`Release contract passed: ${pack.size} bytes packed, ${pack.unpackedSize} bytes unpacked.\n`)
