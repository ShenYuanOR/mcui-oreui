<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'

defineOptions({ name: 'McCol' })

export type McGridColumnValue = boolean | number | string
export type McGridAlignSelf = 'auto' | 'start' | 'center' | 'end' | 'baseline' | 'stretch'
export type McGridOrderValue = number | string

const props = withDefaults(
  defineProps<{
    /** 渲染的 HTML 标签 */
    tag?: string
    /** 默认断点列宽，1-12 / auto；不传时为等分列 */
    cols?: McGridColumnValue
    sm?: McGridColumnValue
    md?: McGridColumnValue
    lg?: McGridColumnValue
    xl?: McGridColumnValue
    xxl?: McGridColumnValue
    offset?: number | string
    offsetSm?: number | string
    offsetMd?: number | string
    offsetLg?: number | string
    offsetXl?: number | string
    offsetXxl?: number | string
    order?: McGridOrderValue
    orderSm?: McGridOrderValue
    orderMd?: McGridOrderValue
    orderLg?: McGridOrderValue
    orderXl?: McGridOrderValue
    orderXxl?: McGridOrderValue
    alignSelf?: McGridAlignSelf
    alignSelfSm?: McGridAlignSelf
    alignSelfMd?: McGridAlignSelf
    alignSelfLg?: McGridAlignSelf
    alignSelfXl?: McGridAlignSelf
    alignSelfXxl?: McGridAlignSelf
  }>(),
  { tag: 'div' },
)

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || value === false || value === ''
}

function normalizeColumnValue(value: McGridColumnValue | undefined): string | undefined {
  if (isBlank(value)) return undefined
  if (value === true) return ''
  if (value === 'auto') return 'auto'
  const numeric = Number(value)
  if (Number.isInteger(numeric) && numeric >= 1 && numeric <= 12) return String(numeric)
  return undefined
}

function normalizeOffsetValue(value: number | string | undefined): string | undefined {
  if (isBlank(value)) return undefined
  const numeric = Number(value)
  if (Number.isInteger(numeric) && numeric >= 0 && numeric <= 12) return String(numeric)
  return undefined
}

function normalizeOrderValue(value: McGridOrderValue | undefined): string | undefined {
  if (isBlank(value)) return undefined
  if (value === 'first' || value === 'last') return value
  const numeric = Number(value)
  if (Number.isInteger(numeric) && numeric >= 0 && numeric <= 12) return String(numeric)
  return undefined
}

function addColumnStyle(styles: Record<string, string | number>, breakpoint: string, value?: McGridColumnValue) {
  const normalized = normalizeColumnValue(value)
  if (normalized === undefined) return
  const prefix = breakpoint ? `${breakpoint}-` : ''
  if (!normalized) return
  styles[`--mc-col-${prefix}grow`] = 0
  if (normalized === 'auto') {
    styles[`--mc-col-${prefix}basis`] = 'auto'
    styles[`--mc-col-${prefix}max`] = '100%'
    styles[`--mc-col-${prefix}width`] = 'auto'
  } else {
    const width = `${(Number(normalized) / 12) * 100}%`
    styles[`--mc-col-${prefix}basis`] = width
    styles[`--mc-col-${prefix}max`] = width
    styles[`--mc-col-${prefix}width`] = width
  }
}

function addOffsetStyle(styles: Record<string, string | number>, breakpoint: string, value?: number | string) {
  const normalized = normalizeOffsetValue(value)
  if (normalized === undefined) return
  const prefix = breakpoint ? `${breakpoint}-` : ''
  styles[`--mc-col-${prefix}offset`] = `${(Number(normalized) / 12) * 100}%`
}

function addOrderStyle(styles: Record<string, string | number>, breakpoint: string, value?: McGridOrderValue) {
  const normalized = normalizeOrderValue(value)
  if (normalized === undefined) return
  const prefix = breakpoint ? `${breakpoint}-` : ''
  styles[`--mc-col-${prefix}order`] = normalized === 'first' ? -1 : normalized === 'last' ? 13 : Number(normalized)
}

function addAlignSelfStyle(styles: Record<string, string | number>, breakpoint: string, value?: McGridAlignSelf) {
  if (!value) return
  const prefix = breakpoint ? `${breakpoint}-` : ''
  styles[`--mc-col-${prefix}align`] = value === 'start' ? 'flex-start' : value === 'end' ? 'flex-end' : value
}

const styles = computed(() => {
  const result: Record<string, string | number> = {}
  addColumnStyle(result, '', props.cols)
  addColumnStyle(result, 'sm', props.sm)
  addColumnStyle(result, 'md', props.md)
  addColumnStyle(result, 'lg', props.lg)
  addColumnStyle(result, 'xl', props.xl)
  addColumnStyle(result, 'xxl', props.xxl)
  addOffsetStyle(result, '', props.offset)
  addOffsetStyle(result, 'sm', props.offsetSm)
  addOffsetStyle(result, 'md', props.offsetMd)
  addOffsetStyle(result, 'lg', props.offsetLg)
  addOffsetStyle(result, 'xl', props.offsetXl)
  addOffsetStyle(result, 'xxl', props.offsetXxl)
  addOrderStyle(result, '', props.order)
  addOrderStyle(result, 'sm', props.orderSm)
  addOrderStyle(result, 'md', props.orderMd)
  addOrderStyle(result, 'lg', props.orderLg)
  addOrderStyle(result, 'xl', props.orderXl)
  addOrderStyle(result, 'xxl', props.orderXxl)
  addAlignSelfStyle(result, '', props.alignSelf)
  addAlignSelfStyle(result, 'sm', props.alignSelfSm)
  addAlignSelfStyle(result, 'md', props.alignSelfMd)
  addAlignSelfStyle(result, 'lg', props.alignSelfLg)
  addAlignSelfStyle(result, 'xl', props.alignSelfXl)
  addAlignSelfStyle(result, 'xxl', props.alignSelfXxl)
  return result
})
</script>

<template>
  <component :is="tag" class="mc-col" :style="styles">
    <slot />
  </component>
</template>
