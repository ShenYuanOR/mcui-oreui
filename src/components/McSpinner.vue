<script setup lang="ts">
import { computed } from 'vue'
import loadingGifWhite from '../assets/images/Loading_white.gif'
import loadingGifDark from '../assets/images/Loading.gif'

type Color = 'white' | 'dark'

const props = withDefaults(
  defineProps<{
    /** 圆形加载指示器尺寸（px） */
    size?: number
    /** GIF 颜色：white 白色（深色背景）/ dark 深色（浅色背景） */
    color?: Color
  }>(),
  { size: 48, color: 'white' },
)

const loadingGif = computed(() => props.color === 'dark' ? loadingGifDark : loadingGifWhite)
</script>

<template>
  <div
    class="mc-spinner"
    :style="{ width: size + 'px', height: size + 'px' }"
    role="progressbar"
    aria-label="加载中"
  >
    <img
      class="mc-spinner__icon"
      :src="loadingGif"
      :style="{ width: size + 'px', height: size + 'px' }"
      alt=""
    />
  </div>
</template>
