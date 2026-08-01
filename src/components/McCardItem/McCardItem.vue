<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import McCardSubtitle from '../McCardSubtitle'
import McCardTitle from '../McCardTitle'

withDefaults(defineProps<{ tag?: string }>(), { tag: 'div' })
</script>

<template>
  <component :is="tag" class="mc-card-item">
    <div v-if="$slots.prepend" class="mc-card-item__prepend"><slot name="prepend" /></div>
    <div class="mc-card-item__content">
      <mc-card-title v-if="$slots.title"><slot name="title" /></mc-card-title>
      <mc-card-subtitle v-if="$slots.subtitle"><slot name="subtitle" /></mc-card-subtitle>
      <slot />
    </div>
    <div v-if="$slots.append" class="mc-card-item__append"><slot name="append" /></div>
  </component>
</template>
