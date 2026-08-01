<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'

defineProps<{
  /** 面板标题，作为 header 插槽的简写 */
  title?: string
  /** 面板副标题，作为 header 插槽的简写 */
  subtitle?: string
}>()
</script>

<template>
  <section class="mc-panel">
    <header v-if="$slots.header || title || subtitle || $slots.actions" class="mc-panel__header">
      <slot name="header">
        <div class="mc-panel__title-area">
          <div v-if="title" class="mc-panel__title">{{ title }}</div>
          <div v-if="subtitle" class="mc-panel__subtitle">{{ subtitle }}</div>
        </div>
      </slot>
      <div v-if="$slots.actions" class="mc-panel__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="mc-panel__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="mc-panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
