<script setup>import { ref } from 'vue'; const open = ref(false)</script>

# Confirm 确认弹窗

## 危险操作确认

<div class="mc-demo"><mc-button variant="error" @click="open=true">删除世界</mc-button><mc-confirm v-model="open" title="删除世界？" confirm-text="删除" danger @confirm="open=false">此操作无法撤销。</mc-confirm></div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <div class="mc-demo">
    <mc-button variant="error" @click="open = true">删除世界</mc-button
    ><mc-confirm v-model="open" title="删除世界？" confirm-text="删除" danger @confirm="open = false"
      >此操作无法撤销。</mc-confirm
    >
  </div>
</template>
```

Confirm 基于 `McDialog`，默认禁用遮罩关闭并隐藏右上角关闭按钮。

| Prop                                  | 类型                             | 默认        |
| ------------------------------------- | -------------------------------- | ----------- |
| `modelValue`                          | `boolean`                        | `false`     |
| `title`、`confirmText`、`cancelText`  | `string`                         | Locale 文案 |
| `danger`、`showClose`、`stackActions` | `boolean`                        | `false`     |
| `teleport`                            | `string \| HTMLElement \| false` | `body`      | Dialog Teleport 目标；`false` 时原位渲染 |

事件：`update:modelValue`、`confirm`、`cancel`、`close`。默认插槽为提示内容。
