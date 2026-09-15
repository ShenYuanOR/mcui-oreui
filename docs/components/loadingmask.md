# LoadingMask 加载遮罩

## 基础用法

全屏 “生成世界中” 加载遮罩，带渐隐过渡。

<script setup>
import { ref } from 'vue'
const show = ref(false)
function demo() {
  show.value = true
  setTimeout(() => (show.value = false), 1800)
}
</script>

<div class="mc-demo">
  <mc-button variant="primary" @click="demo">显示 1.8 秒</mc-button>
  <ClientOnly>
    <mc-loading-mask v-model="show" text="生成世界中" />
  </ClientOnly>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
function demo() {
  show.value = true
  setTimeout(() => (show.value = false), 1800)
}
</script>

<template>
  <div class="mc-demo">
    <mc-button variant="primary" @click="demo">显示 1.8 秒</mc-button>
    <ClientOnly>
      <mc-loading-mask v-model="show" text="生成世界中" />
    </ClientOnly>
  </div>
</template>
```

## API

### Props

| 名称         | 类型      | 默认           | 说明     |
| ------------ | --------- | -------------- | -------- |
| `modelValue` | `boolean` | `true`         | 是否显示 |
| `text`       | `string`  | `'生成世界中'` | 加载文案 |

通过 `<Teleport to="body">` 全屏渲染；受控状态与其他显隐组件统一使用 `v-model`。
