<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: '' })
</script>

<template>
  <div class="mc-appbar">
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
