<script setup>import { ref } from 'vue'; const drawer = ref(true)</script>

# Layout、Appbar 与 Main

`McLayout` 建立注册服务；固定 Appbar 和非临时 Drawer 把尺寸、位置、顺序和激活状态注册进去，`McMain` 自动应用四向逻辑占位。

## 持久式应用布局

<div class="mc-demo mc-layout-demo">
  <mc-layout>
    <mc-appbar title="世界列表" :height="48" position="top" fixed />
    <mc-drawer v-model="drawer" mode="persistent" position="start" :size="180" :teleport="false"><p>导航</p></mc-drawer>
    <mc-main><div style="padding:16px"><mc-button @click="drawer = !drawer">切换 Drawer</mc-button><p>Main 不会被栏位遮挡。</p></div></mc-main>
  </mc-layout>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const drawer = ref(true)
</script>

<template>
  <div class="mc-demo mc-layout-demo">
    <mc-layout>
      <mc-appbar title="世界列表" :height="48" position="top" fixed />
      <mc-drawer v-model="drawer" mode="persistent" position="start" :size="180" :teleport="false"
        ><p>导航</p></mc-drawer
      >
      <mc-main
        ><div style="padding:16px">
          <mc-button @click="drawer = !drawer">切换 Drawer</mc-button>
          <p>Main 不会被栏位遮挡。</p>
        </div></mc-main
      >
    </mc-layout>
  </div>
</template>

<style scoped>
.mc-layout-demo {
  height: 360px;
  overflow: hidden;
  position: relative;
  border: 2px solid #1e1e1f;
}
.mc-layout-demo :deep(.mc-appbar--fixed),
.mc-layout-demo :deep(.mc-drawer) {
  position: absolute;
}
</style>
```

Persistent Drawer 在移动断点下自动变为 temporary。`McMain` 输出 `--mc-layout-top/bottom/start/end`，使用逻辑方向，因此 RTL 下 start/end 无需交换 API。

## Props

| 组件       | Props                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| `McAppbar` | `title`、`height=40`、`position=top\|bottom`、`fixed=true`、`order=0`                                       |
| `McDrawer` | `v-model`、`mode=temporary\|persistent\|permanent`、`position=start\|end\|top\|bottom`、`size=320`、`order` |
| `McMain`   | `tag=main`                                                                                                  |

`McAppbar` 插槽：`left`、`default`、`right`。`McDrawer` 插槽：`activator`、`header`、`default`、`footer`。

<style scoped>.mc-layout-demo{height:360px;overflow:hidden;position:relative;border:2px solid #1e1e1f}.mc-layout-demo :deep(.mc-appbar--fixed),.mc-layout-demo :deep(.mc-drawer){position:absolute}</style>
