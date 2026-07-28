<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: '' })
</script>

<template>
  <header class="mc-header">
    <div class="mc-header__left">
      <slot name="left" />
    </div>
    <div class="mc-header__center">
      <div class="mc-header__title">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div class="mc-header__right">
      <slot name="right" />
    </div>
  </header>
</template>
