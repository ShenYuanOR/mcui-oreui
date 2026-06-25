<script setup lang="ts">
import { computed, ref } from 'vue';
import { playSound } from '../composables/useSound';

export type McRadioValue = string | number | boolean;

const props = withDefaults(
    defineProps<{
        /** 当前选中值（v-model） */
        modelValue?: McRadioValue;
        /** 当前单选项的值 */
        value?: McRadioValue;
        /** 是否禁用 */
        disabled?: boolean;
        /** 旋转 45 度显示 */
        rotate?: boolean;
        /** 选中时的自定义背景色，设置后覆盖默认绿色 */
        bgcolor?: string;
    }>(),
    { modelValue: '', value: '', disabled: false, rotate: false, bgcolor: '' },
);

const emit = defineEmits<{
    (e: 'update:modelValue', v: McRadioValue): void;
    (e: 'change', v: McRadioValue): void;
}>();

const checked = computed(() => props.modelValue === props.value);

const isHovered = ref(false);

const controlCustomStyle = computed(() => {
    if (!props.bgcolor || !checked.value) return {};
    return { backgroundColor: isHovered.value ? darken(props.bgcolor, 0.85) : props.bgcolor };
});

function darken(hex: string, factor: number): string {
    const v = parseInt(hex.replace('#', ''), 16);
    const r = Math.round((v >> 16) * factor);
    const g = Math.round(((v >> 8) & 0xff) * factor);
    const b = Math.round((v & 0xff) * factor);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function select() {
    if (props.disabled || checked.value) return;
    playSound('click');
    emit('update:modelValue', props.value);
    emit('change', props.value);
}
</script>

<template>
    <label class="mc-radio" :class="{ 'mc-radio--checked': checked, 'mc-radio--disabled': disabled, 'mc-radio--rotate': rotate }">
        <span class="mc-radio__control" role="radio" :aria-checked="checked" :aria-disabled="disabled"
            :tabindex="disabled ? -1 : 0" :style="controlCustomStyle"
            @click="select" @keydown.enter.prevent="select"
            @keydown.space.prevent="select"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false">
            <span class="mc-radio__dot"></span>
        </span>
        <span v-if="$slots.default" class="mc-radio__label" @click="select">
            <slot />
        </span>
    </label>
</template>
