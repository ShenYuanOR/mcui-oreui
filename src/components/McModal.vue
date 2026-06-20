<script setup lang="ts">
import { playSound } from '../composables/useSound';

const props = withDefaults(
  defineProps<{
    /** 是否打开（v-model:open） */
    open?: boolean;
    /** 标题 */
    title?: string;
    /** 点击遮罩是否关闭 */
    closeOnOverlay?: boolean;
    /** 是否显示右上角关闭按钮 */
    showClose?: boolean;
  }>(),
  { open: false, title: '', closeOnOverlay: true, showClose: true },
);

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
  (e: 'close'): void;
}>();

function close() {
  playSound('click');
  emit('update:open', false);
  emit('close');
}
function onOverlay() {
  if (props.closeOnOverlay) close();
}
</script>

<template>
  <Teleport to="body">
    <div v-show="open" class="normal_overlay"
      style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 12;" @click="onOverlay"></div>
    <modal_area v-show="open" class="normal_modal" style="display: block;" tabindex="-1">
      <modal>
        <modal_title_area>
          <modal_title>{{ title }}</modal_title>
          <modal_close_btn v-if="showClose" class="modal_close_btn"
            style="color:#fff;font-family:'Minecraft Seven',sans-serif;" @click="close">✕</modal_close_btn>
        </modal_title_area>
        <!-- <div style="padding: 16px 20px;"> -->
          <slot />
        <!-- </div> -->
      </modal>
    </modal_area>
  </Teleport>
</template>
