# Pop 提示

## 基础用法

底部冒出的短暂消息条。组件内通过当前 App 的 `usePop()` 实例触发，并在应用根部放置一个 `<mc-pop-host />`。

<div class="mc-demo">
  <ClientOnly>
    <mc-pop-host />
    <mc-button variant="primary" @click="pop.show('已保存世界', 2000, 'success')">成功</mc-button>
    <mc-button variant="normal" @click="pop.show('正在生成…', 2000, 'process')">进行中</mc-button>
    <mc-button variant="error" @click="pop.show('保存失败', 2000, 'error')">错误</mc-button>
  </ClientOnly>
</div>

```vue
<script setup lang="ts">
import { usePop } from 'mcui-oreui'
const pop = usePop()
</script>

<template>
  <div class="mc-demo">
    <ClientOnly>
      <mc-pop-host />
      <mc-button variant="primary" @click="pop.show('已保存世界', 2000, 'success')">成功</mc-button>
      <mc-button variant="normal" @click="pop.show('正在生成…', 2000, 'process')">进行中</mc-button>
      <mc-button variant="error" @click="pop.show('保存失败', 2000, 'error')">错误</mc-button>
    </ClientOnly>
  </div>
</template>
```

<script setup>
import { usePop } from '../../src/composables/usePop'
const pop = usePop()
</script>

```vue
<script setup lang="ts">
import { McPopHost, McButton, usePop } from 'mcui-oreui'

const pop = usePop()
</script>

<template>
  <mc-pop-host />
  <mc-button @click="pop.show('已保存', 2000, 'success')">保存</mc-button>
</template>
```

## API

### McPopInstance

`usePop()` 返回当前 App 的 `McPopInstance`：

| 成员                                    | 说明                                        |
| --------------------------------------- | ------------------------------------------- |
| `state`                                 | 只读的当前消息列表                          |
| `show(message, duration?, styleClass?)` | 显示消息并返回数字 ID                       |
| `dismiss(id)`                           | 关闭指定消息                                |
| `clear()`                               | 清空当前 App 的全部消息                     |
| `dispose()`                             | 释放计时器和动画资源；通常由 App 卸载时调用 |

### `show(message, duration?, styleClass?)`

| 参数         | 类型     | 默认   | 说明                                                               |
| ------------ | -------- | ------ | ------------------------------------------------------------------ |
| `message`    | `string` | —      | 需要显示的消息正文。                                               |
| `duration`   | `number` | `3000` | 消息自动关闭前保留的毫秒数。                                       |
| `styleClass` | `string` | —      | 消息主题类：`success`、`process`、`error`、`vip` 或 `debug_text`。 |

最多同时显示 5 条，自动播放 `toast` 音效。`<mc-pop-host />` 全局放置一次即可。

组件外调用时保存插件实例，并使用 `mcui.services.pop.show('已保存')`。无作用域的 `showPop` 与 `popState` 已从 2.0 根入口删除，避免 SSR 请求或同页多个 App 共享状态。
