# Divider

分隔相邻内容，可作为纯装饰，也可暴露语义化 separator。

## 横向与纵向

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

| Prop         | 类型      | 默认    |
| ------------ | --------- | ------- |
| `vertical`   | `boolean` | `false` |
| `decorative` | `boolean` | `true`  |

`decorative=false` 时组件使用 `role="separator"`，并按方向设置 `aria-orientation`。
