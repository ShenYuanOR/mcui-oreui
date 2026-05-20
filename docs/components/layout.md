# Layout / Header

页面骨架容器。`<mc-layout>` 对应原 `<dispaly-area>`（项目原始拼写，保留以复用 CSS），
`<mc-header>` 是顶部灰色立体标题栏。

<div class="mc-layout-demo">
  <mc-layout>
    <mc-header title="我的世界">
      <template #left>
        <mc-button size="small">返</mc-button>
      </template>
      <template #right>
        <span class="mc-layout-demo__icon">⚙</span>
      </template>
    </mc-header>
    <mc-scroll-view>
      <div class="mc-layout-demo__content">
        <mc-panel title="存档列表" subtitle="Layout 会提供顶部标题栏与可滚动主体区域">
          <p>这里是页面内容区域，可放置任意 McUI 组件。</p>
          <p>文档站中用固定高度容器模拟全屏页面，实际项目可直接作为页面根布局使用。</p>
        </mc-panel>
        <mc-button variant="primary">进入世界</mc-button>
      </div>
    </mc-scroll-view>
  </mc-layout>
</div>

```vue
<script setup lang="ts">
import { McLayout, McHeader, McScrollView, McButton } from 'mcui-oreui'
import 'mcui-oreui/style.css'
</script>

<template>
  <mc-layout>
    <mc-header title="我的世界">
      <template #left>
        <mc-button size="small" @click="goBack">返回</mc-button>
      </template>
      <template #right>
        <img src="/github.png" style="height:28px" />
      </template>
    </mc-header>

    <mc-scroll-view>
      <!-- 页面内容（可滚动） -->
    </mc-scroll-view>
  </mc-layout>
</template>
```

文档站中的预览使用固定高度容器模拟全屏布局；实际项目中 `<mc-layout>` 适合作为页面根节点。

## mc-layout

无 Props。默认插槽即页面内容，纵向 flex 撑满视口。

## mc-header

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `title` | `string` | `''` | 标题文字（也可用 `#title` 插槽） |

插槽：`#left`（左侧区，如返回按钮）、`#right`（右侧区，如图标）、`#title`。

<style scoped>
.mc-layout-demo {
  background: #242526;
  border: 2px solid #1e1e1f;
  height: 360px;
  margin: 18px 0;
  overflow: hidden;
  position: relative;
}

.mc-layout-demo :deep(dispaly-area) {
  height: 100%;
}

.mc-layout-demo :deep(.header_item_left),
.mc-layout-demo :deep(.header_item_right) {
  pointer-events: auto;
}

.mc-layout-demo :deep(.header_item_left .mc-button) {
  min-width: 0;
  padding-left: 8px;
  padding-right: 8px;
}

.mc-layout-demo__icon {
  color: #1e1e1f;
  font-family: 'Minecraft Seven', sans-serif;
  font-size: 20px;
}

.mc-layout-demo__content {
  box-sizing: border-box;
  color: #fff;
  display: grid;
  gap: 14px;
  padding: 18px;
}

.mc-layout-demo__content p {
  color: #d0d1d4;
  font-family: 'NotoSans Bold', sans-serif;
  margin: 0 0 8px;
}
</style>
