import { createApp } from 'vue'
import '../../../../src/styles/utilities.css'
import '../../../../src/styles/fonts.css'
import { createMcUI } from '../../../../src'
import { mcNormalIconSet } from '../../../../src/icons/normal'
import App from './App.vue'
import VisualGallery from './VisualGallery.vue'
import UtilitiesFixture from './UtilitiesFixture.vue'

const Root = window.location.pathname.startsWith('/visual')
  ? VisualGallery
  : window.location.pathname.startsWith('/utilities')
    ? UtilitiesFixture
    : App
createApp(Root)
  .use(
    createMcUI({
      locale: { locale: 'en' },
      display: { ssrWidth: 1280 },
      icons: { sets: { mc: mcNormalIconSet } },
    }),
  )
  .mount('#app')
