<script setup>
import { ref } from 'vue'
const dialogOpen = ref(false)
const confirmOpen = ref(false)
</script>

# Dialog 对话框

Dialog 组件族用于需要遮罩、焦点管理和明确关闭行为的模态内容。`McDialog` 承载通用内容，`McConfirm` 处理需要用户确认或取消的简短决策。

## 基础用法

<div class="mc-demo">
  <mc-dialog v-model="dialogOpen" title="世界设置">
    <template #activator="{ props }"><mc-button v-bind="props">打开 Dialog</mc-button></template>
    调整当前世界的游戏规则。
    <template #actions="{ close }"><mc-button size="small" @click="close">完成</mc-button></template>
  </mc-dialog>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const dialogOpen = ref(false)
</script>

<template>
  <div class="mc-demo">
    <mc-dialog v-model="dialogOpen" title="世界设置">
      <template #activator="{ props }"><mc-button v-bind="props">打开 Dialog</mc-button></template>
      调整当前世界的游戏规则。
      <template #actions="{ close }"><mc-button size="small" @click="close">完成</mc-button></template>
    </mc-dialog>
  </div>
</template>
```

## Confirm 确认弹窗

`McConfirm` 直接复用 Dialog 的 header、body 和 actions 分区，适合删除、覆盖、退出等需要二次确认的操作。

<div class="mc-demo">
  <mc-button variant="error" @click="confirmOpen = true">删除世界</mc-button>
  <mc-confirm v-model="confirmOpen" title="删除世界？" confirm-text="删除" danger>
    此操作无法撤销。
  </mc-confirm>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const confirmOpen = ref(false)
</script>

<template>
  <div class="mc-demo">
    <mc-button variant="error" @click="confirmOpen = true">删除世界</mc-button>
    <mc-confirm v-model="confirmOpen" title="删除世界？" confirm-text="删除" danger>此操作无法撤销。</mc-confirm>
  </div>
</template>
```

## 交互机制

- Dialog 默认允许点击遮罩或按 Escape 关闭，并显示右上角关闭按钮。
- Confirm 默认禁用遮罩关闭并隐藏关闭按钮，必须通过取消、确认或显式状态更新完成决策。
- 两者都由 Overlay 提供焦点陷阱、焦点恢复、页面滚动锁和 Teleport；默认挂载到 `body`。

## API

### McDialog

| 名称             | 类型                             | 默认    | 说明                                                  |
| ---------------- | -------------------------------- | ------- | ----------------------------------------------------- |
| `modelValue`     | `boolean`                        | `false` | 控制对话框是否显示，支持通过 `v-model` 双向绑定。     |
| `title`          | `string`                         | -       | 对话框标题；也可使用 `title` 插槽提供自定义内容。     |
| `teleport`       | `string \| HTMLElement \| false` | `body`  | Teleport 目标；设为 `false` 时保留在当前 DOM 层级。   |
| `closeOnOverlay` | `boolean`                        | `true`  | 点击遮罩时是否关闭对话框。                            |
| `closeOnEscape`  | `boolean`                        | `true`  | 按 Escape 时是否关闭对话框。                          |
| `persistent`     | `boolean`                        | `false` | 是否阻止遮罩点击和 Escape 关闭，适合必须完成的流程。  |
| `showClose`      | `boolean`                        | `true`  | 是否在标题区显示右上角关闭按钮。                      |
| `width`          | `string \| number`               | `520`   | 对话框宽度；数字按 px 处理，字符串作为 CSS 宽度使用。 |

插槽：`activator`、`title`、`default`、`actions`。事件：`update:modelValue`、`close`。Dialog 使用 `role="dialog"`、焦点陷阱、焦点恢复和滚动锁。

### McConfirm

| 名称           | 类型                             | 默认        | 说明                                                |
| -------------- | -------------------------------- | ----------- | --------------------------------------------------- |
| `modelValue`   | `boolean`                        | `false`     | 控制确认弹窗是否显示，支持通过 `v-model` 双向绑定。 |
| `title`        | `string`                         | Locale 文案 | 确认弹窗标题；未提供时使用当前 Locale 的确认文案。  |
| `confirmText`  | `string`                         | Locale 文案 | 确认按钮文字；未提供时使用当前 Locale 的确认文案。  |
| `cancelText`   | `string`                         | Locale 文案 | 取消按钮文字；未提供时使用当前 Locale 的取消文案。  |
| `danger`       | `boolean`                        | `false`     | 是否使用错误色突出确认按钮，适合删除等危险操作。    |
| `showClose`    | `boolean`                        | `false`     | 是否显示右上角关闭按钮。                            |
| `stackActions` | `boolean`                        | `false`     | 是否将取消与确认按钮改为纵向堆叠。                  |
| `teleport`     | `string \| HTMLElement \| false` | `body`      | Teleport 目标；设为 `false` 时保留在当前 DOM 层级。 |

默认插槽为确认说明。事件：`update:modelValue`、`confirm`、`cancel`、`close`。Escape、关闭按钮或遮罩导致关闭时发出 `cancel`；点确认只发出 `confirm`，不会顺带 `cancel`。
