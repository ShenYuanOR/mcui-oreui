<script setup>
import { ref } from 'vue'
const mode = ref('survival')
const options = [
  { label: '生存', value: 'survival' },
  { label: '创造', value: 'creative' },
  { label: '冒险', value: 'adventure' },
  { label: '旁观', value: 'spectator', disabled: true },
]
</script>

# RadioGroup

使用 fieldset/legend 语义管理一组选项，并统一处理标签、校验和禁用状态。

## 方向与禁用项

<div class="mc-demo mc-demo--column">
  <mc-radio-group v-model="mode" label="默认游戏模式" direction="vertical" :options="options" />
  <span>当前：{{ mode }}</span>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
const options = [
  { label: '生存', value: 'survival' },
  { label: '创造', value: 'creative' },
  { label: '冒险', value: 'adventure' },
  { label: '旁观', value: 'spectator', disabled: true },
]
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-radio-group v-model="mode" label="默认游戏模式" direction="vertical" :options="options" />
    <span>当前：{{ mode }}</span>
  </div>
</template>
```

| Prop         | 类型                            | 默认         |
| ------------ | ------------------------------- | ------------ |
| `modelValue` | `string \| number \| boolean`   | `''`         |
| `options`    | `{ label, value, disabled? }[]` | `[]`         |
| `direction`  | `horizontal \| vertical`        | `horizontal` |
| `name`       | `string`                        | 自动生成     |

同时支持统一表单契约。默认插槽可替换 options，手工声明 [Radio](./radio) 子项。事件：`update:modelValue`、`change`。
