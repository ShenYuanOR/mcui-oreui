import vue from '@vitejs/plugin-vue'
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    plugins: [vue()],
    test: {
      name: 'unit',
      environment: 'jsdom',
      include: ['tests/unit/**/*.spec.ts'],
      setupFiles: ['tests/setup.ts'],
      restoreMocks: true,
    },
  },
  {
    plugins: [vue()],
    test: {
      name: 'ssr',
      environment: 'node',
      include: ['tests/ssr/**/*.spec.ts'],
    },
  },
])
