<script setup>
import { ref } from 'vue'
const page = ref(1)
</script>

# Pagination

用于在分页数据间导航，支持紧凑页码、首尾页按钮和完整键盘操作。

## 页码与禁用状态

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

| Prop            | 类型      | 默认    |
| --------------- | --------- | ------- |
| `modelValue`    | `number`  | `1`     |
| `length`        | `number`  | `1`     |
| `totalVisible`  | `number`  | `7`     |
| `showFirstLast` | `boolean` | `false` |
| `disabled`      | `boolean` | `false` |

事件：`update:modelValue`、`change`。支持左右方向键、Home、End 与 RTL；导航名称直接使用标准 `aria-label`。
