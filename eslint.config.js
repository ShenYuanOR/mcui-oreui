import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'docs/.vitepress/cache/**',
      'docs/.vitepress/dist/**',
      'docs/.vitepress/generated/**',
      'src/generated/**',
      'src/icons/generated/**',
      'src/components/*/index.ts',
      'tests/e2e/**/*-snapshots/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,ts,vue}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { parser: tseslint.parser, extraFileExtensions: ['.vue'] },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'error',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
    },
  },
  {
    files: ['tests/**/*.{ts,vue}'],
    rules: {
      'vue/attributes-order': 'off',
      'vue/one-component-per-file': 'off',
    },
  },
  {
    files: ['docs/.vitepress/theme/index.ts'],
    rules: { 'vue/component-definition-name-casing': 'off' },
  },
  eslintConfigPrettier,
)
