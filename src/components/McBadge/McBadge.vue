<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { useMcRoutedAttrs } from '../../utils/attrs'
defineOptions({ inheritAttrs: false })
withDefaults(
  defineProps<{
    content?: string | number
    color?: string
    dot?: boolean
    inline?: boolean
  }>(),
  { dot: false, inline: false },
)
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
</script>

<template>
  <span v-bind="rootAttrs" class="mc-badge" :class="{ 'mc-badge--inline': inline }">
    <slot />
    <span
      v-bind="controlAttrs"
      class="mc-badge__content"
      :class="{ 'mc-badge__content--dot': dot }"
      :style="color ? { backgroundColor: color } : undefined"
      :aria-label="controlAttrs['aria-label'] || (dot || content == null ? undefined : String(content))"
      :aria-hidden="(!controlAttrs['aria-label'] && dot) || undefined"
    >
      <slot name="badge">{{ dot ? '' : (content ?? '') }}</slot>
    </span>
  </span>
</template>
