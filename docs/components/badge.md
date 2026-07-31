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

| Prop      | 类型               | 默认    |
| --------- | ------------------ | ------- |
| `content` | `string \| number` | -       |
| `color`   | `string`           | -       |
| `dot`     | `boolean`          | `false` |
| `inline`  | `boolean`          | `false` |

默认插槽是被标记内容，`badge` 插槽可完全替换标记内容。状态点应直接提供标准 `aria-label`。
