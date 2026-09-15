<script lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { defineComponent, h, type VNode } from 'vue'
import {
  applyMcDefaults,
  hasConfiguredDefaults,
  useMcDefaults,
  type McDefaultsInstance,
} from '../../framework/defaults'
import { useMcLocale } from '../../framework/locale'
import { useMcTheme } from '../../framework/theme'

export default defineComponent({
  name: 'McApp',
  setup(_, { slots }) {
    const theme = useMcTheme()
    const locale = useMcLocale()
    const defaults = useMcDefaults() as McDefaultsInstance
    return () => {
      const attrs = { class: ['mc-app', ...theme.classes.value], style: theme.styles.value, dir: locale.dir.value }
      if (!hasConfiguredDefaults(defaults)) return h('div', attrs, slots)
      return h('div', attrs, applyMcDefaults(slots.default?.() ?? [], defaults) as VNode[])
    }
  },
})
</script>
