# Drawer 抽屉

从屏幕边缘滑出的面板，适合设置菜单、玩家列表、详情面板和移动端导航。

<script setup>
import { ref } from 'vue'
const rightOpen = ref(false)
const leftOpen = ref(false)
const topOpen = ref(false)
const bottomOpen = ref(false)
</script>

## 右侧抽屉

<div class="mc-demo">
  <mc-button variant="primary" @click="rightOpen = true">打开设置</mc-button>
  <mc-drawer v-model:open="rightOpen" title="设置">
    <mc-form-field label="界面音效" description="控制 McUI 组件交互音效。">
      <mc-switch />
    </mc-form-field>
    <template #footer>
      <mc-button variant="primary" @click="rightOpen = false">完成</mc-button>
    </template>
  </mc-drawer>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <mc-button variant="primary" @click="open = true">打开设置</mc-button>
  <mc-drawer v-model:open="open" title="设置">
    设置内容
  </mc-drawer>
</template>
```

## 左侧抽屉

设置 `placement="left"` 可使抽屉从左侧滑出，适合导航菜单等场景。

<div class="mc-demo">
  <mc-button @click="leftOpen = true">打开菜单</mc-button>
  <mc-drawer v-model:open="leftOpen" title="导航菜单" placement="left">
    <mc-button>首页</mc-button>
    <mc-button>服务器列表</mc-button>
    <mc-button>玩家中心</mc-button>
    <mc-button>设置</mc-button>
  </mc-drawer>
</div>

```vue
<mc-button @click="leftOpen = true">打开菜单</mc-button>
<mc-drawer v-model:open="leftOpen" title="导航菜单" placement="left">
  <mc-button>首页</mc-button>
  <mc-button>服务器列表</mc-button>
  <mc-button>玩家中心</mc-button>
  <mc-button>设置</mc-button>
</mc-drawer>
```

## 顶部抽屉

设置 `placement="top"` 可使抽屉从顶部滑出。

<div class="mc-demo">
  <mc-button @click="topOpen = true">打开通知</mc-button>
  <mc-drawer v-model:open="topOpen" title="系统通知" placement="top">
    暂无新通知
  </mc-drawer>
</div>

```vue
<mc-button @click="topOpen = true">打开通知</mc-button>
<mc-drawer v-model:open="topOpen" title="系统通知" placement="top">
  暂无新通知
</mc-drawer>
```

## 底部抽屉

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `open` | `boolean` | `false` | 是否打开（v-model:open） |
| `title` | `string` | `''` | 标题 |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `right` | 出现位置 |
| `closeOnOverlay` | `boolean` | `true` | 点击遮罩是否关闭 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:open` | `boolean` | 打开状态变化 |
| `close` | - | 关闭抽屉 |

## Slots

| 名称 | 说明 |
|---|---|
| `default` | 抽屉主体内容 |
| `header` | 自定义头部 |
| `footer` | 底部区域 |
