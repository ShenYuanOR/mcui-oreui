<script setup>
import { ref } from 'vue'
const page = ref(1)
</script>

# Pagination

用于在分页数据间导航，支持紧凑页码、首尾页按钮和完整键盘操作。

## 基础用法

<div class="mc-demo mc-demo--column">
  <mc-pagination v-model="page" :length="12" :total-visible="7" show-first-last aria-label="世界列表分页" />
  <mc-pagination :model-value="3" :length="5" disabled aria-label="禁用分页" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-pagination v-model="page" :length="12" :total-visible="7" show-first-last aria-label="世界列表分页" />
    <mc-pagination :model-value="3" :length="5" disabled aria-label="禁用分页" />
  </div>
</template>
```

## API

### Props

| 名称            | 类型      | 默认    | 说明                                         |
| --------------- | --------- | ------- | -------------------------------------------- |
| `modelValue`    | `number`  | `1`     | 当前页码，支持通过 `v-model` 双向绑定。      |
| `length`        | `number`  | 必填    | 总页数；小于 1 时不会生成可选页码。          |
| `totalVisible`  | `number`  | `7`     | 最多显示的页码项数量，超出部分用省略号折叠。 |
| `showFirstLast` | `boolean` | `false` | 是否显示跳转到首页和末页的按钮。             |
| `disabled`      | `boolean` | `false` | 是否禁用全部分页操作。                       |

事件：`update:modelValue`、`change`。支持左右方向键、Home、End 与 RTL；导航名称直接使用标准 `aria-label`。
