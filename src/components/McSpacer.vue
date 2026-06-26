<script setup lang="ts">
defineOptions({ name: 'McSpacer' })

withDefaults(
  defineProps<{
    /** 渲染的 HTML 标签 */
    tag?: string
  }>(),
  { tag: 'div' },
)
</script>

<template>
  <component :is="tag" class="mc-spacer">
    <slot />
  </component>
</template>
