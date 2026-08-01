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

## Props

| 名称       | 类型      | 默认    | 说明                                         |
| ---------- | --------- | ------- | -------------------------------------------- |
| `selected` | `boolean` | `false` | 是否使用选中态样式。                         |
| `closable` | `boolean` | `false` | 是否显示独立的移除按钮，点击后触发 `close`。 |
| `disabled` | `boolean` | `false` | 是否禁用主体与移除按钮的交互。               |
| `color`    | `string`  | -       | 自定义标签的强调色，接受合法 CSS 颜色值。    |

传入 `@click` 时主体使用真实按钮并触发 `click`；关闭按钮触发 `close`。2.0 已删除与默认插槽重复的 `text` Prop。
