<script setup lang="ts">
import { popState } from '../composables/usePop'
// 全局 Pop 容器：在应用根部放置一个 <McPopHost />，配合 showPop() 使用
</script>

<template>
  <Teleport to="body">
    <div class="pop_area">
      <div
        v-for="p in popState"
        :key="p.id"
        class="pop"
        :class="[p.styleClass, { show: p.show }]"
      >
        {{ p.message }}
      </div>
    </div>
  </Teleport>
</template>
