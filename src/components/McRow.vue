<script setup lang="ts">
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

function addBreakpointClass(classes: string[], prefix: string, breakpoint: string, value?: string) {
  if (!value) return
  classes.push(breakpoint ? `${prefix}-${breakpoint}-${value}` : `${prefix}-${value}`)
}

const classes = computed(() => {
  const result = ['mc-row']
  if (props.dense) result.push('mc-row--dense')
  if (props.noGutters) result.push('mc-row--no-gutters')

  addBreakpointClass(result, 'mc-row--align', '', props.align)
  addBreakpointClass(result, 'mc-row--align', 'sm', props.alignSm)
  addBreakpointClass(result, 'mc-row--align', 'md', props.alignMd)
  addBreakpointClass(result, 'mc-row--align', 'lg', props.alignLg)
  addBreakpointClass(result, 'mc-row--align', 'xl', props.alignXl)
  addBreakpointClass(result, 'mc-row--align', 'xxl', props.alignXxl)

  addBreakpointClass(result, 'mc-row--justify', '', props.justify)
  addBreakpointClass(result, 'mc-row--justify', 'sm', props.justifySm)
  addBreakpointClass(result, 'mc-row--justify', 'md', props.justifyMd)
  addBreakpointClass(result, 'mc-row--justify', 'lg', props.justifyLg)
  addBreakpointClass(result, 'mc-row--justify', 'xl', props.justifyXl)
  addBreakpointClass(result, 'mc-row--justify', 'xxl', props.justifyXxl)

  return result
})
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
