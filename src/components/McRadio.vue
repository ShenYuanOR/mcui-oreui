<script setup lang="ts">
import { computed } from 'vue';
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
    }>(),
    { modelValue: '', value: '', disabled: false },
);

const emit = defineEmits<{
    (e: 'update:modelValue', v: McRadioValue): void;
    (e: 'change', v: McRadioValue): void;
}>();

const checked = computed(() => props.modelValue === props.value);

function select() {
    if (props.disabled || checked.value) return;
    playSound('click');
    emit('update:modelValue', props.value);
    emit('change', props.value);
}
</script>

<template>
    <label class="mc-radio" :class="{ 'mc-radio--checked': checked, 'mc-radio--disabled': disabled }">
        <span class="mc-radio__control" role="radio" :aria-checked="checked" :aria-disabled="disabled"
            :tabindex="disabled ? -1 : 0" @click="select" @keydown.enter.prevent="select"
            @keydown.space.prevent="select">
            <span class="mc-radio__dot"></span>
        </span>
        <span v-if="$slots.default" class="mc-radio__label" @click="select">
            <slot />
        </span>
    </label>
</template>
