<script setup>
const items = [{ title:'首页', href:'/' }, { title:'世界', href:'/worlds' }, { title:'编辑' }]
</script>

# Breadcrumbs

显示当前位置的层级路径，不依赖 vue-router。

## 路径与分隔符

<div class="mc-demo"><mc-breadcrumbs :items="items" divider="›" aria-label="页面路径" /></div>

```vue
<script setup lang="ts">
const items = [{ title: '首页', href: '/' }, { title: '世界', href: '/worlds' }, { title: '编辑' }]
</script>

<template>
  <div class="mc-demo"><mc-breadcrumbs :items="items" divider="›" aria-label="页面路径" /></div>
</template>
```

## Props

| 名称      | 类型                            | 默认 | 说明                                                    |
| --------- | ------------------------------- | ---- | ------------------------------------------------------- |
| `items`   | `{ title, href?, disabled? }[]` | 必填 | 路径项目；最后一项会自动标记为当前页面。                |
| `divider` | `string`                        | `/`  | 相邻路径项目之间的分隔内容，也可由 `divider` 插槽替换。 |

`item` 插槽获得 `{ item, index, props }`，路由项目可把 props 交给 RouterLink；`divider` 也可用同名插槽。可访问名称直接使用标准 `aria-label`。

内部 `ol/li` 会隔离宿主文章样式的 margin、padding、marker 与相邻项偏移，所有项目保持同一基线。
