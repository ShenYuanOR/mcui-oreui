# AppbarIcon 图标按钮

`McAppbarIcon` 是 Appbar 顶栏中的纯图标按钮，无文字，适合放在顶栏左侧作为工具栏操作图标。

本页 Appbar 嵌入文档内容流，因此示例显式设置 `:fixed="false"`；应用级顶栏需要固定到视口时可省略该设置。

## 基础用法

仅显示一个图标，适合返回、菜单等操作。

<div class="mc-demo">
  <mc-appbar title="编辑器" :fixed="false">
    <template #left>
      <mc-appbar-icon icon="mc-chevron-left" />
      <mc-appbar-icon icon="mc-menu" />
    </template>
  </mc-appbar>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-appbar title="编辑器" :fixed="false">
      <template #left>
        <mc-appbar-icon icon="mc-chevron-left" />
        <mc-appbar-icon icon="mc-menu" />
      </template>
    </mc-appbar>
  </div>
</template>
```

## 带 Tooltip

设置 `tip` 属性可在悬停时显示提示文本，帮助用户理解图标功能。

<div class="mc-demo">
  <mc-appbar title="编辑器" :fixed="false">
    <template #left>
      <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
      <mc-appbar-icon icon="mc-undo" tip="撤销" />
      <mc-appbar-icon icon="mc-redo" tip="重做" />
    </template>
  </mc-appbar>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-appbar title="编辑器" :fixed="false">
      <template #left>
        <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
        <mc-appbar-icon icon="mc-undo" tip="撤销" />
        <mc-appbar-icon icon="mc-redo" tip="重做" />
      </template>
    </mc-appbar>
  </div>
</template>
```

## 禁用状态

设置 `disabled` 属性后图标不可点击，呈半透明显示。

<div class="mc-demo">
  <mc-appbar title="编辑器" :fixed="false">
    <template #left>
      <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
      <mc-appbar-icon icon="mc-undo" tip="撤销" disabled />
    </template>
  </mc-appbar>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-appbar title="编辑器" :fixed="false">
      <template #left>
        <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
        <mc-appbar-icon icon="mc-undo" tip="撤销" disabled />
      </template>
    </mc-appbar>
  </div>
</template>
```

## Props

| 名称         | 类型      | 默认    | 说明                                               |
| ------------ | --------- | ------- | -------------------------------------------------- |
| `icon`       | `string`  | `''`    | 图标名称                                           |
| `disabled`   | `boolean` | `false` | 是否禁用                                           |
| `tip`        | `string`  | `''`    | Tooltip 文本，非空则显示                           |
| `aria-label` | 标准 Attr | -       | 自定义可访问名称；未提供时依次回退到 `tip`、`icon` |

## Events

| 事件    | 参数         | 说明                     |
| ------- | ------------ | ------------------------ |
| `click` | `MouseEvent` | 点击按钮（禁用时不触发） |
