<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    /** 高度，默认 40px；可传数字（px）或字符串（如 '80px'、'auto'） */
    height?: number | string
  }>(),
  { title: '', height: 40 },
)
</script>

<template>
  <div class="mc-appbar" :style="{ height: typeof props.height === 'number' ? props.height + 'px' : props.height }">
    <div class="mc-appbar__left">
      <span v-if="title" class="mc-appbar__title">{{ title }}</span>
      <slot name="left" />
    </div>
    <div class="mc-appbar__center">
      <slot />
    </div>
    <div class="mc-appbar__right">
      <slot name="right" />
    </div>
  </div>
</template>
