<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

# Dialog

用于需要焦点陷阱、遮罩和明确关闭行为的模态内容。

## 可操作对话框

<div class="mc-demo">
  <mc-dialog v-model="open" title="世界设置">
    <template #activator="{ props }"><mc-button v-bind="props">打开 Dialog</mc-button></template>
    调整当前世界的游戏规则。
    <template #actions="{ close }"><mc-button size="small" @click="close">完成</mc-button></template>
  </mc-dialog>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <div class="mc-demo">
    <mc-dialog v-model="open" title="世界设置">
      <template #activator="{ props }"><mc-button v-bind="props">打开 Dialog</mc-button></template>
      调整当前世界的游戏规则。
      <template #actions="{ close }"><mc-button size="small" @click="close">完成</mc-button></template>
    </mc-dialog>
  </div>
</template>
```

| Prop                              | 类型                             | 默认    |
| --------------------------------- | -------------------------------- | ------- |
| `modelValue`                      | `boolean`                        | `false` |
| `title`                           | `string`                         | -       |
| `teleport`                        | `string \| HTMLElement \| false` | `body`  |
| `closeOnOverlay`、`closeOnEscape` | `boolean`                        | `true`  |
| `persistent`                      | `boolean`                        | `false` |
| `showClose`                       | `boolean`                        | `true`  |
| `width`                           | `string \| number`               | `520`   |

插槽：`activator`、`title`、`default`、`actions`。事件：`update:modelValue`、`close`。Dialog 使用 `role="dialog"`、焦点陷阱、焦点恢复和滚动锁。
