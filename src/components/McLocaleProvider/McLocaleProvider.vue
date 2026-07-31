<script setup lang="ts">
import '../../styles/component-core.css'
import { provide, watch } from 'vue'
import { createMcLocale, mcLocaleKey, useMcLocale } from '../../framework/locale'
import type { McLocaleOptions } from '../../framework/types'

const props = withDefaults(
  defineProps<{
    locale?: string
    fallback?: string
    messages?: McLocaleOptions['messages']
    rtl?: McLocaleOptions['rtl']
    tag?: string
  }>(),
  { tag: 'div' },
)
const parent = useMcLocale()
const value = createMcLocale(
  {
    locale: props.locale || parent.locale.value,
    fallback: props.fallback || parent.fallback,
    messages: props.messages,
    rtl: props.rtl,
  },
  parent,
)
provide(mcLocaleKey, value)
watch(
  () => props.locale,
  (locale) => {
    value.setLocale(locale || parent.locale.value)
  },
)
watch(
  () => props.messages,
  (messages) => {
    if (messages) Object.assign(value.messages, messages)
  },
  { deep: true },
)
</script>

<template>
  <component :is="tag" class="mc-locale-provider" :dir="value.dir.value" :lang="value.locale.value"><slot /></component>
</template>
