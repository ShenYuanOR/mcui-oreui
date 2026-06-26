<script setup lang="ts">
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

function addColumnClass(classes: string[], breakpoint: string, value?: McGridColumnValue) {
  const normalized = normalizeColumnValue(value)
  if (normalized === undefined) return
  if (!breakpoint) {
    if (normalized) classes.push(`mc-col--${normalized}`)
    return
  }
  classes.push(normalized ? `mc-col--${breakpoint}-${normalized}` : `mc-col--${breakpoint}`)
}

function addOffsetClass(classes: string[], breakpoint: string, value?: number | string) {
  const normalized = normalizeOffsetValue(value)
  if (normalized === undefined) return
  classes.push(breakpoint ? `mc-col--offset-${breakpoint}-${normalized}` : `mc-col--offset-${normalized}`)
}

function addOrderClass(classes: string[], breakpoint: string, value?: McGridOrderValue) {
  const normalized = normalizeOrderValue(value)
  if (normalized === undefined) return
  classes.push(breakpoint ? `mc-col--order-${breakpoint}-${normalized}` : `mc-col--order-${normalized}`)
}

function addAlignSelfClass(classes: string[], breakpoint: string, value?: McGridAlignSelf) {
  if (!value) return
  classes.push(breakpoint ? `mc-col--align-self-${breakpoint}-${value}` : `mc-col--align-self-${value}`)
}

const classes = computed(() => {
  const result = ['mc-col']

  addColumnClass(result, '', props.cols)
  addColumnClass(result, 'sm', props.sm)
  addColumnClass(result, 'md', props.md)
  addColumnClass(result, 'lg', props.lg)
  addColumnClass(result, 'xl', props.xl)
  addColumnClass(result, 'xxl', props.xxl)

  addOffsetClass(result, '', props.offset)
  addOffsetClass(result, 'sm', props.offsetSm)
  addOffsetClass(result, 'md', props.offsetMd)
  addOffsetClass(result, 'lg', props.offsetLg)
  addOffsetClass(result, 'xl', props.offsetXl)
  addOffsetClass(result, 'xxl', props.offsetXxl)

  addOrderClass(result, '', props.order)
  addOrderClass(result, 'sm', props.orderSm)
  addOrderClass(result, 'md', props.orderMd)
  addOrderClass(result, 'lg', props.orderLg)
  addOrderClass(result, 'xl', props.orderXl)
  addOrderClass(result, 'xxl', props.orderXxl)

  addAlignSelfClass(result, '', props.alignSelf)
  addAlignSelfClass(result, 'sm', props.alignSelfSm)
  addAlignSelfClass(result, 'md', props.alignSelfMd)
  addAlignSelfClass(result, 'lg', props.alignSelfLg)
  addAlignSelfClass(result, 'xl', props.alignSelfXl)
  addAlignSelfClass(result, 'xxl', props.alignSelfXxl)

  return result
})
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
