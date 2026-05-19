<script setup lang="ts">
import { computed } from 'vue';

type Status = 'normal' | 'success' | 'error';

const props = withDefaults(
    defineProps<{
        /** 当前进度值 */
        value?: number;
        /** 最大值 */
        max?: number;
        /** 左侧说明文本 */
        label?: string;
        /** 是否显示百分比 */
        showValue?: boolean;
        /** 不确定进度 */
        indeterminate?: boolean;
        /** 语义状态 */
        status?: Status;
    }>(),
    { value: 0, max: 100, label: '', showValue: true, indeterminate: false, status: 'normal' },
);

const percent = computed(() => {
    if (props.indeterminate) return 100;
    const max = Number.isFinite(props.max) && props.max > 0 ? props.max : 100;
    const raw = (props.value / max) * 100;
    return Math.max(0, Math.min(raw, 100));
});

const percentText = computed(() => `${Math.round(percent.value)}%`);
</script>

<template>
    <div class="mc-progress" :class="[`mc-progress--${status}`, { 'mc-progress--indeterminate': indeterminate }]">
        <div v-if="label || showValue" class="mc-progress__header">
            <span class="mc-progress__label">{{ label }}</span>
            <span v-if="showValue" class="mc-progress__value">{{ indeterminate ? '...' : percentText }}</span>
        </div>
        <div class="mc-progress__track" role="progressbar" :aria-valuemin="0" :aria-valuemax="max"
            :aria-valuenow="indeterminate ? undefined : value" :aria-label="label || 'progress'">
            <div class="mc-progress__bar" :style="{ width: percent + '%' }"></div>
        </div>
    </div>
</template>
