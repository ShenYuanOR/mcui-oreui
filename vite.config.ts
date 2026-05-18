import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // OreUI 原 CSS 大量使用自定义元素选择器，这些标签按原生元素处理以零偏差复用样式
          isCustomElement: (tag: string) =>
            tag.startsWith('custom-') ||
            ['text-field', 'link-block', 'scroll-view', 'scroll-container',
             'display-body', 'dispaly-area'].includes(tag),
        },
      },
    }),
    dts({ include: ['src'], rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OreUIVue',
      fileName: 'mcui-oreui',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: (info: { name?: string }) =>
          info.name === 'style.css' ? 'mcui-oreui.css' : 'assets/[name][extname]',
      },
    },
  },
})
