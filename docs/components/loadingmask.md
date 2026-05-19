# LoadingMask 加载遮罩

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
  <mc-button variant="green" @click="demo">显示 1.8 秒</mc-button>
  <ClientOnly>
    <mc-loading-mask :visible="show" text="生成世界中" />
  </ClientOnly>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
// 数据就绪后：loading.value = false
</script>

<template>
  <mc-loading-mask :visible="loading" text="生成世界中" />
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `visible` | `boolean` | `true` | 是否显示 |
| `text` | `string` | `'生成世界中'` | 加载文案 |

通过 `<Teleport to="body">` 全屏渲染，`visible=false` 时 0.8s 渐隐。
