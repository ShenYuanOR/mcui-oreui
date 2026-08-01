import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { createMcUI } from '../../../src'
import { mcAllIconSet } from '../../../src/icons/all'
import DocsLayout from './DocsLayout.vue'
import DocsCodeExample from './DocsCodeExample.vue'
import McIconGallery from './McIconGallery.vue'
import McUtilityCatalog from './McUtilityCatalog.vue'
import './mcui-doc.css'
import './custom.css'
import './docs-theme.css'
import './utility-doc.css'
import './docs-code-example.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: DocsLayout,
  enhanceApp({ app }) {
    app.use(createMcUI({ icons: { sets: { mc: mcAllIconSet } }, display: { ssrWidth: 1280 } }))
    app.component('mc-icon-gallery', McIconGallery)
    app.component('mc-utility-catalog', McUtilityCatalog)
    app.component('docs-code-example', DocsCodeExample)
  },
}

export default theme
