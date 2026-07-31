import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: './vitest.workspace.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      all: true,
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/*.d.ts',
        'src/generated/**',
        'src/icons/generated/**',
        'src/components/*/index.ts',
        'tests/fixtures/**',
        'tests/e2e/fixture/**',
      ],
      thresholds: { statements: 90, lines: 90, functions: 90, branches: 85 },
    },
  },
})
