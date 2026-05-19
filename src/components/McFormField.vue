<script setup lang="ts">
withDefaults(
    defineProps<{
        /** 标签文本 */
        label?: string;
        /** 辅助说明 */
        description?: string;
        /** 错误信息 */
        error?: string;
        /** 是否必填 */
        required?: boolean;
        /** 是否禁用展示 */
        disabled?: boolean;
    }>(),
    { label: '', description: '', error: '', required: false, disabled: false },
);
</script>

<template>
    <div class="mc-form-field" :class="{ 'mc-form-field--error': error, 'mc-form-field--disabled': disabled }">
        <label v-if="label || $slots.label" class="mc-form-field__label">
            <slot name="label">{{ label }}</slot>
            <span v-if="required" class="mc-form-field__required">*</span>
        </label>
        <div v-if="description || $slots.description" class="mc-form-field__description">
            <slot name="description">{{ description }}</slot>
        </div>
        <div class="mc-form-field__control">
            <slot />
        </div>
        <div v-if="error || $slots.error" class="mc-form-field__error">
            <slot name="error">{{ error }}</slot>
        </div>
    </div>
</template>
