# Divider

分隔相邻内容，可作为纯装饰，也可暴露语义化 separator。

## 基础用法

<div class="mc-demo mc-demo--column" style="width:100%">
  <span>世界设置</span>
  <mc-divider />
  <span>资源包设置</span>
  <div style="display:flex;align-items:center;height:40px;gap:12px">
    <span>本地</span>
    <mc-divider vertical :decorative="false" />
    <span>联机</span>
  </div>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <span>世界设置</span>
    <mc-divider />
    <span>资源包设置</span>
    <div style="display:flex;align-items:center;height:40px;gap:12px">
      <span>本地</span>
      <mc-divider vertical :decorative="false" />
      <span>联机</span>
    </div>
  </div>
</template>
```

## API

### Props

| 名称         | 类型      | 默认    | 说明                                                           |
| ------------ | --------- | ------- | -------------------------------------------------------------- |
| `vertical`   | `boolean` | `false` | 是否使用纵向分隔线；默认显示横向分隔线。                       |
| `decorative` | `boolean` | `true`  | 是否仅作视觉装饰；设为 `false` 时暴露 `separator` 语义和方向。 |

`decorative=false` 时组件使用 `role="separator"`，并按方向设置 `aria-orientation`。
