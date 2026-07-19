# Checkbox 复选框

<script setup>
import { ref } from 'vue'
const a = ref(true)
const b = ref(false)
const cb1 = ref(true)
const cb2 = ref(true)
const cb3 = ref(true)
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

## 自定义颜色

通过 `bgcolor` 属性设置勾选时的背景色，覆盖默认绿色，hover 时自动变暗。

<div class="mc-demo">
  <mc-checkbox v-model="cb1" bgcolor="#2E6BE5" />
  <mc-checkbox v-model="cb2" bgcolor="#9a3f3f" />
  <mc-checkbox v-model="cb3" bgcolor="#ff8800" />
</div>

```html
<mc-checkbox v-model="checked" bgcolor="#2E6BE5" />
<mc-checkbox v-model="checked" bgcolor="#9a3f3f" />
<mc-checkbox v-model="checked" bgcolor="#ff8800" />
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | 勾选状态（v-model） |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `bgcolor` | `string` | `''` | 勾选时的自定义背景色 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `boolean` | v-model 更新 |
| `change` | `boolean` | 值变化（含点击音效 `click`） |
