<script setup lang="ts"></script>

# 应用栏 / Appbar

应用栏由 `McAppbar` 父组件与 `McAppbarButton`、`McAppbarIcon` 两个专用子组件组成。父组件负责位置、尺寸和栏位，子组件负责顶栏内一致的文字操作与图标操作。

文档示例嵌入内容流，因此统一设置 `:fixed="false"`；应用级顶栏需要固定到视口时可以使用默认的 `fixed=true`。

## 基础用法

`left` 放返回、菜单等前置操作，默认插槽放标题或自定义内容，`right` 放页面操作。

<div class="mc-demo">
  <mc-appbar title="编辑器" :height="48" :fixed="false">
    <template #left>
      <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
    </template>
    <template #right>
      <mc-appbar-button>完成</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-appbar title="编辑器" :height="48" :fixed="false">
      <template #left>
        <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
      </template>
      <template #right>
        <mc-appbar-button>完成</mc-appbar-button>
      </template>
    </mc-appbar>
  </div>
</template>
```

在 `McLayout` 内使用时，固定 Appbar 会注册自身占位，布局内容可以据此避让顶部或底部区域。

## 应用栏按钮

`McAppbarButton` 用于带可见文字的操作。它支持纯文字、图标加文字、Tooltip、自定义背景色和禁用状态。

<div class="mc-demo">
  <mc-appbar :fixed="false">
    <template #right>
      <mc-appbar-button>保存</mc-appbar-button>
      <mc-appbar-button icon="mc-friends" tip="打开社交页面">社交</mc-appbar-button>
      <mc-appbar-button icon="mc-world" color="#3c8527">世界</mc-appbar-button>
      <mc-appbar-button icon="mc-settings" disabled>设置</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-appbar :fixed="false">
      <template #right>
        <mc-appbar-button>保存</mc-appbar-button>
        <mc-appbar-button icon="mc-friends" tip="打开社交页面">社交</mc-appbar-button>
        <mc-appbar-button icon="mc-world" color="#3c8527">世界</mc-appbar-button>
        <mc-appbar-button icon="mc-settings" disabled>设置</mc-appbar-button>
      </template>
    </mc-appbar>
  </div>
</template>
```

## 应用栏图标

`McAppbarIcon` 用于紧凑的纯图标操作，适合返回、菜单、撤销等高频动作。没有可见文字时，应通过 `tip` 或 `aria-label` 提供明确名称。

<div class="mc-demo">
  <mc-appbar title="编辑器" :fixed="false">
    <template #left>
      <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
      <mc-appbar-icon icon="mc-menu" tip="菜单" />
    </template>
    <template #right>
      <mc-appbar-icon icon="mc-undo" tip="撤销" />
      <mc-appbar-icon icon="mc-redo" tip="重做" disabled />
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
        <mc-appbar-icon icon="mc-menu" tip="菜单" />
      </template>
      <template #right>
        <mc-appbar-icon icon="mc-undo" tip="撤销" />
        <mc-appbar-icon icon="mc-redo" tip="重做" disabled />
      </template>
    </mc-appbar>
  </div>
</template>
```

## API

### McAppbar Props

| 名称       | 类型               | 默认   | 说明                 |
| ---------- | ------------------ | ------ | -------------------- |
| `title`    | `string`           | `''`   | 应用栏标题           |
| `height`   | `number \| string` | `40`   | 应用栏高度           |
| `position` | `top \| bottom`    | `top`  | 注册到顶部或底部     |
| `fixed`    | `boolean`          | `true` | 是否固定并注册占位   |
| `order`    | `number`           | `0`    | 同方向布局项排列顺序 |

插槽：`left`、`default`、`right`。

### McAppbarButton Props

| 名称         | 类型      | 默认    | 说明             |
| ------------ | --------- | ------- | ---------------- |
| `icon`       | `string`  | -       | 左侧图标名称     |
| `disabled`   | `boolean` | `false` | 是否禁用         |
| `tip`        | `string`  | -       | Tooltip 文本     |
| `color`      | `string`  | -       | 自定义背景色     |
| `aria-label` | 标准 Attr | -       | 自定义可访问名称 |

默认插槽放置按钮文字。`click` 事件传递 `MouseEvent`，禁用时不触发。

### McAppbarIcon Props

| 名称         | 类型      | 默认    | 说明                                           |
| ------------ | --------- | ------- | ---------------------------------------------- |
| `icon`       | `string`  | `''`    | 图标名称                                       |
| `disabled`   | `boolean` | `false` | 是否禁用                                       |
| `tip`        | `string`  | `''`    | Tooltip 文本                                   |
| `aria-label` | 标准 Attr | -       | 自定义可访问名称；未提供时回退到 `tip`、`icon` |

`click` 事件传递 `MouseEvent`，禁用时不触发。
