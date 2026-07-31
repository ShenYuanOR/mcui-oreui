<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, useAttrs } from 'vue'
import { useMcLocale } from '../../framework/locale'
import { useMcTheme } from '../../framework/theme'
import loadingGif from '../../assets/images/Loading_white.gif'
const props = withDefaults(defineProps<{ modelValue?: boolean; text?: string; teleport?: string | false }>(), {
  modelValue: true,
  teleport: 'body',
})
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const locale = useMcLocale()
const theme = useMcTheme()
const accessibleLabel = computed(() =>
  typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : props.text || locale.t('loading'),
)
</script>

<template>
  <Teleport v-if="modelValue" :to="teleport || 'body'" :disabled="teleport === false">
    <div
      v-bind="attrs"
      class="mc-loading-mask"
      :class="theme.classes.value"
      :style="theme.styles.value"
      :dir="locale.dir.value"
      role="status"
      aria-live="polite"
      :aria-label="accessibleLabel"
    >
      <img class="mc-loading-mask__spinner" :src="loadingGif" alt="" /><span class="mc-loading-mask__text">{{
        text || locale.t('loading')
      }}</span>
    </div>
  </Teleport>
</template>
