# Modal 弹窗

居中弹窗，带灰色立体标题栏与关闭按钮，遮罩点击可关闭。

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<div class="mc-demo">
  <mc-button variant="green" @click="open = true">打开弹窗</mc-button>
  <ClientOnly>
    <mc-modal v-model:open="open" title="提示">
      <p style="color:#fff;font-family:'NotoSans Bold',sans-serif">
        这是一个 McUI 风格弹窗，点击遮罩或右上角 ✕ 关闭。
      </p>
      <mc-button variant="green" @click="open = false">知道了</mc-button>
    </mc-modal>
  </ClientOnly>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <mc-button @click="open = true">打开</mc-button>
  <mc-modal v-model:open="open" title="提示">
    弹窗内容
  </mc-modal>
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `open` | `boolean` | `false` | 是否打开（`v-model:open`） |
| `title` | `string` | `''` | 标题 |
| `closeOnOverlay` | `boolean` | `true` | 点击遮罩关闭 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:open` | `boolean` | v-model 更新 |
| `close` | — | 关闭时触发（含 `click` 音效） |

弹窗通过 `<Teleport to="body">` 渲染，内容用默认插槽传入。
