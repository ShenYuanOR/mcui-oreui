# Drawer 抽屉

从屏幕边缘滑出的面板，适合设置菜单、玩家列表、详情面板和移动端导航。

<script setup>
import { ref } from 'vue'
const rightOpen = ref(false)
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

## 底部抽屉

<div class="mc-demo">
  <mc-button @click="bottomOpen = true">打开底部面板</mc-button>
  <mc-drawer v-model:open="bottomOpen" title="快捷操作" placement="bottom">
    <mc-button>邀请好友</mc-button>
    <mc-button>复制地址</mc-button>
  </mc-drawer>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const bottomOpen = ref(false)
</script>

<template>
  <mc-button @click="bottomOpen = true">打开底部面板</mc-button>
  <mc-drawer v-model:open="bottomOpen" title="快捷操作" placement="bottom">
    <mc-button>邀请好友</mc-button>
    <mc-button>复制地址</mc-button>
  </mc-drawer>
</template>
```

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
