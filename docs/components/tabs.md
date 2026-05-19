# Tabs 标签页

用于设置页、分类页和背包分类等场景。

<script setup>
import { ref } from 'vue'
const tab = ref('video')
const side = ref('profile')
</script>

## 基础用法

<div class="mc-demo mc-demo--column">
  <mc-tabs
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
  </mc-tabs>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('video')
</script>

<template>
  <mc-tabs
    v-model="tab"
    :items="[
      { label: '视频', value: 'video' },
      { label: '音频', value: 'audio' },
      { label: '控制', value: 'control' }
    ]"
  >
    <template #default="{ active }">
      当前标签：{{ active }}
    </template>
  </mc-tabs>
</template>
```

## 垂直标签

<div class="mc-demo mc-demo--column">
  <mc-tabs
    v-model="side"
    direction="vertical"
    :items="[
      { label: '资料', value: 'profile' },
      { label: '皮肤', value: 'skin' },
      { label: '好友', value: 'friends' }
    ]"
  >
    <template #default="{ active }">
      面板：{{ active }}
    </template>
  </mc-tabs>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const side = ref('profile')
</script>

<template>
  <mc-tabs
    v-model="side"
    direction="vertical"
    :items="[
      { label: '资料', value: 'profile' },
      { label: '皮肤', value: 'skin' },
      { label: '好友', value: 'friends' }
    ]"
  >
    <template #default="{ active }">
      面板：{{ active }}
    </template>
  </mc-tabs>
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| number` | `''` | 当前激活项（v-model） |
| `items` | `McTabItem[]` | `[]` | 标签项 |
| `direction` | `'horizontal' \| 'vertical'` | `horizontal` | 排列方向 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string \| number` | v-model 更新 |
| `change` | `string \| number` | 激活项变化 |

## Slots

| 名称 | 说明 |
|---|---|
| `default` | 面板内容，插槽参数 `{ active }` |
