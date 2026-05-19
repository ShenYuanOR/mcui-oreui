<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: '' })
</script>

<template>
  <header>
    <div class="header_item header_item_left header_item_blank">
      <slot name="left" />
    </div>
    <div class="header_logo">
      <div class="header_title"><slot name="title">{{ title }}</slot></div>
    </div>
    <div class="header_item header_item_right">
      <slot name="right" />
    </div>
  </header>
</template>
