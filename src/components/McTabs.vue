<script setup lang="ts">
import { computed } from 'vue';
import { playSound } from '../composables/useSound';

export type McTabValue = string | number;

export interface McTabItem {
    label: string;
    value: McTabValue;
    disabled?: boolean;
}

const props = withDefaults(
    defineProps<{
        /** 当前激活项（v-model） */
        modelValue?: McTabValue;
        /** 标签项 */
        items?: McTabItem[];
        /** 排列方向 */
        direction?: 'horizontal' | 'vertical';
    }>(),
    { modelValue: '', items: () => [], direction: 'horizontal' },
);

const emit = defineEmits<{
    (e: 'update:modelValue', v: McTabValue): void;
    (e: 'change', v: McTabValue): void;
}>();

const activeValue = computed(() => props.modelValue || props.items.find((item) => !item.disabled)?.value || '');

function select(item: McTabItem) {
    if (item.disabled || item.value === activeValue.value) return;
    playSound('click');
    emit('update:modelValue', item.value);
    emit('change', item.value);
}
</script>

<template>
    <div class="mc-tabs" :class="`mc-tabs--${direction}`">
        <div class="mc-tabs__nav" role="tablist" :aria-orientation="direction">
            <button v-for="item in items" :key="String(item.value)" class="mc-tabs__tab"
                :class="{ 'mc-tabs__tab--active': item.value === activeValue, 'mc-tabs__tab--disabled': item.disabled }"
                type="button" role="tab" :aria-selected="item.value === activeValue" :disabled="item.disabled"
                @click="select(item)">
                {{ item.label }}
            </button>
        </div>
        <div class="mc-tabs__panel" role="tabpanel">
            <slot :active="activeValue" />
        </div>
    </div>
</template>
