<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
withDefaults(defineProps<{ caption?: string; hover?: boolean; striped?: boolean }>(), { hover: false, striped: false })
</script>
<template>
  <div class="mc-table-wrapper">
    <table class="mc-table" :class="{ 'mc-table--hover': hover, 'mc-table--striped': striped }">
      <caption v-if="caption || $slots.caption">
        <slot name="caption">{{ caption }}</slot>
      </caption>
      <thead v-if="$slots.header">
        <slot name="header" />
      </thead>
      <tbody>
        <slot name="body"><slot /></slot>
      </tbody>
      <tfoot v-if="$slots.footer">
        <slot name="footer" />
      </tfoot>
    </table>
  </div>
</template>
