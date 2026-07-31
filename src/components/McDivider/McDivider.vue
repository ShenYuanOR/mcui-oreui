<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
withDefaults(defineProps<{ vertical?: boolean; decorative?: boolean }>(), { vertical: false, decorative: true })
</script>

<template>
  <div
    class="mc-divider"
    :class="{ 'mc-divider--vertical': vertical }"
    :role="decorative ? 'presentation' : 'separator'"
    :aria-orientation="decorative ? undefined : vertical ? 'vertical' : 'horizontal'"
  />
</template>
