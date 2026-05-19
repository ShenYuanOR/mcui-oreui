# Checkbox 复选框

<script setup>
import { ref } from 'vue'
const a = ref(true)
const b = ref(false)
</script>

<div class="mc-demo">
  <mc-checkbox v-model="a" />
  <mc-checkbox v-model="b" />
  <mc-checkbox :model-value="true" disabled />
  <span style="color:#fff">a = {{ a }}，b = {{ b }}</span>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(true)
</script>

<template>
  <mc-checkbox v-model="checked" />
  <mc-checkbox :model-value="true" disabled />
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | 勾选状态（v-model） |
| `disabled` | `boolean` | `false` | 是否禁用 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `boolean` | v-model 更新 |
| `change` | `boolean` | 值变化（含点击音效 `click`） |
