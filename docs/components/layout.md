<script setup>
import { ref } from 'vue'
const drawerOpen = ref(false)
</script>

# Layout

页面骨架容器。`<mc-layout>` 对应原 `<dispaly-area>`（项目原始拼写，保留以复用 CSS），
配合 `<mc-appbar>` 构成完整页面布局。Appbar 左侧菜单按钮可打开左侧导航抽屉。

<div class="mc-layout-demo">
  <mc-layout>
    <mc-appbar>
      <template #left>
        <mc-appbar-icon icon="mc-menu" tip="抽屉栏" @click="drawerOpen = true" />
        <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
      </template>
      <template #right>
        <mc-appbar-button icon="mc-home">制作</mc-appbar-button>
        <mc-appbar-button icon="mc-world">世界</mc-appbar-button>
        <mc-appbar-button icon="mc-friends">社交</mc-appbar-button>
      </template>
    </mc-appbar>
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
  <mc-drawer v-model:open="drawerOpen" title="导航菜单" placement="left" :teleport="false">
    <mc-list @change="drawerOpen = false">
      <mc-list-item label="首页" value="home" icon="mc-home" />
      <mc-list-item label="服务器列表" value="servers" icon="mc-world" />
      <mc-list-item label="玩家中心" value="players" icon="mc-friends" />
      <mc-list-item label="设置" value="settings" icon="mc-settings" />
    </mc-list>
  </mc-drawer>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { McAppbar, McLayout, McScrollView, McButton, McDrawer, McList, McListItem } from "mcui-oreui";
import "mcui-oreui/style.css";

const drawerOpen = ref(false)
</script>

<template>
  <mc-layout>
    <mc-appbar>
      <template #left>
        <mc-appbar-icon icon="mc-menu" tip="抽屉栏" @click="drawerOpen = true" />
        <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
      </template>
      <template #right>
        <mc-appbar-button icon="mc-home">制作</mc-appbar-button>
        <mc-appbar-button icon="mc-world">世界</mc-appbar-button>
        <mc-appbar-button icon="mc-friends">社交</mc-appbar-button>
      </template>
    </mc-appbar>

    <mc-scroll-view>
      <!-- 页面内容（可滚动） -->
      <div class="mc-layout-demo__content">
        <mc-panel title="存档列表" subtitle="Layout 会提供顶部标题栏与可滚动主体区域">
          <p>这里是页面内容区域，可放置任意 McUI 组件。</p>
          <p>文档站中用固定高度容器模拟全屏页面，实际项目可直接作为页面根布局使用。</p>
        </mc-panel>
        <mc-button variant="primary">进入世界</mc-button>
      </div>
    </mc-scroll-view>
  </mc-layout>

  <mc-drawer v-model:open="drawerOpen" title="导航菜单" placement="left" :teleport="false">
    <mc-list @change="drawerOpen = false">
      <mc-list-item label="首页" value="home" icon="mc-home" />
      <mc-list-item label="服务器列表" value="servers" icon="mc-world" />
      <mc-list-item label="玩家中心" value="players" icon="mc-friends" />
      <mc-list-item label="设置" value="settings" icon="mc-settings" />
    </mc-list>
  </mc-drawer>
</template>

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

.mc-layout-demo__content {
  box-sizing: border-box;
  color: #fff;
  display: grid;
  gap: 14px;
  padding: 18px;
  height: 600px;
}

.mc-layout-demo__content p {
  color: #d0d1d4;
  font-family: 'NotoSans Bold', sans-serif;
  margin: 0 0 8px;
}
</style>

```

文档站中的预览使用固定高度容器模拟全屏布局；实际项目中 `<mc-layout>` 适合作为页面根节点。

## mc-layout

无 Props。默认插槽即页面内容，纵向 flex 撑满视口。

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

.mc-layout-demo__content {
  box-sizing: border-box;
  color: #fff;
  display: grid;
  gap: 14px;
  padding: 18px;
  height: 600px;
}

.mc-layout-demo__content p {
  color: #d0d1d4;
  font-family: 'NotoSans Bold', sans-serif;
  margin: 0 0 8px;
}
</style>
