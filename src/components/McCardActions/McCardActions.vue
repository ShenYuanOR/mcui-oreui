<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'

withDefaults(defineProps<{ tag?: string }>(), { tag: 'div' })
</script>

<template>
  <component :is="tag" class="mc-card-actions"><slot /></component>
</template>
