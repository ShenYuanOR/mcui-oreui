<script setup lang="ts">
import '../../styles/component-core.css'
import { provide, watch } from 'vue'
import { createMcTheme, mcThemeKey, useMcTheme } from '../../framework/theme'
import type { McThemeDefinition } from '../../framework/types'

const props = withDefaults(defineProps<{ name?: string; theme?: McThemeDefinition; tag?: string }>(), { tag: 'div' })
const parent = useMcTheme()

function resolveName(name?: string) {
  return name || 'local'
}

function mergeTheme(value?: McThemeDefinition): McThemeDefinition {
  return {
    ...parent.current.value,
    ...value,
    colors: { ...parent.current.value.colors, ...value?.colors },
    variables: { ...parent.current.value.variables, ...value?.variables },
    fonts: { ...parent.current.value.fonts, ...value?.fonts },
  }
}

const theme = createMcTheme(
  {
    defaultTheme: resolveName(props.name),
    themes: {
      [resolveName(props.name)]: mergeTheme(props.theme),
    },
  },
  parent,
)
provide(mcThemeKey, theme)

watch(
  () => [props.name, props.theme] as const,
  ([name, value], previous) => {
    const localName = resolveName(name)
    const previousName = previous ? resolveName(previous[0]) : theme.name.value
    theme.themes.value[localName] = mergeTheme(value)
    if (previousName !== localName) {
      delete theme.themes.value[previousName]
      theme.name.value = localName
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
