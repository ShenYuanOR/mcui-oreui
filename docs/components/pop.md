# Pop 提示

底部冒出的短暂消息条（移植自原 `showPop`）。通过组合式函数 `showPop` 触发，
需在应用根部放置一个 `<mc-pop-host />`。

<div class="mc-demo">
  <ClientOnly>
    <mc-pop-host />
    <mc-button variant="primary" @click="$o.showPop('已保存世界', 2000, 'success')">成功</mc-button>
    <mc-button variant="normal" @click="$o.showPop('正在生成…', 2000, 'process')">进行中</mc-button>
    <mc-button variant="error" @click="$o.showPop('保存失败', 2000, 'error')">错误</mc-button>
  </ClientOnly>
</div>

<script setup>
import { showPop } from '../../src/composables/usePop'
const $o = { showPop }
</script>

```vue
<script setup lang="ts">
import { McPopHost, McButton, showPop } from 'mcui-oreui'
</script>

<template>
  <mc-pop-host />
  <mc-button @click="showPop('已保存', 2000, 'success')">保存</mc-button>
</template>
```

## showPop(message, duration?, styleClass?)

| 参数 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `message` | `string` | — | 文本 |
| `duration` | `number` | `3000` | 显示毫秒数 |
| `styleClass` | `string` | — | `success` / `process` / `error` / `vip` / `debug_text` |

最多同时显示 5 条，自动播放 `toast` 音效。`<mc-pop-host />` 全局放置一次即可。
