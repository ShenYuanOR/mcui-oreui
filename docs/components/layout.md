# Layout / Header

页面骨架容器。`OreLayout` 对应原 `<dispaly-area>`（项目原始拼写，保留以复用 CSS），
`OreHeader` 是顶部灰色立体标题栏。

> 这两个组件是 `height:100%` 全屏布局容器，适合作为页面根，不便在文档内嵌演示，下面给出用法。

```vue
<script setup lang="ts">
import { OreLayout, OreHeader, OreScrollView, OreButton } from 'mcui-oreui'
import 'mcui-oreui/style.css'
</script>

<template>
  <OreLayout>
    <OreHeader title="我的世界">
      <template #left>
        <OreButton size="small" @click="goBack">返回</OreButton>
      </template>
      <template #right>
        <img src="/github.png" style="height:28px" />
      </template>
    </OreHeader>

    <OreScrollView>
      <!-- 页面内容（可滚动） -->
    </OreScrollView>
  </OreLayout>
</template>
```

## OreLayout

无 Props。默认插槽即页面内容，纵向 flex 撑满视口。

## OreHeader

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `title` | `string` | `''` | 标题文字（也可用 `#title` 插槽） |

插槽：`#left`（左侧区，如返回按钮）、`#right`（右侧区，如图标）、`#title`。
