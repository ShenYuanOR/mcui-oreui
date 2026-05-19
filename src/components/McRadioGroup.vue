<script setup lang="ts">
import McRadio, { type McRadioValue } from './McRadio.vue';

export interface McRadioOption {
    label: string;
    value: McRadioValue;
    disabled?: boolean;
}

const props = withDefaults(
    defineProps<{
        /** 当前选中值（v-model） */
        modelValue?: McRadioValue;
        /** 选项列表 */
        options?: McRadioOption[];
        /** 排列方向 */
        direction?: 'horizontal' | 'vertical';
        /** 整组禁用 */
        disabled?: boolean;
    }>(),
    { modelValue: '', options: () => [], direction: 'horizontal', disabled: false },
);

const emit = defineEmits<{
    (e: 'update:modelValue', v: McRadioValue): void;
    (e: 'change', v: McRadioValue): void;
}>();

function update(v: McRadioValue) {
    emit('update:modelValue', v);
    emit('change', v);
}
</script>

<template>
    <div class="mc-radio-group" :class="`mc-radio-group--${direction}`" role="radiogroup">
        <slot>
            <McRadio v-for="option in options" :key="String(option.value)" :model-value="props.modelValue"
                :value="option.value" :disabled="disabled || option.disabled" @update:model-value="update">
                {{ option.label }}
            </McRadio>
        </slot>
    </div>
</template>
