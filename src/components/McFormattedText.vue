<script setup lang="ts">
import { computed } from 'vue';
import type { McFormatCodeEdition } from '../utils/formatCodes';
import { renderMcFormatCodes } from '../utils/formatCodes';

const props = withDefaults(
    defineProps<{
        /** 带 Minecraft § 格式化代码的文本 */
        text: string;
        /** 格式化代码版本；Java 模式下 §m/§n 渲染为删除线/下划线，Bedrock 模式下渲染为材料色 */
        edition?: McFormatCodeEdition;
        /** 渲染标签 */
        as?: string;
    }>(),
    {
        edition: 'java',
        as: 'span',
    },
);

const segments = computed(() => renderMcFormatCodes(props.text, props.edition));

const segmentClass = (segment: { bold: boolean; italic: boolean; underline: boolean; strikethrough: boolean; obfuscated: boolean; }) => ({
    'mc-formatted-text__segment--bold': segment.bold,
    'mc-formatted-text__segment--italic': segment.italic,
    'mc-formatted-text__segment--underline': segment.underline,
    'mc-formatted-text__segment--strikethrough': segment.strikethrough,
    'mc-formatted-text__segment--obfuscated': segment.obfuscated,
});
</script>

<template>
    <component :is="as" class="mc-formatted-text">
        <span v-for="(segment, index) in segments" :key="index" class="mc-formatted-text__segment"
            :class="segmentClass(segment)" :style="segment.color ? { color: segment.color } : undefined">{{ segment.text
            }}</span>
    </component>
</template>
