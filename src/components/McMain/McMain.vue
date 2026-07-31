<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'
import { useMcLayout } from '../../framework/layout'
const props = withDefaults(defineProps<{ tag?: string }>(), { tag: 'main' })
const layout = useMcLayout()
const style = computed(() => {
  const offsets = layout?.offsets.value ?? { top: 0, bottom: 0, start: 0, end: 0 }
  return {
    '--mc-layout-top': `${offsets.top}px`,
    '--mc-layout-bottom': `${offsets.bottom}px`,
    '--mc-layout-start': `${offsets.start}px`,
    '--mc-layout-end': `${offsets.end}px`,
  }
})
</script>

<template>
  <component :is="props.tag" class="mc-main" :style="style"
    ><div class="mc-main__content"><slot /></div
  ></component>
</template>
