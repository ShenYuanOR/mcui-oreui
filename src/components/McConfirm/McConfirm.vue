<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { useMcLocale } from '../../framework/locale'
import McButton from '../McButton'
import McDialog from '../McDialog'
withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
    showClose?: boolean
    stackActions?: boolean
    teleport?: string | HTMLElement | false
  }>(),
  { modelValue: false, danger: false, showClose: false, stackActions: false, teleport: 'body' },
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm'): void
  (event: 'cancel'): void
  (event: 'close'): void
}>()
const locale = useMcLocale()
function update(value: boolean) {
  emit('update:modelValue', value)
}
function cancel() {
  emit('cancel')
  update(false)
}
function confirm() {
  emit('confirm')
  update(false)
}
</script>

<template>
  <mc-dialog
    class="mc-confirm"
    :class="{ 'mc-confirm--stack-actions': stackActions }"
    :model-value="modelValue"
    :title="title || locale.t('confirm')"
    :teleport="teleport"
    :close-on-overlay="false"
    :show-close="showClose"
    @update:model-value="update"
    @close="emit('close')"
  >
    <slot />
    <template #actions>
      <div class="mc-confirm__actions">
        <mc-button class="mc-confirm__action" variant="normal" @click="cancel">{{
          cancelText || locale.t('cancel')
        }}</mc-button>
        <mc-button class="mc-confirm__action" :variant="danger ? 'error' : 'primary'" @click="confirm">{{
          confirmText || locale.t('confirm')
        }}</mc-button>
      </div>
    </template>
  </mc-dialog>
</template>
