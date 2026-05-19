<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type { McFormatCodeEdition } from '../utils/formatCodes';
import McFormattedText from './McFormattedText.vue';

const props = withDefaults(
    defineProps<{
        /** 直接传入带 Minecraft § 格式化代码的文本；未传时读取默认插槽文本 */
        text?: string;
        /** 格式化代码版本；默认按 Java 样式解析 §m/§n */
        edition?: McFormatCodeEdition;
        /** 渲染标签 */
        as?: string;
    }>(),
    {
        text: undefined,
        edition: 'java',
        as: 'span',
    },
);

const slots = useSlots();

function slotToText(nodes: ReturnType<NonNullable<typeof slots.default>> = []): string {
    return nodes.map((node) => {
        if (typeof node.children === 'string') {
            return node.children;
        }

        if (Array.isArray(node.children)) {
            return slotToText(node.children as ReturnType<NonNullable<typeof slots.default>>);
        }

        return '';
    }).join('');
}

const content = computed(() => props.text ?? slotToText(slots.default?.()));
</script>

<template>
    <McFormattedText :text="content" :edition="edition" :as="as" />
</template>
