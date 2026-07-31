<script setup>
import { computed, ref } from 'vue'
const selected = ref([])
const options = ref({ page: 1, itemsPerPage: 2, sortBy: [], search: '' })
const headers = [{ title:'名称', key:'name' }, { title:'分数', key:'score' }]
const items = [{ id:1, name:'Alex', score:2 }, { id:2, name:'Steve', score:5 }, { id:3, name:'Creeper', score:1 }]
const serverOptions = ref({ page: 1, itemsPerPage: 2, sortBy: [], search: '' })
const serverLoading = ref(false)
const serverSource = [
  { id: 1, name: 'Alex', score: 2 },
  { id: 2, name: 'Steve', score: 5 },
  { id: 3, name: 'Creeper', score: 1 },
  { id: 4, name: 'Enderman', score: 8 },
  { id: 5, name: 'Zombie', score: 3 },
]
const serverItems = computed(() => {
  const start = (serverOptions.value.page - 1) * serverOptions.value.itemsPerPage
  return serverSource.slice(start, start + serverOptions.value.itemsPerPage)
})
function requestServerData() {
  serverLoading.value = true
  window.setTimeout(() => (serverLoading.value = false), 600)
}
</script>

# DataTable

提供客户端或服务端数据模式、搜索、稳定多列排序、分页与行选择。

## 客户端排序、分页与选择

<div class="mc-demo mc-demo--column" style="width:100%"><mc-data-table v-model="selected" v-model:options="options" :headers="headers" :items="items" show-select><template #item.name="{ value }"><strong>{{ value }}</strong></template></mc-data-table></div>

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
const selected = ref([])
const options = ref({ page: 1, itemsPerPage: 2, sortBy: [], search: '' })
const headers = [
  { title: '名称', key: 'name' },
  { title: '分数', key: 'score' },
]
const items = [
  { id: 1, name: 'Alex', score: 2 },
  { id: 2, name: 'Steve', score: 5 },
  { id: 3, name: 'Creeper', score: 1 },
]
const serverOptions = ref({ page: 1, itemsPerPage: 2, sortBy: [], search: '' })
const serverLoading = ref(false)
const serverSource = [
  { id: 1, name: 'Alex', score: 2 },
  { id: 2, name: 'Steve', score: 5 },
  { id: 3, name: 'Creeper', score: 1 },
  { id: 4, name: 'Enderman', score: 8 },
  { id: 5, name: 'Zombie', score: 3 },
]
const serverItems = computed(() => {
  const start = (serverOptions.value.page - 1) * serverOptions.value.itemsPerPage
  return serverSource.slice(start, start + serverOptions.value.itemsPerPage)
})
function requestServerData() {
  serverLoading.value = true
  window.setTimeout(() => (serverLoading.value = false), 600)
}
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-data-table v-model="selected" v-model:options="options" :headers="headers" :items="items" show-select
      ><template #item.name="{ value }"
        ><strong>{{ value }}</strong></template
      ></mc-data-table
    >
  </div>
</template>
```

## Server 模式

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-data-table
    mode="server"
    v-model:options="serverOptions"
    :headers="headers"
    :items="serverItems"
    :items-length="serverSource.length"
    :loading="serverLoading"
    @update:options="requestServerData"
  />
  <mc-button size="small" @click="requestServerData">模拟服务端刷新</mc-button>
</div>

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
const selected = ref([])
const options = ref({ page: 1, itemsPerPage: 2, sortBy: [], search: '' })
const headers = [
  { title: '名称', key: 'name' },
  { title: '分数', key: 'score' },
]
const items = [
  { id: 1, name: 'Alex', score: 2 },
  { id: 2, name: 'Steve', score: 5 },
  { id: 3, name: 'Creeper', score: 1 },
]
const serverOptions = ref({ page: 1, itemsPerPage: 2, sortBy: [], search: '' })
const serverLoading = ref(false)
const serverSource = [
  { id: 1, name: 'Alex', score: 2 },
  { id: 2, name: 'Steve', score: 5 },
  { id: 3, name: 'Creeper', score: 1 },
  { id: 4, name: 'Enderman', score: 8 },
  { id: 5, name: 'Zombie', score: 3 },
]
const serverItems = computed(() => {
  const start = (serverOptions.value.page - 1) * serverOptions.value.itemsPerPage
  return serverSource.slice(start, start + serverOptions.value.itemsPerPage)
})
function requestServerData() {
  serverLoading.value = true
  window.setTimeout(() => (serverLoading.value = false), 600)
}
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-data-table
      mode="server"
      v-model:options="serverOptions"
      :headers="headers"
      :items="serverItems"
      :items-length="serverSource.length"
      :loading="serverLoading"
      @update:options="requestServerData"
    />
    <mc-button size="small" @click="requestServerData">模拟服务端刷新</mc-button>
  </div>
</template>
```

组件不发起请求，只输出 `{ page, itemsPerPage, sortBy, search }`；请求、缓存和取消由应用负责。

## Props、事件与插槽

| Prop                       | 类型                                      | 默认       | 说明                 |
| -------------------------- | ----------------------------------------- | ---------- | -------------------- |
| `headers`                  | `{ title,key,sortable?,align?,width? }[]` | 必填       | 列定义               |
| `items`                    | `Record<string, unknown>[]`               | 必填       | 当前数据             |
| `itemKey`                  | `string \| function`                      | `id`       | 行键                 |
| `options`                  | `{ page, itemsPerPage, sortBy, search }`  | 内置默认值 | 唯一表格状态         |
| `showSelect`、`modelValue` | -                                         | -          | 行键选择             |
| `mode`                     | `client \| server`                        | `client`   | 数据模式             |
| `itemsLength`、`loading`   | -                                         | -          | 服务端总数与加载状态 |

字段插槽 `item.<key>` 获得 `{ item, value, index }`，另有 `loading`、`no-data`。表格状态只发出 `update:options`；选择状态发出 `update:modelValue`、`change`。
