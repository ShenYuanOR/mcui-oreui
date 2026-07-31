# Chip

用于展示紧凑的标签、筛选项或可移除值。内容统一由默认插槽提供。

## 选择与操作状态

<div class="mc-demo">
  <mc-chip selected>生存模式</mc-chip>
  <mc-chip closable color="#3d75a5">资源包</mc-chip>
  <mc-chip disabled>不可用</mc-chip>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-chip selected>生存模式</mc-chip>
    <mc-chip closable color="#3d75a5">资源包</mc-chip>
    <mc-chip disabled>不可用</mc-chip>
  </div>
</template>
```

| Prop       | 类型      | 默认    |
| ---------- | --------- | ------- |
| `selected` | `boolean` | `false` |
| `closable` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `color`    | `string`  | -       |

传入 `@click` 时主体使用真实按钮并触发 `click`；关闭按钮触发 `close`。2.0 已删除与默认插槽重复的 `text` Prop。
