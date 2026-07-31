<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, useAttrs } from 'vue'
import { useMcLocale } from '../../framework/locale'
defineOptions({ inheritAttrs: false })
withDefaults(defineProps<{ width?: string | number; height?: string | number }>(), {
  width: '100%',
  height: 20,
})
const attrs = useAttrs()
const locale = useMcLocale()
const accessibleLabel = computed(() =>
  typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : locale.t('loading'),
)
const cssSize = (value: string | number) => (typeof value === 'number' ? `${value}px` : value)
</script>

<template>
  <div
    v-bind="attrs"
    class="mc-skeleton"
    :style="{ width: cssSize(width), height: cssSize(height) }"
    role="status"
    :aria-label="accessibleLabel"
  >
    <span class="mc-visually-hidden">{{ accessibleLabel }}</span>
  </div>
</template>
