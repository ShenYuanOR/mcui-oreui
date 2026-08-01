import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { createMcUI } from '../../src'
import { splitVueCodeExample } from '../../docs/.vitepress/markdown/code-examples'
import DocsCodeExample from '../../docs/.vitepress/theme/DocsCodeExample.vue'

describe('documentation code examples', () => {
  it('splits and normalizes a Vue SFC into language sections', () => {
    expect(
      splitVueCodeExample(`
        <script setup lang="ts">
          import { ref } from 'vue'
          const open = ref(false)
        </script>

        <template>
          <mc-button @click="open = true">
            Open
          </mc-button>
        </template>

        <style scoped>
          .trigger {
            display: block;
          }
        </style>
      `),
    ).toEqual({
      javascript: "import { ref } from 'vue'\nconst open = ref(false)",
      javascriptLanguage: 'ts',
      html: '<mc-button @click="open = true">\n  Open\n</mc-button>',
      css: '.trigger {\n  display: block;\n}',
    })
  })

  it('expands the source and switches between the available language tabs', async () => {
    const wrapper = mount(DocsCodeExample, {
      slots: {
        javascript: () => h('pre', 'const open = true'),
        html: () => h('pre', '<mc-button>Open</mc-button>'),
      },
      global: { plugins: [createMcUI()] },
    })

    const header = wrapper.get('.mc-expansion-panel__header')
    expect(header.attributes('aria-expanded')).toBe('false')
    await header.trigger('click')
    expect(header.attributes('aria-expanded')).toBe('true')

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs.map((tab) => tab.text())).toEqual(['JS', 'HTML'])
    expect(tabs[0].attributes('aria-selected')).toBe('true')

    await tabs[1].trigger('click')
    expect(tabs[1].attributes('aria-selected')).toBe('true')
    const activePanel = wrapper.findAll('.mc-tabs__panel').find((item) => item.attributes('hidden') === undefined)
    expect(activePanel?.text()).toContain('<mc-button>Open</mc-button>')
  })
})
