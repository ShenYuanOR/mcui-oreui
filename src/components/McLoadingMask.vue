<script setup lang="ts">
import loadingGif from '../assets/images/Loading_white.gif'

withDefaults(
  defineProps<{
    /** 是否显示遮罩 */
    visible?: boolean
    /** 加载文案 */
    text?: string
  }>(),
  { visible: true, text: '生成世界中' },
)
</script>

<template>
  <Teleport to="body">
    <div
      class="loading_mask"
      :style="{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        visibility: visible ? 'visible' : 'hidden',
      }"
    >
      <div>
        <div class="spinner"><img id="spinner_img" :src="loadingGif" alt="" /></div>
        <div class="spinner">
          <div class="spinner"><span class="spinner_text">{{ text }}</span></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
