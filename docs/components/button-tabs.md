# ButtonTabs 按钮式标签

以按钮样式呈现的选项卡栏。未选中项使用 `normal`（次要）按钮外观，选中项使用 `primary`（主操作）按钮外观且呈现**按下态**，并在按钮底部居中显示一条 **1/3 宽度的白色横条**作为选中指示。

<script setup>
import { ref } from 'vue'
const tab = ref('video')
const titleTab = ref('profile')
const side = ref('profile')
const colorTab = ref('world')
</script>

## 基础用法

<div class="mc-demo mc-demo--column">
  <mc-button-tabs
    v-model="tab"
    :items="[
      { label: '视频', value: 'video' },
      { label: '音频', value: 'audio' },
      { label: '控制', value: 'control' },
      { label: '实验', value: 'exp', disabled: true }
    ]"
  >
    <template #default="{ active }">
      当前标签：{{ active }}
    </template>
  </mc-button-tabs>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('video')
</script>

<template>
  <mc-button-tabs
    v-model="tab"
    :items="[
      { label: '视频', value: 'video' },
      { label: '音频', value: 'audio' },
      { label: '控制', value: 'control' },
      { label: '实验', value: 'exp', disabled: true }
    ]"
  >
    <template #default="{ active }">
      当前标签：{{ active }}
    </template>
  </mc-button-tabs>
</template>
```

## 带标题

<div class="mc-demo mc-demo--column">
  <mc-button-tabs
    v-model="titleTab"
    title="个人中心"
    :items="[
      { label: '资料', value: 'profile' },
      { label: '皮肤', value: 'skin' },
      { label: '好友', value: 'friends' }
    ]"
  />
  <p style="color:#b1b2b5;font-size:12px;margin:8px 0 0;text-align:center">
    当前选中：<strong style="color:#ffffff">{{ titleTab }}</strong>
  </p>
</div>

```vue
<mc-button-tabs
  v-model="titleTab"
  title="个人中心"
  :items="[
    { label: '资料', value: 'profile' },
    { label: '皮肤', value: 'skin' },
    { label: '好友', value: 'friends' }
  ]"
/>
```

通过 `title` 属性在组件左上角放置标题文本，标题不占用按钮区域。

## 外观说明

<div class="mc-demo mc-demo--column">
  <mc-button-tabs
    v-model="side"
    :items="[
      { label: '资料', value: 'profile' },
      { label: '皮肤', value: 'skin' },
      { label: '好友', value: 'friends' }
    ]"
  />
  <p style="color:#b1b2b5;font-size:12px;margin:8px 0 0;text-align:center">
    当前选中：<strong style="color:#ffffff">{{ side }}</strong>
  </p>
</div>

- **未选中** — `normal_btn` 灰色按钮，带 Minecraft 立体阴影
- **选中** — `primary_btn` 绿色按钮，呈现**按下态**（整体下沉、阴影变平），底部居中白色横条

## 自定义颜色

每个标签项可通过 `bgcolor` 指定按钮背景色，该项的选中/未选中按钮都会使用该颜色。

<div class="mc-demo mc-demo--column">
  <mc-button-tabs
    v-model="colorTab"
    :items="[
      { label: '主世界', value: 'world', bgcolor: '#5b9a3f' },
      { label: '下界', value: 'nether', bgcolor: '#b02e2e' },
      { label: '末地', value: 'end', bgcolor: '#d4c43a',disabled: true }
    ]"
  >
    <template #default="{ active }">
      当前维度：{{ active }}
    </template>
  </mc-button-tabs>
</div>

```vue
<mc-button-tabs
  v-model="colorTab"
  :items="[
    { label: '主世界', value: 'world', bgcolor: '#5b9a3f' },
    { label: '下界', value: 'nether', bgcolor: '#b02e2e' },
    { label: '末地', value: 'end', bgcolor: '#d4c43a',disabled: true }
  ]"
/>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `items` | `McButtonTabItem[]` | `[]` | 标签项 `{ label, value, disabled?, bgcolor? }` |
| `modelValue` | `string \| number` | `''` | 当前选中值（v-model） |
| `title` | `string` | `''` | 左上角标题 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string \| number` | v-model 更新 |
| `change` | `string \| number` | 选中项变化 |

## Slots

| 名称 | 说明 |
|---|---|
| `default` | 面板内容，插槽参数 `{ active }` |
