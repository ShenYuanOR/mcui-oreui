<script setup>
import { ref } from 'vue'
const mode = ref(null)
const options = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
  { title: '冒险', value: 'adventure' },
  { title: '旁观（不可用）', value: 'spectator', disabled: true },
]
</script>

# Autocomplete

可编辑的 combobox，输入时过滤选项；焦点始终留在真实输入框。

## 搜索与字段状态

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-autocomplete v-model="mode" label="搜索游戏模式" hint="输入文字筛选" :options="options" />
  <mc-autocomplete model-value="creative" label="只读模式" :options="options" readonly />
  <mc-autocomplete label="禁用模式" :options="options" disabled />
  <mc-autocomplete label="错误状态" :options="options" error-messages="请选择可用模式" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref(null)
const options = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
  { title: '冒险', value: 'adventure' },
  { title: '旁观（不可用）', value: 'spectator', disabled: true },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-autocomplete v-model="mode" label="搜索游戏模式" hint="输入文字筛选" :options="options" />
    <mc-autocomplete model-value="creative" label="只读模式" :options="options" readonly />
    <mc-autocomplete label="禁用模式" :options="options" disabled />
    <mc-autocomplete label="错误状态" :options="options" error-messages="请选择可用模式" />
  </div>
</template>
```

| Prop          | 类型                                           | 说明                  |
| ------------- | ---------------------------------------------- | --------------------- |
| `modelValue`  | `string \| number \| boolean \| null`          | 直接绑定 option value |
| `options`     | `(primitive \| { title, value, disabled? })[]` | 候选项                |
| `noFilter`    | `boolean`                                      | 关闭组件内本地过滤    |
| `placeholder` | `string`                                       | 输入占位文本          |

同时支持完整表单契约。事件：`update:modelValue`、`change`、`update:search`；`option` 插槽获得 `{ option, selected }`。
