<script setup>
import { ref } from 'vue'
const description = ref('')
</script>

# Textarea

用于输入多行文本，保留适合阅读和编辑的顶部起始排版。

## 自适应与字段状态

<div class="mc-demo mc-demo--column" style="width:360px">
  <mc-textarea v-model="description" label="世界描述" description="显示在世界列表中" hint="最多 200 字" :max-length="200" auto-grow />
  <mc-textarea model-value="只读说明" label="只读内容" readonly />
  <mc-textarea label="错误内容" error-messages="描述不能为空" />
  <mc-textarea label="禁用内容" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const description = ref('')
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:360px">
    <mc-textarea
      v-model="description"
      label="世界描述"
      description="显示在世界列表中"
      hint="最多 200 字"
      :max-length="200"
      auto-grow
    />
    <mc-textarea model-value="只读说明" label="只读内容" readonly />
    <mc-textarea label="错误内容" error-messages="描述不能为空" />
    <mc-textarea label="禁用内容" disabled />
  </div>
</template>
```

| Prop         | 类型      | 默认        |
| ------------ | --------- | ----------- |
| `modelValue` | `string`  | `''`        |
| `rows`       | `number`  | `3`         |
| `autoGrow`   | `boolean` | `false`     |
| `maxLength`  | `number`  | `0`（不限） |

同时支持统一表单契约：`label`、`description`、`hint`、`disabled`、`readonly`、`required`、`rules`、`errorMessages`、`validateOn`、`id`。事件：`update:modelValue`、`change`。
