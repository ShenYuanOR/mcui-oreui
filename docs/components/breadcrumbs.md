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

| Prop      | 类型                            | 说明     |
| --------- | ------------------------------- | -------- |
| `items`   | `{ title, href?, disabled? }[]` | 路径项目 |
| `divider` | `string`                        | 分隔内容 |

`item` 插槽获得 `{ item, index, props }`，路由项目可把 props 交给 RouterLink；`divider` 也可用同名插槽。可访问名称直接使用标准 `aria-label`。

内部 `ol/li` 会隔离宿主文章样式的 margin、padding、marker 与相邻项偏移，所有项目保持同一基线。
