<script setup lang="ts">
import type { McListItemProps, McListValue } from './listTypes'

defineOptions({ name: 'McListItem' })

withDefaults(
  defineProps<{
    label: string
    value: McListValue
    disabled?: boolean
    /** 是否显示鼠标悬浮、按下、焦点等点击响应样式，默认 true */
    interactive?: boolean
    /** 左侧图标名称 */
    icon?: string
    /** 右侧图标名称 */
    iconRight?: string
    /** 该项的副标题说明 */
    subtitle?: string
  }>(),
  { disabled: false, interactive: true, icon: '', iconRight: '', subtitle: '' },
)

defineSlots<{
  left?: (props: { item: McListItemProps }) => unknown
  right?: (props: { item: McListItemProps }) => unknown
}>()
</script>

<template></template>
