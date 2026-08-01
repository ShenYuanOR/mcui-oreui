<script setup>
import { ref } from 'vue'
const step = ref('details')
const freeStep = ref('packs')
const items = [{ title:'详情', value:'details' }, { title:'资源包', value:'packs', optional:true }, { title:'确认', value:'confirm' }]
</script>

# Stepper

将线性或可自由跳转的多步骤流程组织为可访问的步骤导航。

## 线性流程

<div class="mc-demo mc-demo--column" style="width:100%"><mc-stepper v-model="step" :items="items" linear><template #default="{ item }"><p>当前：{{ item.title }}</p></template></mc-stepper></div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const step = ref('details')
const freeStep = ref('packs')
const items = [
  { title: '详情', value: 'details' },
  { title: '资源包', value: 'packs', optional: true },
  { title: '确认', value: 'confirm' },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-stepper v-model="step" :items="items" linear>
      <template #default="{ item }">
        <p>当前：{{ item.title }}</p>
      </template>
    </mc-stepper>
  </div>
</template>
```

## 非线性流程

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-stepper v-model="freeStep" :items="items">
    <template #default="{ item }"><p>可直接切换：{{ item.title }}</p></template>
  </mc-stepper>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const step = ref('details')
const freeStep = ref('packs')
const items = [
  { title: '详情', value: 'details' },
  { title: '资源包', value: 'packs', optional: true },
  { title: '确认', value: 'confirm' },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-stepper v-model="freeStep" :items="items">
      <template #default="{ item }">
        <p>可直接切换：{{ item.title }}</p>
      </template>
    </mc-stepper>
  </div>
</template>
```

## Props

| 名称         | 类型                                              | 默认    | 说明                                                     |
| ------------ | ------------------------------------------------- | ------- | -------------------------------------------------------- |
| `items`      | `{ title,value,optional?,editable?,disabled? }[]` | 必填    | 步骤定义；包含标题、唯一值，以及可选、可编辑和禁用状态。 |
| `modelValue` | `string \| number`                                | `''`    | 当前步骤的 value，支持通过 `v-model` 双向绑定。          |
| `linear`     | `boolean`                                         | `false` | 是否限制用户只能访问已完成步骤和当前步骤的下一步。       |

默认内容插槽获得 `{ item, index }`；`item.<value>` 可提供字段级内容；`actions` 获得 `{ item, index, next, previous }`。事件：`update:modelValue`、`change`。

步骤头参考 Vuetify 的连续导航结构：每一步使用等高按钮、编号方块和标题区域，步骤之间用连接缝分隔；可选副标题固定在标题区域内，不会单独撑高某一步。步骤 `ol/li` 同时隔离宿主列表缩进和相邻项 margin。
