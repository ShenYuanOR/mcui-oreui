<script setup>
import { ref } from 'vue'

const mode = ref(null)
const options = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
  { title: '旁观（不可用）', value: 'spectator', disabled: true },
]
</script>

# Select

## 选择与字段状态

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-select v-model="mode" label="游戏模式" :options="options" required hint="使用方向键浏览" />
  <mc-select model-value="creative" label="只读模式" :options="options" readonly />
  <mc-select label="错误状态" :options="options" error-messages="请选择游戏模式" />
  <mc-select label="禁用状态" :options="options" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const mode = ref(null)
const options = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
  { title: '旁观（不可用）', value: 'spectator', disabled: true },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-select v-model="mode" label="游戏模式" :options="options" required hint="使用方向键浏览" />
    <mc-select model-value="creative" label="只读模式" :options="options" readonly />
    <mc-select label="错误状态" :options="options" error-messages="请选择游戏模式" />
    <mc-select label="禁用状态" :options="options" disabled />
  </div>
</template>
```

Select 使用 Connected Overlay，默认 Teleport 到 `body`，可避开容器裁剪并在边缘翻转。支持方向键、Home、End、Enter、Space 与 Escape。需要输入搜索时请使用 [Autocomplete](./autocomplete)。

| Prop                                                                            | 类型                                           | 说明                  |
| ------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------- |
| `modelValue`                                                                    | `string \| number \| boolean \| null`          | 直接绑定 option value |
| `options`                                                                       | `(primitive \| { title, value, disabled? })[]` | 选项                  |
| `rules`、`required`、`disabled`、`readonly`、`errorMessages`、`validateOn`      | 统一表单契约                                   | 校验与状态            |
| 事件：`update:modelValue`、`change`。`option` 插槽获得 `{ option, selected }`。 |
