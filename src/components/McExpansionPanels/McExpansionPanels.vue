<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { provide, shallowReactive } from 'vue'
import { mcExpansionKey, type McExpansionValue } from '../_shared/expansionContext'
const props = withDefaults(
  defineProps<{ modelValue?: McExpansionValue | McExpansionValue[] | null; multiple?: boolean }>(),
  { modelValue: null, multiple: false },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: McExpansionValue | McExpansionValue[] | null): void
  (event: 'change', value: McExpansionValue | McExpansionValue[] | null): void
}>()
const panels = shallowReactive<
  Array<{ value: McExpansionValue; header: { value: HTMLButtonElement | null }; disabled: () => boolean }>
>([])
const isSelected = (value: McExpansionValue) =>
  Array.isArray(props.modelValue) ? props.modelValue.includes(value) : Object.is(props.modelValue, value)
function toggle(value: McExpansionValue, disabled: boolean) {
  if (disabled) return
  let next: McExpansionValue | McExpansionValue[] | null
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? props.modelValue : []
    next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
  } else next = isSelected(value) ? null : value
  emit('update:modelValue', next)
  emit('change', next)
}
function register(value: McExpansionValue, header: { value: HTMLButtonElement | null }, disabled: () => boolean) {
  const item = { value, header, disabled }
  panels.push(item)
  return () => {
    const index = panels.indexOf(item)
    if (index >= 0) panels.splice(index, 1)
  }
}
function navigate(value: McExpansionValue, event: KeyboardEvent) {
  const enabled = panels.filter((panel) => !panel.disabled())
  const current = enabled.findIndex((panel) => panel.value === value)
  let index = current
  if (event.key === 'ArrowDown') index += 1
  else if (event.key === 'ArrowUp') index -= 1
  else if (event.key === 'Home') index = 0
  else if (event.key === 'End') index = enabled.length - 1
  else return
  event.preventDefault()
  enabled[(index + enabled.length) % enabled.length]?.header.value?.focus()
}
provide(mcExpansionKey, { isSelected, toggle, register, navigate })
</script>
<template>
  <div class="mc-expansion-panels"><slot /></div>
</template>
