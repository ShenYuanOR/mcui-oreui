<script setup>import { ref } from 'vue'; const checked = ref(false)</script>

# Checkbox 复选框

## 选中与交互状态

<div class="mc-demo">
  <mc-checkbox v-model="checked" label="允许多人游戏" />
  <mc-checkbox :model-value="true" label="已禁用" disabled />
  <mc-checkbox :model-value="true" label="只读选中" readonly />
  <mc-checkbox indeterminate label="混合状态" />
  <mc-checkbox label="校验错误" error-messages="必须确认此项" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>

<template>
  <div class="mc-demo">
    <mc-checkbox v-model="checked" label="允许多人游戏" />
    <mc-checkbox :model-value="true" label="已禁用" disabled />
    <mc-checkbox :model-value="true" label="只读选中" readonly />
    <mc-checkbox indeterminate label="混合状态" />
    <mc-checkbox label="校验错误" error-messages="必须确认此项" />
  </div>
</template>
```

组件使用真实 `input[type=checkbox]`，原生支持 Space、表单提交、required、disabled 与读屏器状态。

选中勾号使用 crispEdges 像素图形，混合态横杠由固定像素块绘制，不依赖系统字体中的 `✓` / `−` 字形，因此在不同平台与字体配置下保持一致。

Props：`modelValue`、`label`、`description`、`hint`、`disabled`、`readonly`、`required`、`rules`、`errorMessages`、`validateOn`、`id`、`name`、`indeterminate`、`color`。事件：`update:modelValue`、`change`。标准原生与 `aria-*` Attr 会到达内部 checkbox。
