<script setup lang="ts">
import '../../styles/component-core.css'
import { provide, watch } from 'vue'
import { createMcTheme, mcThemeKey, useMcTheme } from '../../framework/theme'
import type { McThemeDefinition } from '../../framework/types'

const props = withDefaults(defineProps<{ name?: string; theme?: McThemeDefinition; tag?: string }>(), { tag: 'div' })
const parent = useMcTheme()
const localName = props.name || 'local'
const theme = createMcTheme(
  {
    defaultTheme: localName,
    themes: {
      [localName]: {
        ...parent.current.value,
        ...props.theme,
        colors: { ...parent.current.value.colors, ...props.theme?.colors },
        variables: { ...parent.current.value.variables, ...props.theme?.variables },
        fonts: { ...parent.current.value.fonts, ...props.theme?.fonts },
      },
    },
  },
  parent,
)
provide(mcThemeKey, theme)
watch(
  () => props.theme,
  (value) => {
    theme.themes.value[localName] = {
      ...parent.current.value,
      ...value,
      colors: { ...parent.current.value.colors, ...value?.colors },
      variables: { ...parent.current.value.variables, ...value?.variables },
      fonts: { ...parent.current.value.fonts, ...value?.fonts },
    }
  },
  { deep: true },
)
</script>

<template>
  <component :is="tag" class="mc-theme-provider" :class="theme.classes.value" :style="theme.styles.value"
    ><slot
  /></component>
</template>
