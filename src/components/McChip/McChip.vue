<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, getCurrentInstance } from 'vue'
import { useMcRoutedAttrs } from '../../utils/attrs'
defineOptions({ inheritAttrs: false })
withDefaults(
  defineProps<{
    closable?: boolean
    disabled?: boolean
    selected?: boolean
    color?: string
  }>(),
  { closable: false, disabled: false, selected: false },
)
const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
  (event: 'close'): void
}>()
const { rootAttrs, controlAttrs } = useMcRoutedAttrs()
const instance = getCurrentInstance()
const clickable = computed(() => Boolean(instance?.vnode.props?.onClick))
</script>

<template>
  <span
    v-bind="rootAttrs"
    class="mc-chip"
    :class="{ 'mc-chip--selected': selected, 'mc-chip--disabled': disabled }"
    :style="color ? { '--mc-chip-color': color } : undefined"
  >
    <button
      v-if="clickable"
      v-bind="controlAttrs"
      type="button"
      class="mc-chip__button"
      :disabled="disabled"
      @click="emit('click', $event)"
    >
      <slot />
    </button>
    <span v-else class="mc-chip__text"><slot /></span>
    <button
      v-if="closable"
      type="button"
      class="mc-chip__close"
      :disabled="disabled"
      aria-label="Remove"
      @click="emit('close')"
    >
      ×
    </button>
  </span>
</template>
