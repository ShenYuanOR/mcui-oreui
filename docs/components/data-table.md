<script setup>
import { computed, ref } from 'vue'
const selected = ref([])
const options = ref({ page: 1, itemsPerPage: 10, sortBy: [], search: '' })
const headers = [
  { title: '名称', key: 'name' },
  { title: '模式', key: 'mode' },
  { title: '状态', key: 'status' },
  { title: '分数', key: 'score' },
]
const items = [
  { id: 1, name: 'Alex', mode: '生存', status: '在线', score: 1280 },
  { id: 2, name: 'Steve', mode: '创造', status: '在线', score: 965 },
  { id: 3, name: 'Sunny', mode: '冒险', status: '暂离', score: 842 },
  { id: 4, name: 'Robin', mode: '生存', status: '离线', score: 760 },
  { id: 5, name: 'Kai', mode: '旁观', status: '在线', score: 694 },
  { id: 6, name: 'Luna', mode: '创造', status: '在线', score: 618 },
  { id: 7, name: 'Noah', mode: '生存', status: '暂离', score: 557 },
  { id: 8, name: 'Ember', mode: '冒险', status: '离线', score: 481 },
  { id: 9, name: 'Mia', mode: '生存', status: '在线', score: 436 },
  { id: 10, name: 'Owen', mode: '创造', status: '离线', score: 390 },
  { id: 11, name: 'Ivy', mode: '旁观', status: '暂离', score: 352 },
  { id: 12, name: 'Leo', mode: '生存', status: '在线', score: 308 },
]
const serverOptions = ref({ page: 1, itemsPerPage: 10, sortBy: [], search: '' })
const serverLoading = ref(false)
const loadingMode = ref('auto')
const serverLoadingHeight = computed(() =>
  loadingMode.value === 'px' ? '320px' : loadingMode.value === 'rows' ? '6L' : undefined,
)
const serverLoadingAutoHeight = computed(() => loadingMode.value === 'auto')
const serverSource = [
  { id: 101, name: 'River', mode: '生存', status: '在线', score: 1420 },
  { id: 102, name: 'Hazel', mode: '创造', status: '在线', score: 1315 },
  { id: 103, name: 'Avery', mode: '冒险', status: '暂离', score: 1190 },
  { id: 104, name: 'Rowan', mode: '生存', status: '在线', score: 1085 },
  { id: 105, name: 'Sage', mode: '旁观', status: '离线', score: 1012 },
  { id: 106, name: 'Maple', mode: '创造', status: '在线', score: 936 },
  { id: 107, name: 'Ash', mode: '生存', status: '暂离', score: 884 },
  { id: 108, name: 'Sky', mode: '冒险', status: '在线', score: 817 },
  { id: 109, name: 'Reed', mode: '生存', status: '离线', score: 742 },
  { id: 110, name: 'Wren', mode: '创造', status: '在线', score: 679 },
  { id: 111, name: 'Jade', mode: '旁观', status: '暂离', score: 604 },
  { id: 112, name: 'Finn', mode: '生存', status: '在线', score: 538 },
  { id: 113, name: 'Nova', mode: '冒险', status: '离线', score: 472 },
  { id: 114, name: 'Pine', mode: '生存', status: '在线', score: 415 },
]
const serverItems = computed(() => {
  const start = (serverOptions.value.page - 1) * serverOptions.value.itemsPerPage
  return serverSource.slice(start, start + serverOptions.value.itemsPerPage)
})
function requestServerData() {
  serverLoading.value = true
  window.setTimeout(() => (serverLoading.value = false), 1200)
}
function refreshServer(mode) {
  loadingMode.value = mode
  requestServerData()
}
</script>

# DataTable

提供客户端或服务端数据模式、搜索、稳定多列排序、分页与行选择。

## 基础用法

<div class="mc-demo mc-demo--column" style="width:100%"><mc-data-table v-model="selected" v-model:options="options" :headers="headers" :items="items" show-select><template #item.name="{ value }"><strong>{{ value }}</strong></template></mc-data-table></div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selected = ref([])
const options = ref({ page: 1, itemsPerPage: 10, sortBy: [], search: '' })
const headers = [
  { title: '名称', key: 'name' },
  { title: '模式', key: 'mode' },
  { title: '状态', key: 'status' },
  { title: '分数', key: 'score' },
]
const items = [
  { id: 1, name: 'Alex', mode: '生存', status: '在线', score: 1280 },
  { id: 2, name: 'Steve', mode: '创造', status: '在线', score: 965 },
  { id: 3, name: 'Sunny', mode: '冒险', status: '暂离', score: 842 },
  { id: 4, name: 'Robin', mode: '生存', status: '离线', score: 760 },
  { id: 5, name: 'Kai', mode: '旁观', status: '在线', score: 694 },
  { id: 6, name: 'Luna', mode: '创造', status: '在线', score: 618 },
  { id: 7, name: 'Noah', mode: '生存', status: '暂离', score: 557 },
  { id: 8, name: 'Ember', mode: '冒险', status: '离线', score: 481 },
  { id: 9, name: 'Mia', mode: '生存', status: '在线', score: 436 },
  { id: 10, name: 'Owen', mode: '创造', status: '离线', score: 390 },
  { id: 11, name: 'Ivy', mode: '旁观', status: '暂离', score: 352 },
  { id: 12, name: 'Leo', mode: '生存', status: '在线', score: 308 },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-data-table v-model="selected" v-model:options="options" :headers="headers" :items="items" show-select>
      <template #item.name="{ value }">
        <strong>{{ value }}</strong>
      </template>
    </mc-data-table>
  </div>
</template>
```

## Server 模式

加载时会保留上一批数据的表体高度，避免请求切换期间表格和页面上下抽动。

- `loadingAutoHeight` 默认开启，读取刷新前真实表体高度。
- `loadingHeight` 可传数字或 `320px` 表示像素，也可传 `6L` 表示 6 行；显式高度优先于自动高度。

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-data-table
    mode="server"
    v-model:options="serverOptions"
    :headers="headers"
    :items="serverItems"
    :items-length="serverSource.length"
    :loading="serverLoading"
    :loading-height="serverLoadingHeight"
    :loading-auto-height="serverLoadingAutoHeight"
    @update:options="requestServerData"
  />
  <div style="display:flex;flex-wrap:wrap;gap:8px">
    <mc-button size="small" @click="refreshServer('auto')">自动高度刷新</mc-button>
    <mc-button size="small" @click="refreshServer('px')">320px 刷新</mc-button>
    <mc-button size="small" @click="refreshServer('rows')">6 行刷新</mc-button>
  </div>
</div>

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
const headers = [
  { title: '名称', key: 'name' },
  { title: '模式', key: 'mode' },
  { title: '状态', key: 'status' },
  { title: '分数', key: 'score' },
]
const serverOptions = ref({ page: 1, itemsPerPage: 10, sortBy: [], search: '' })
const serverLoading = ref(false)
const loadingMode = ref<'auto' | 'px' | 'rows'>('auto')
const serverLoadingHeight = computed(() =>
  loadingMode.value === 'px' ? '320px' : loadingMode.value === 'rows' ? '6L' : undefined,
)
const serverLoadingAutoHeight = computed(() => loadingMode.value === 'auto')
const serverSource = [
  { id: 101, name: 'River', mode: '生存', status: '在线', score: 1420 },
  { id: 102, name: 'Hazel', mode: '创造', status: '在线', score: 1315 },
  { id: 103, name: 'Avery', mode: '冒险', status: '暂离', score: 1190 },
  { id: 104, name: 'Rowan', mode: '生存', status: '在线', score: 1085 },
  { id: 105, name: 'Sage', mode: '旁观', status: '离线', score: 1012 },
  { id: 106, name: 'Maple', mode: '创造', status: '在线', score: 936 },
  { id: 107, name: 'Ash', mode: '生存', status: '暂离', score: 884 },
  { id: 108, name: 'Sky', mode: '冒险', status: '在线', score: 817 },
  { id: 109, name: 'Reed', mode: '生存', status: '离线', score: 742 },
  { id: 110, name: 'Wren', mode: '创造', status: '在线', score: 679 },
  { id: 111, name: 'Jade', mode: '旁观', status: '暂离', score: 604 },
  { id: 112, name: 'Finn', mode: '生存', status: '在线', score: 538 },
  { id: 113, name: 'Nova', mode: '冒险', status: '离线', score: 472 },
  { id: 114, name: 'Pine', mode: '生存', status: '在线', score: 415 },
]
const serverItems = computed(() => {
  const start = (serverOptions.value.page - 1) * serverOptions.value.itemsPerPage
  return serverSource.slice(start, start + serverOptions.value.itemsPerPage)
})
function requestServerData() {
  serverLoading.value = true
  window.setTimeout(() => (serverLoading.value = false), 1200)
}
function refreshServer(mode: 'auto' | 'px' | 'rows') {
  loadingMode.value = mode
  requestServerData()
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
      :loading-height="serverLoadingHeight"
      :loading-auto-height="serverLoadingAutoHeight"
      @update:options="requestServerData"
    />
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <mc-button size="small" @click="refreshServer('auto')">自动高度刷新</mc-button>
      <mc-button size="small" @click="refreshServer('px')">320px 刷新</mc-button>
      <mc-button size="small" @click="refreshServer('rows')">6 行刷新</mc-button>
    </div>
  </div>
</template>
```

组件不发起请求，只输出 `{ page, itemsPerPage, sortBy, search }`；请求、缓存和取消由应用负责。

## 空状态

数据为空时显示内置空状态。使用 `noDataText` 修改提示文字，或通过 `no-data` 插槽替换完整内容。

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-data-table :headers="headers" :items="[]" no-data-text="暂无玩家数据" />
</div>

```vue
<script setup lang="ts">
const headers = [
  { title: '名称', key: 'name' },
  { title: '模式', key: 'mode' },
  { title: '状态', key: 'status' },
  { title: '分数', key: 'score' },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-data-table :headers="headers" :items="[]" no-data-text="暂无玩家数据" />
  </div>
</template>
```

## API

### Props

| 名称                  | 类型                                          | 默认             | 说明                                                                              |
| --------------------- | --------------------------------------------- | ---------------- | --------------------------------------------------------------------------------- |
| `headers`             | `{ title,key,sortable?,align?,width? }[]`     | 必填             | 列定义，控制标题、字段键、排序能力、对齐方式和可选宽度。                          |
| `items`               | `Record<string, unknown>[]`                   | 必填             | 当前页或完整数据列表，具体含义由 `mode` 决定。                                    |
| `itemKey`             | `string \| ((item) => unknown)`               | `id`             | 从数据项中取得稳定行键的字段名或函数。对象键用 `Object.is` 比较，不能放进 `Set`。 |
| `options`             | `{ page, itemsPerPage, sortBy, search }`      | 内置默认值       | 分页、每页条数、排序和搜索组成的受控表格状态。                                    |
| `itemsPerPageOptions` | `number[]`                                    | `[10,25,50,100]` | 每页条数下拉框中的可选值。                                                        |
| `showSelect`          | `boolean`                                     | `false`          | 是否显示行选择框和表头全选框。                                                    |
| `modelValue`          | `unknown[]`                                   | `[]`             | 当前选中的行键列表，支持通过 `v-model` 双向绑定。                                 |
| `multiSort`           | `boolean`                                     | `false`          | 是否保留已有排序条件并允许多列排序。                                              |
| `mode`                | `client \| server`                            | `client`         | 客户端模式本地筛选、排序和分页；服务端模式只发出 options 更新。                   |
| `itemsLength`         | `number`                                      | `0`              | 服务端模式下的总数据条数，用于计算总页数。                                        |
| `loading`             | `boolean`                                     | `false`          | 是否显示加载态并保持稳定的表体高度。                                              |
| `loadingHeight`       | `number \| \`${number}px\` \| \`${number}L\`` | -                | 加载态固定高度；数字或 px 表示像素，`L` 表示可见数据行数。                        |
| `loadingAutoHeight`   | `boolean`                                     | `true`           | 未设置 `loadingHeight` 时，是否沿用加载前测得的表体高度。                         |
| `noDataText`          | `string`                                      | 本地化文案       | 没有可显示数据时使用的空状态文字。                                                |

字段插槽 `item.<key>` 获得 `{ item, value, index }`，另有 `loading`、`no-data`。表格状态只发出 `update:options`；选择状态发出 `update:modelValue`、`change`。
