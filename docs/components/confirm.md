# Confirm 确认弹窗

基于 `<mc-modal>` 封装的确认弹窗，适合删除、退出、覆盖存档等二次确认场景。

`<mc-confirm>` 默认不显示右上角关闭按钮，也不会通过点击遮罩关闭。用户只能通过底部的确认或取消按钮完成操作，避免误触关闭导致确认流程不明确。如需显示关闭按钮，可设置 `show-close`。

<script setup>
import { ref } from 'vue'
const open = ref(false)
const dangerOpen = ref(false)
const showCloseOpen = ref(false)
const stackOpen = ref(false)
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

## 显示关闭按钮

设置 `show-close` 可在标题栏右侧显示 `✕` 关闭按钮，效果等同于点击取消。

<div class="mc-demo">
  <mc-button variant="primary" @click="showCloseOpen = true">打开确认</mc-button>
  <mc-confirm v-model:open="showCloseOpen" title="退出游戏？" confirm-text="退出" show-close>
    确定要退出当前游戏吗？
  </mc-confirm>
</div>

```html
<mc-button variant="primary" @click="showCloseOpen = true">打开确认</mc-button>
<mc-confirm v-model:open="showCloseOpen" title="退出游戏？" confirm-text="退出" show-close>
  确定要退出当前游戏吗？
</mc-confirm>
```

## 按钮垂直排列

设置 `stack-actions` 可使操作按钮垂直堆叠，适合按钮文本较长的场景。

<div class="mc-demo">
  <mc-button variant="primary" @click="stackOpen = true">打开确认</mc-button>
  <mc-confirm v-model:open="stackOpen" title="覆盖存档？" confirm-text="覆盖并继续" cancel-text="返回存档列表" stack-actions>
    当前存档已存在，是否覆盖？
  </mc-confirm>
</div>

```html
<mc-button variant="primary" @click="stackOpen = true">打开确认</mc-button>
<mc-confirm v-model:open="stackOpen" title="覆盖存档？" confirm-text="覆盖并继续" cancel-text="返回存档列表" stack-actions>
  当前存档已存在，是否覆盖？
</mc-confirm>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `open` | `boolean` | `false` | 是否打开（v-model:open） |
| `title` | `string` | `确认操作` | 标题 |
| `confirmText` | `string` | `确认` | 确认按钮文本 |
| `cancelText` | `string` | `取消` | 取消按钮文本 |
| `danger` | `boolean` | `false` | 是否使用危险确认样式 |
| `showClose` | `boolean` | `false` | 是否显示右上角关闭按钮 |
| `stackActions` | `boolean` | `false` | 按钮是否垂直排列 |

::: tip 操作限制
`<mc-confirm>` 默认隐藏右上角 `X` 关闭按钮，并禁用遮罩关闭。确认弹窗只会通过 `confirm` 或 `cancel` 两个明确动作关闭。设置 `show-close` 可启用关闭按钮。
:::

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:open` | `boolean` | 打开状态变化 |
| `confirm` | - | 点击确认 |
| `cancel` | - | 点击取消 |
| `close` | - | 弹窗关闭 |
