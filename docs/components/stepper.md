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
    <mc-stepper v-model="step" :items="items" linear
      ><template #default="{ item }"
        ><p>当前：{{ item.title }}</p></template
      ></mc-stepper
    >
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
      <template #default="{ item }"
        ><p>可直接切换：{{ item.title }}</p></template
      >
    </mc-stepper>
  </div>
</template>
```

| Prop         | 类型                                              | 默认    |
| ------------ | ------------------------------------------------- | ------- |
| `items`      | `{ title,value,optional?,editable?,disabled? }[]` | 必填    |
| `modelValue` | `string \| number`                                | `''`    |
| `linear`     | `boolean`                                         | `false` |

默认内容插槽获得 `{ item, index }`；`item.<value>` 可提供字段级内容；`actions` 获得 `{ item, index, next, previous }`。事件：`update:modelValue`、`change`。

步骤 `ol/li` 隔离宿主列表缩进和相邻项 margin，所有步骤按钮保持顶部对齐。
