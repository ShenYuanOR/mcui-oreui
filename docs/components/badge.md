# Badge

在任意内容旁显示数量、状态点或自定义标记。

## 内容与形态

<div class="mc-demo">
  <mc-badge content="3"><mc-button size="small">消息</mc-button></mc-badge>
  <mc-badge dot aria-label="有新消息"><mc-button size="small">通知</mc-button></mc-badge>
  <mc-badge content="VIP" color="#7b4ab5" inline />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-badge content="3"><mc-button size="small">消息</mc-button></mc-badge>
    <mc-badge dot aria-label="有新消息"><mc-button size="small">通知</mc-button></mc-badge>
    <mc-badge content="VIP" color="#7b4ab5" inline />
  </div>
</template>
```

## Props

| 名称      | 类型               | 默认    | 说明                                            |
| --------- | ------------------ | ------- | ----------------------------------------------- |
| `content` | `string \| number` | -       | 徽标中显示的文字或数字，可由 `badge` 插槽覆盖。 |
| `color`   | `string`           | -       | 自定义徽标背景色，接受合法 CSS 颜色值。         |
| `dot`     | `boolean`          | `false` | 是否隐藏内容并显示为纯状态点。                  |
| `inline`  | `boolean`          | `false` | 是否取消角标定位，让徽标作为普通行内内容排列。  |

默认插槽是被标记内容，`badge` 插槽可完全替换标记内容。状态点应直接提供标准 `aria-label`。
