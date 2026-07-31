# Appbar 应用栏

## 组合与栏位

<div class="mc-demo"><mc-appbar title="编辑器" :height="48" :fixed="false"><template #left><mc-appbar-icon icon="mc-chevron-left" tip="返回" /></template><template #right><mc-appbar-button>完成</mc-appbar-button></template></mc-appbar></div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-appbar title="编辑器" :height="48" :fixed="false"
      ><template #left><mc-appbar-icon icon="mc-chevron-left" tip="返回" /></template
      ><template #right><mc-appbar-button>完成</mc-appbar-button></template></mc-appbar
    >
  </div>
</template>
```

Appbar 在 `McLayout` 内注册占位，`McMain` 会消费该尺寸。

| Prop       | 类型               | 默认   |
| ---------- | ------------------ | ------ |
| `title`    | `string`           | `''`   |
| `height`   | `number \| string` | `40`   |
| `position` | `top \| bottom`    | `top`  |
| `fixed`    | `boolean`          | `true` |
| `order`    | `number`           | `0`    |

插槽：`left`、`default`、`right`。按钮用法见 [AppbarButton](./appbar-button) 与 [AppbarIcon](./appbar-icon)。
