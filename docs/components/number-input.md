<script setup>
import { ref } from 'vue'
const players = ref(4)
</script>

# NumberInput

带步进按钮的数值输入，编辑期间保留临时文本，Enter 或失焦时解析并夹取范围。

## 范围与字段状态

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-number-input v-model="players" label="最大玩家数" :min="1" :max="30" :step="1" />
  <mc-number-input :model-value="8" label="只读数量" readonly />
  <mc-number-input :model-value="0" label="无效数量" error-messages="至少需要 1 名玩家" />
  <mc-number-input :model-value="4" label="禁用数量" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const players = ref(4)
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-number-input v-model="players" label="最大玩家数" :min="1" :max="30" :step="1" />
    <mc-number-input :model-value="8" label="只读数量" readonly />
    <mc-number-input :model-value="0" label="无效数量" error-messages="至少需要 1 名玩家" />
    <mc-number-input :model-value="4" label="禁用数量" disabled />
  </div>
</template>
```

| Prop          | 类型             | 默认        |
| ------------- | ---------------- | ----------- |
| `modelValue`  | `number \| null` | `null`      |
| `min`、`max`  | `number`         | `±Infinity` |
| `step`        | `number`         | `1`         |
| `placeholder` | `string`         | -           |

上下方向键和两侧按钮按 step 增减。事件：`update:modelValue`、`change`；暴露 `commit()`、`increment()`、`decrement()` 与校验方法。
