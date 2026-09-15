<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { useMcLocale } from '../../framework/locale'
import McButton from '../McButton'
import McDialog from '../McDialog'
const props = withDefaults(
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
let suppressCancel = false
function update(value: boolean) {
  if (!value && props.modelValue && !suppressCancel) emit('cancel')
  suppressCancel = false
  emit('update:modelValue', value)
}
function cancel() {
  suppressCancel = true
  emit('cancel')
  emit('update:modelValue', false)
}
function confirm() {
  suppressCancel = true
  emit('confirm')
  emit('update:modelValue', false)
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
