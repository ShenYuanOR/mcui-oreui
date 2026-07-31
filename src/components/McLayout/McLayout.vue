<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { provide } from 'vue'
import { createMcLayout, mcLayoutKey } from '../../framework/layout'
const layout = createMcLayout()
provide(mcLayoutKey, layout)
defineExpose(layout)
</script>

<template>
  <div class="mc-layout"><slot :offsets="layout.offsets.value" /></div>
</template>
