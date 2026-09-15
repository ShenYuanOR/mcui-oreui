<script setup>
import { ref } from 'vue'
const tab = ref('worlds')
const manualTab = ref('worlds')
const items = [{ label: '世界', value: 'worlds' }, { label: '服务器', value: 'servers' }, { label: '禁用', value: 'disabled', disabled: true }]
</script>

# Tabs 标签页

## 基础用法

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-tabs v-model="tab" :items="items"><div>当前面板：{{ tab }}</div></mc-tabs>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('worlds')
const manualTab = ref('worlds')
const items = [
  { label: '世界', value: 'worlds' },
  { label: '服务器', value: 'servers' },
  { label: '禁用', value: 'disabled', disabled: true },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-tabs v-model="tab" :items="items">
      <div>当前面板：{{ tab }}</div>
    </mc-tabs>
  </div>
</template>
```

## 纵向与手动激活

<div class="mc-demo" style="width:100%">
  <mc-tabs v-model="manualTab" :items="items" direction="vertical" activation="manual">
    <div>按方向键移动焦点，Enter 或 Space 激活：{{ manualTab }}</div>
  </mc-tabs>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('worlds')
const manualTab = ref('worlds')
const items = [
  { label: '世界', value: 'worlds' },
  { label: '服务器', value: 'servers' },
  { label: '禁用', value: 'disabled', disabled: true },
]
</script>

<template>
  <div class="mc-demo" style="width:100%">
    <mc-tabs v-model="manualTab" :items="items" direction="vertical" activation="manual">
      <div>按方向键移动焦点，Enter 或 Space 激活：{{ manualTab }}</div>
    </mc-tabs>
  </div>
</template>
```

Tabs 实现 roving tabindex、方向键、Home/End、禁用项跳过，以及 tab 与 tabpanel 的 `aria-controls` / `aria-labelledby` 关联。`activation="automatic | manual"` 控制聚焦时是否立即切换。

## API

### Props

| 名称         | 类型                            | 默认         | 说明                                                |
| ------------ | ------------------------------- | ------------ | --------------------------------------------------- |
| `modelValue` | `string \| number`              | `''`         | 当前标签页的 value，支持通过 `v-model` 双向绑定。   |
| `items`      | `{ label, value, disabled? }[]` | `[]`         | 标签页定义；每项包含标签、唯一值和可选禁用状态。    |
| `direction`  | `horizontal \| vertical`        | `horizontal` | 标签导航和内容区域的排列方向，同时决定方向键模型。  |
| `activation` | `automatic \| manual`           | `automatic`  | 聚焦标签时立即激活，或等待 Enter / Space 后再激活。 |

事件：`update:modelValue`、`change`。默认插槽显示当前标签对应的内容。`v-model` 对不上任何未禁用项时，不会伪装成选中第一项；面板保持隐藏，直到选出合法值。
