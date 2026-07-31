<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed } from 'vue'
import { useSound } from '../../composables/useSound'

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
    <div v-if="$slots.title" class="mc-card__title"><slot name="title" /></div>
    <div v-if="$slots.default" class="mc-card__body"><slot /></div>
    <div v-if="$slots.actions" class="mc-card__actions"><slot name="actions" /></div>
  </component>
</template>
