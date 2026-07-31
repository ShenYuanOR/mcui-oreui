import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import publicEntries from './scripts/public-entries.json'

const componentEntries = Object.fromEntries(
  readdirSync(resolve(__dirname, 'src/components'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^Mc[A-Z]/.test(entry.name))
    .filter((entry) => existsSync(resolve(__dirname, 'src/components', entry.name, 'index.ts')))
    .map((entry) => [`components/${entry.name}`, resolve(__dirname, 'src/components', entry.name, 'index.ts')]),
)

const composableEntries = Object.fromEntries(
  publicEntries.composables.map((name) => [`composables/${name}`, resolve(__dirname, 'src/composables', `${name}.ts`)]),
)

export default defineConfig({
  plugins: [vue(), libInjectCss(), dts({ include: ['src'], rollupTypes: false })],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...componentEntries,
        ...composableEntries,
        ...Object.fromEntries(
          publicEntries.icons.map((name) => [`icons/${name}`, resolve(__dirname, 'src/icons', `${name}.ts`)]),
        ),
        ...Object.fromEntries(
          publicEntries.sounds.map((name) => [`sounds/${name}`, resolve(__dirname, 'src/sounds', `${name}.ts`)]),
        ),
      },
      formats: ['es'],
    },
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        hoistTransitiveImports: false,
        assetFileNames: (info: { name?: string }) =>
          info.name === 'style.css' ? 'styles/components.bundle.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
