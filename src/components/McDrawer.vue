<script setup lang="ts">
import { computed } from 'vue';
import { playSound } from '../composables/useSound';

type Placement = 'left' | 'right' | 'top' | 'bottom';

const props = withDefaults(
    defineProps<{
        /** 是否打开（v-model:open） */
        open?: boolean;
        /** 标题 */
        title?: string;
        /** 出现位置 */
        placement?: Placement;
        /** 点击遮罩是否关闭 */
        closeOnOverlay?: boolean;
        /** Teleport 目标选择器，传 false 则在父容器内就地渲染 */
        teleport?: string | boolean;
    }>(),
    { open: false, title: '', placement: 'right', closeOnOverlay: true, teleport: 'body' },
);

const teleportTo = computed(() => (props.teleport === false ? undefined : (props.teleport as string)));

const emit = defineEmits<{
    (e: 'update:open', v: boolean): void;
    (e: 'close'): void;
}>();

function close() {
    playSound('close');
    emit('update:open', false);
    emit('close');
}

function onOverlay() {
    if (props.closeOnOverlay) close();
}
</script>

<template>
    <Teleport v-if="teleportTo" :to="teleportTo">
        <div v-show="open" class="mc-drawer-overlay" @click="onOverlay"></div>
        <aside v-show="open" class="mc-drawer" :class="[`mc-drawer--${placement}`, { 'mc-drawer--open': open }]">
            <header v-if="title || $slots.header" class="mc-drawer__header">
                <slot name="header">
                    <div class="mc-drawer__title">{{ title }}</div>
                </slot>
                <button class="mc-drawer__close" type="button" aria-label="关闭" @click="close">✕</button>
            </header>
            <div class="mc-drawer__body">
                <slot />
            </div>
            <footer v-if="$slots.footer" class="mc-drawer__footer">
                <slot name="footer" />
            </footer>
        </aside>
    </Teleport>
    <template v-else>
        <div v-show="open" class="mc-drawer-overlay mc-drawer-overlay--inline" @click="onOverlay"></div>
        <aside v-show="open" class="mc-drawer mc-drawer--inline" :class="[`mc-drawer--${placement}`, { 'mc-drawer--open': open }]">
            <header v-if="title || $slots.header" class="mc-drawer__header">
                <slot name="header">
                    <div class="mc-drawer__title">{{ title }}</div>
                </slot>
                <button class="mc-drawer__close" type="button" aria-label="关闭" @click="close">✕</button>
            </header>
            <div class="mc-drawer__body">
                <slot />
            </div>
            <footer v-if="$slots.footer" class="mc-drawer__footer">
                <slot name="footer" />
            </footer>
        </aside>
    </template>
</template>
