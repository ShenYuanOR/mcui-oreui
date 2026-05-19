<script setup lang="ts">
import { playSound } from '../composables/useSound'

withDefaults(
  defineProps<{
    /** 卡片标题 */
    title?: string
    /** 卡片描述（也可用默认插槽替代） */
    description?: string
  }>(),
  { title: '', description: '' },
)

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

function onClick(ev: MouseEvent) {
  playSound('click')
  emit('click', ev)
}
</script>

<template>
  <link-block @click="onClick">
    <div v-if="title || $slots.title" class="link_title">
      <span class="link_title_text"><slot name="title">{{ title }}</slot></span>
    </div>
    <div class="link_description">
      <slot>{{ description }}</slot>
    </div>
  </link-block>
</template>
