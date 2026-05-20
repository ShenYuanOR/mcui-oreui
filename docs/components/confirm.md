# Confirm 确认弹窗

基于 `<mc-modal>` 封装的确认弹窗，适合删除、退出、覆盖存档等二次确认场景。

`<mc-confirm>` 不显示右上角关闭按钮，也不会通过点击遮罩关闭。用户只能通过底部的确认或取消按钮完成操作，避免误触关闭导致确认流程不明确。

<script setup>
import { ref } from 'vue'
const open = ref(false)
const dangerOpen = ref(false)
</script>

## 基础用法

<div class="mc-demo">
  <mc-button variant="primary" @click="open = true">打开确认</mc-button>
  <mc-confirm v-model:open="open" title="保存设置？" confirm-text="保存" @confirm="open = false">
    是否保存当前游戏设置？
  </mc-confirm>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <mc-button variant="primary" @click="open = true">打开确认</mc-button>
  <mc-confirm v-model:open="open" title="保存设置？" confirm-text="保存">
    是否保存当前游戏设置？
  </mc-confirm>
</template>
```

## 危险操作

<div class="mc-demo">
  <mc-button variant="error" @click="dangerOpen = true">删除世界</mc-button>
  <mc-confirm v-model:open="dangerOpen" title="删除世界？" confirm-text="删除" danger>
    此操作无法撤销，请确认是否继续。
  </mc-confirm>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const dangerOpen = ref(false)
</script>

<template>
  <mc-button variant="error" @click="dangerOpen = true">删除世界</mc-button>
  <mc-confirm v-model:open="dangerOpen" title="删除世界？" confirm-text="删除" danger>
    此操作无法撤销，请确认是否继续。
  </mc-confirm>
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `open` | `boolean` | `false` | 是否打开（v-model:open） |
| `title` | `string` | `确认操作` | 标题 |
| `confirmText` | `string` | `确认` | 确认按钮文本 |
| `cancelText` | `string` | `取消` | 取消按钮文本 |
| `danger` | `boolean` | `false` | 是否使用危险确认样式 |

::: tip 操作限制
`<mc-confirm>` 固定隐藏右上角 `X` 关闭按钮，并禁用遮罩关闭。确认弹窗只会通过 `confirm` 或 `cancel` 两个明确动作关闭。
:::

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:open` | `boolean` | 打开状态变化 |
| `confirm` | - | 点击确认 |
| `cancel` | - | 点击取消 |
| `close` | - | 弹窗关闭 |
