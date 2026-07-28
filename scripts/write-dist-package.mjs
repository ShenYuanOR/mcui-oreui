import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(rootDir, 'dist');
const rootPackageUrl = new URL('../package.json', import.meta.url);
const rootPackage = JSON.parse(await readFile(rootPackageUrl, 'utf8'));

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
  sideEffects: ['*.css'],
  main: './mcui-oreui.umd.cjs',
  module: './mcui-oreui.js',
  types: './index.d.ts',
  style: './mcui-oreui.css',
  'web-types': './web-types.json',
  exports: {
    '.': {
      types: './index.d.ts',
      import: './mcui-oreui.js',
      require: './mcui-oreui.umd.cjs',
    },
    './style.css': './mcui-oreui.css',
  },
  peerDependencies: rootPackage.peerDependencies,
};

await writeFile(
  resolve(distDir, 'package.json'),
  `${JSON.stringify(distPackage, null, 2)}\n`,
  'utf8',
);

await copyFile(resolve(rootDir, 'web-types.json'), resolve(distDir, 'web-types.json'));
