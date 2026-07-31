<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { onBeforeUnmount, useAttrs, watch } from 'vue'
import { useMcLocale } from '../../framework/locale'
import { useMcTheme } from '../../framework/theme'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    timeout?: number
    location?: 'top' | 'bottom'
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
    teleport?: string | false
  }>(),
  { modelValue: false, timeout: 4000, location: 'bottom', variant: 'default', teleport: 'body' },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
}>()
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const theme = useMcTheme()
const locale = useMcLocale()
let timer: ReturnType<typeof setTimeout> | undefined
function close() {
  emit('update:modelValue', false)
  emit('close')
}
watch(
  () => props.modelValue,
  (value) => {
    if (timer) clearTimeout(timer)
    if (value && props.timeout > 0) timer = setTimeout(close, props.timeout)
  },
  { immediate: true },
)
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Teleport :to="teleport || 'body'" :disabled="teleport === false">
    <Transition name="mc-snackbar-transition">
      <div
        v-if="modelValue"
        v-bind="attrs"
        class="mc-snackbar"
        :class="[theme.classes.value, `mc-snackbar--${location}`, `mc-snackbar--${variant}`]"
        :style="theme.styles.value"
        :dir="locale.dir.value"
        role="status"
        aria-live="polite"
      >
        <div class="mc-snackbar__message"><slot /></div>
        <button v-if="$slots.action" type="button" class="mc-snackbar__action" @click="close">
          <slot name="action" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
