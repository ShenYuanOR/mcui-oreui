# Skeleton

在内容尚未就绪时显示像素风占位骨架。

## 尺寸组合

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-skeleton height="34" aria-label="正在加载世界列表" />
  <mc-skeleton width="60%" height="18" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-skeleton height="34" aria-label="正在加载世界列表" />
    <mc-skeleton width="60%" height="18" />
  </div>
</template>
```

| Prop     | 类型               | 默认   |
| -------- | ------------------ | ------ |
| `width`  | `string \| number` | `100%` |
| `height` | `string \| number` | `20`   |

数字尺寸按 px 解释。可访问名称直接使用标准 `aria-label`；未提供时使用当前 Locale 的加载文案。
