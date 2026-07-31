<script lang="ts">
import '../../styles/component-core.css'
import { defineComponent, h, provide, watch, type PropType, type VNode } from 'vue'
import {
  applyMcDefaults,
  createMcDefaults,
  mcDefaultsKey,
  useMcDefaults,
  type McDefaultsInstance,
} from '../../framework/defaults'
import type { McDefaultsOptions } from '../../framework/types'

export default defineComponent({
  name: 'McDefaultsProvider',
  props: {
    defaults: { type: Object as PropType<McDefaultsOptions>, default: () => ({}) },
    tag: { type: String, default: 'div' },
  },
  setup(props, { slots }) {
    const parent = useMcDefaults() as McDefaultsInstance
    const local = createMcDefaults(props.defaults, parent)
    watch(
      () => props.defaults,
      (value) => {
        local.options = value
      },
      { deep: true },
    )
    provide(mcDefaultsKey, local)
    return () =>
      h(props.tag, { class: 'mc-defaults-provider' }, applyMcDefaults(slots.default?.() ?? [], local) as VNode[])
  },
})
</script>
