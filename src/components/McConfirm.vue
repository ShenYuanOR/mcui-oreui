<script setup lang="ts">
import McButton from './McButton.vue';
import McModal from './McModal.vue';

const props = withDefaults(
    defineProps<{
        /** 是否打开（v-model:open） */
        open?: boolean;
        /** 标题 */
        title?: string;
        /** 确认按钮文本 */
        confirmText?: string;
        /** 取消按钮文本 */
        cancelText?: string;
        /** 危险确认样式 */
        danger?: boolean;
        /** 是否显示关闭按钮 */
        showClose?: boolean;
        /** 按钮是否垂直排列 */
        stackActions?: boolean;
    }>(),
    {
        open: false,
        title: '确认操作',
        confirmText: '确认',
        cancelText: '取消',
        danger: false,
        showClose: false,
        stackActions: false,
    },
);

const emit = defineEmits<{
    (e: 'update:open', v: boolean): void;
    (e: 'confirm'): void;
    (e: 'cancel'): void;
    (e: 'close'): void;
}>();

function updateOpen(v: boolean) {
    emit('update:open', v);
    if (!v) emit('close');
}

function cancel() {
    emit('cancel');
    updateOpen(false);
}

function confirm() {
    emit('confirm');
    updateOpen(false);
}
</script>

<template>
    <McModal :open="props.open" :title="title" :close-on-overlay="false" :show-close="showClose" @update:open="updateOpen">
        <div class="mc-confirm">
            <div class="mc-confirm__content">
                <slot />
            </div>
            <div class="mc-confirm__actions" :class="{ 'mc-confirm__actions--stack': stackActions }">
                <McButton variant="normal" @click="cancel">{{ cancelText }}</McButton>
                <McButton :variant="danger ? 'error' : 'primary'" @click="confirm">{{ confirmText }}</McButton>
            </div>
        </div>
    </McModal>
</template>
