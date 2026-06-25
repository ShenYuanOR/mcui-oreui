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
        /** 自定义进度条颜色，设置后 status 颜色失效 */
        bgcolor?: string;
    }>(),
    { value: 0, max: 100, label: '', showValue: true, indeterminate: false, status: 'normal', bgcolor: '' },
);

const percent = computed(() => {
    if (props.indeterminate) return 100;
    const max = Number.isFinite(props.max) && props.max > 0 ? props.max : 100;
    const raw = (props.value / max) * 100;
    return Math.max(0, Math.min(raw, 100));
});

const percentText = computed(() => `${Math.round(percent.value)}%`);

function darken(hex: string, factor: number): string {
  const v = parseInt(hex.replace('#', ''), 16)
  const r = Math.round((v >> 16) * factor)
  const g = Math.round(((v >> 8) & 0xff) * factor)
  const b = Math.round((v & 0xff) * factor)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

const barStyle = computed(() => {
  if (!props.bgcolor) return {}
  const darker = darken(props.bgcolor, 0.7)
  return {
    backgroundColor: props.bgcolor,
    boxShadow: `inset 0 -4px ${darker}, inset 3px 3px rgba(255,255,255,0.3), inset -3px -6px rgba(255,255,255,0.12)`,
  }
})
</script>

<template>
    <div class="mc-progress" :class="[`mc-progress--${status}`, { 'mc-progress--indeterminate': indeterminate }]">
        <div v-if="label || showValue" class="mc-progress__header">
            <span class="mc-progress__label">{{ label }}</span>
            <span v-if="showValue" class="mc-progress__value">{{ indeterminate ? '...' : percentText }}</span>
        </div>
        <div class="mc-progress__track" role="progressbar" :aria-valuemin="0" :aria-valuemax="max"
            :aria-valuenow="indeterminate ? undefined : value" :aria-label="label || 'progress'">
            <div class="mc-progress__bar" :style="{ width: percent + '%', ...barStyle }"></div>
        </div>
    </div>
</template>
