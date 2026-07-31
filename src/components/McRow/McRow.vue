<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'

defineOptions({ name: 'McRow' })

export type McGridAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch'
export type McGridJustify = 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly'

const props = withDefaults(
  defineProps<{
    /** 渲染的 HTML 标签 */
    tag?: string
    /** 更紧凑的 8px gutter */
    dense?: boolean
    /** 移除列间距 */
    noGutters?: boolean
    align?: McGridAlign
    alignSm?: McGridAlign
    alignMd?: McGridAlign
    alignLg?: McGridAlign
    alignXl?: McGridAlign
    alignXxl?: McGridAlign
    justify?: McGridJustify
    justifySm?: McGridJustify
    justifyMd?: McGridJustify
    justifyLg?: McGridJustify
    justifyXl?: McGridJustify
    justifyXxl?: McGridJustify
  }>(),
  { tag: 'div', dense: false, noGutters: false },
)

function addBreakpointStyle(styles: Record<string, string>, property: string, breakpoint: string, value?: string) {
  if (!value) return
  const prefix = breakpoint ? `${breakpoint}-` : ''
  styles[`--mc-row-${prefix}${property}`] = value === 'start' ? 'flex-start' : value === 'end' ? 'flex-end' : value
}

const styles = computed(() => {
  const result: Record<string, string> = { '--mc-grid-gutter': props.noGutters ? '0px' : props.dense ? '8px' : '24px' }
  addBreakpointStyle(result, 'align', '', props.align)
  addBreakpointStyle(result, 'align', 'sm', props.alignSm)
  addBreakpointStyle(result, 'align', 'md', props.alignMd)
  addBreakpointStyle(result, 'align', 'lg', props.alignLg)
  addBreakpointStyle(result, 'align', 'xl', props.alignXl)
  addBreakpointStyle(result, 'align', 'xxl', props.alignXxl)
  addBreakpointStyle(result, 'justify', '', props.justify)
  addBreakpointStyle(result, 'justify', 'sm', props.justifySm)
  addBreakpointStyle(result, 'justify', 'md', props.justifyMd)
  addBreakpointStyle(result, 'justify', 'lg', props.justifyLg)
  addBreakpointStyle(result, 'justify', 'xl', props.justifyXl)
  addBreakpointStyle(result, 'justify', 'xxl', props.justifyXxl)
  return result
})
</script>

<template>
  <component :is="tag" class="mc-row" :style="styles">
    <slot />
  </component>
</template>
