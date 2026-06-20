<script setup lang="ts">
import { computed } from 'vue';
import { playSound } from '../composables/useSound';

export type McTabValue = string | number;

export interface McButtonTabItem {
  label: string;
  value: McTabValue;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    /** 当前激活项 v-model */
    modelValue?: McTabValue;
    /** 标签项 */
    items?: McButtonTabItem[];
    /** 左上角标题 */
    title?: string;
  }>(),
  { modelValue: '', items: () => [], title: '' },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: McTabValue): void;
  (e: 'change', v: McTabValue): void;
}>();

const activeValue = computed(
  () => props.modelValue || props.items.find((item) => !item.disabled)?.value || '',
);

function select(item: McButtonTabItem) {
  if (item.disabled || item.value === activeValue.value) return;
  playSound('click');
  emit('update:modelValue', item.value);
  emit('change', item.value);
}
</script>

<template>
  <div class="mc-button-tabs">
    <div class="mc-button-tabs__header">
      <span v-if="title" class="mc-button-tabs__title">{{ title }}</span>
      <div class="mc-button-tabs__nav">
        <button
          v-for="item in items"
          :key="String(item.value)"
          class="mc-button-tabs__tab btn"
          :class="{
            'normal_btn': item.value !== activeValue,
            'mc-button-tabs__tab--active': item.value === activeValue,
          }"
          :disabled="item.disabled"
          type="button"
          @click="select(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
    <div class="mc-button-tabs__panel">
      <slot :active="activeValue" />
    </div>
  </div>
</template>
