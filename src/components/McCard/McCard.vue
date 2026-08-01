<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'
import { useSound } from '../../composables/useSound'
import McCardActions from '../McCardActions'
import McCardItem from '../McCardItem'
import McCardText from '../McCardText'

const { playSound } = useSound()

const props = withDefaults(
  defineProps<{
    href?: string
    to?: string
    disabled?: boolean
    clickable?: boolean
    tag?: string
  }>(),
  { disabled: false, clickable: false },
)
const emit = defineEmits<{ (event: 'click', value: MouseEvent): void }>()
const component = computed(() => (props.href || props.to ? 'a' : props.clickable ? 'button' : props.tag || 'article'))
function click(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  if (props.href || props.to || props.clickable) playSound('click')
  emit('click', event)
}
</script>

<template>
  <component
    :is="component"
    class="mc-card"
    :class="{ 'mc-card--interactive': href || to || clickable, 'mc-card--disabled': disabled }"
    :href="disabled ? undefined : href || to || undefined"
    :type="clickable ? 'button' : undefined"
    :disabled="clickable ? disabled : undefined"
    :aria-disabled="(!clickable && disabled) || undefined"
    @click="click"
  >
    <mc-card-item v-if="$slots.item || $slots.prepend || $slots.title || $slots.subtitle || $slots.append">
      <template v-if="$slots.prepend" #prepend><slot name="prepend" /></template>
      <template v-if="$slots.title" #title><slot name="title" /></template>
      <template v-if="$slots.subtitle" #subtitle><slot name="subtitle" /></template>
      <template v-if="$slots.append" #append><slot name="append" /></template>
      <slot name="item" />
    </mc-card-item>
    <mc-card-text v-if="$slots.text"><slot name="text" /></mc-card-text>
    <slot />
    <mc-card-actions v-if="$slots.actions"><slot name="actions" /></mc-card-actions>
  </component>
</template>
