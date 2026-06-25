# Appbar 顶栏

顶部导航栏，分为左、中、右三个区域，可分别放置按钮或文本等内容。

## 基础用法

<div class="mc-demo mc-demo--column">
  <mc-appbar title="设置">
    <mc-button variant="primary" size="small">保存</mc-button>
  </mc-appbar>
</div>

```html
<mc-appbar title="设置">
  <mc-button variant="primary" size="small">保存</mc-button>
</mc-appbar>
```

- 默认插槽内容位于**中间**区域
- `title` 属性自动放置在**左侧**区域

## 左中右分区

<div class="mc-demo mc-demo--column">
  <mc-appbar>
    <template #left>
      <mc-button size="small">返回</mc-button>
    </template>
    <span style="font-family:'Minecraft Seven'">世界编辑</span>
    <template #right>
      <mc-button size="small">帮助</mc-button>
      <mc-button variant="primary" size="small">完成</mc-button>
    </template>
  </mc-appbar>
</div>

```vue
<script setup lang="ts">
</script>

<template>
  <mc-appbar>
    <template #left>
      <mc-button size="small">返回</mc-button>
    </template>
    <span style="font-family:'Minecraft Seven'">世界编辑</span>
    <template #right>
      <mc-button size="small">帮助</mc-button>
      <mc-button variant="primary" size="small">完成</mc-button>
    </template>
  </mc-appbar>
</template>
```

## 外观说明

- 背景色 `#E6E8EB`，Minecraft 浅色顶栏风格
- 底部 3px `#B1B2B5` 实线 + 1px 黑色半透明内阴影，形成双层斜面底边
- 左、右区域靠边对齐，中间区域居中

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `title` | `string` | `''` | 左侧标题文本，不传则隐藏 |

## Slots

| 名称 | 说明 |
|---|---|
| `left` | 左侧区域，与 `title` 同行；可放置按钮、图标等 |
| `default` | 中间区域，默认插槽，内容居中显示 |
| `right` | 右侧区域，可放置操作按钮 |
