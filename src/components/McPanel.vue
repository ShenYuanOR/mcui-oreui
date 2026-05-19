<script setup lang="ts">
withDefaults(
    defineProps<{
        /** 面板标题 */
        title?: string;
        /** 副标题 */
        subtitle?: string;
        /** 是否显示描边 */
        bordered?: boolean;
        /** 是否显示立体阴影 */
        elevated?: boolean;
    }>(),
    { title: '', subtitle: '', bordered: true, elevated: true },
);
</script>

<template>
    <section class="mc-panel" :class="{ 'mc-panel--bordered': bordered, 'mc-panel--elevated': elevated }">
        <div v-if="$slots.header || title || subtitle || $slots.actions" class="mc-panel__header">
            <slot name="header">
                <div class="mc-panel__title-area">
                    <div v-if="title" class="mc-panel__title">{{ title }}</div>
                    <div v-if="subtitle" class="mc-panel__subtitle">{{ subtitle }}</div>
                </div>
            </slot>
            <div v-if="$slots.actions" class="mc-panel__actions">
                <slot name="actions" />
            </div>
        </div>
        <div class="mc-panel__body">
            <slot />
        </div>
        <footer v-if="$slots.footer" class="mc-panel__footer">
            <slot name="footer" />
        </footer>
    </section>
</template>
