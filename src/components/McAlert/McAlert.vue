<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { useMcLocale } from '../../framework/locale'
withDefaults(
  defineProps<{
    variant?: 'info' | 'success' | 'warning' | 'error'
    closable?: boolean
  }>(),
  { variant: 'info', closable: false },
)
const emit = defineEmits<{ (event: 'close'): void }>()
const locale = useMcLocale()
</script>

<template>
  <div class="mc-alert" :class="`mc-alert--${variant}`" :role="variant === 'error' ? 'alert' : 'status'">
    <div class="mc-alert__content">
      <strong v-if="$slots.title" class="mc-alert__title"><slot name="title" /></strong>
      <div v-if="$slots.default" class="mc-alert__text"><slot /></div>
    </div>
    <button
      v-if="closable"
      type="button"
      class="mc-alert__close"
      :aria-label="locale.t('close')"
      @click="emit('close')"
    >
      ×
    </button>
  </div>
</template>
