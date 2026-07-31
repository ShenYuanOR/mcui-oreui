<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, inject, onBeforeUnmount, ref, useId } from 'vue'
import { mcExpansionKey, type McExpansionValue } from '../_shared/expansionContext'
const props = withDefaults(defineProps<{ value?: McExpansionValue; title?: string; disabled?: boolean }>(), {
  value: '',
  disabled: false,
})
const context = inject(mcExpansionKey, null)
const generated = useId()
const header = ref<HTMLButtonElement | null>(null)
const value = computed<McExpansionValue>(() => props.value || generated)
const contentId = `${generated}-content`
const headerId = `${generated}-header`
const selected = computed(() => context?.isSelected(value.value) ?? false)
const unregister = context?.register(value.value, header, () => props.disabled)
onBeforeUnmount(() => unregister?.())
</script>

<template>
  <section
    class="mc-expansion-panel"
    :class="{ 'mc-expansion-panel--open': selected, 'mc-expansion-panel--disabled': disabled }"
  >
    <h3 class="mc-expansion-panel__heading">
      <button
        :id="headerId"
        ref="header"
        type="button"
        class="mc-expansion-panel__header"
        :disabled="disabled"
        :aria-expanded="selected"
        :aria-controls="contentId"
        @click="context?.toggle(value, disabled)"
        @keydown="context?.navigate(value, $event)"
      >
        <slot name="title">{{ title }}</slot
        ><span class="mc-expansion-panel__icon" aria-hidden="true">▾</span>
      </button>
    </h3>
    <div
      v-show="selected"
      :id="contentId"
      class="mc-expansion-panel__content"
      role="region"
      :aria-labelledby="headerId"
    >
      <slot />
    </div>
  </section>
</template>
