<script setup lang="ts">
type Placement = 'top' | 'bottom' | 'left' | 'right';

withDefaults(
    defineProps<{
        /** 提示内容 */
        content?: string;
        /** 显示位置 */
        placement?: Placement;
        /** 是否禁用提示 */
        disabled?: boolean;
        /** 显示延迟（毫秒） */
        delay?: number;
    }>(),
    { content: '', placement: 'top', disabled: false, delay: 0 },
);
</script>

<template>
    <span class="mc-tooltip" :class="[`mc-tooltip--${placement}`, { 'mc-tooltip--disabled': disabled }]"
        :style="{ '--mc-tooltip-delay': `${delay}ms` }">
        <span class="mc-tooltip__trigger">
            <slot />
        </span>
        <span v-if="!disabled && ($slots.content || content)" class="mc-tooltip__content" role="tooltip">
            <slot name="content">{{ content }}</slot>
        </span>
    </span>
</template>
