<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'McContainer' })

const props = withDefaults(
  defineProps<{
    /** 使用全宽容器，不限制最大宽度 */
    fluid?: boolean
    /** 渲染的 HTML 标签 */
    tag?: string
  }>(),
  { fluid: false, tag: 'div' },
)

const classes = computed(() => ({
  'mc-container': true,
  'mc-container--fluid': props.fluid,
}))
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
