# Switch 开关

支持点击与拖动切换，带 Minecraft 弹跳动画。

<script setup>
import { ref } from 'vue'
const on = ref(true)
const off = ref(false)
</script>

<div class="mc-demo">
  <mc-switch v-model="on" />
  <mc-switch v-model="off" />
  <mc-switch :model-value="true" disabled />
  <span style="color:#fff">on = {{ on }}</span>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(true)
</script>

<template>
  <mc-switch v-model="enabled" @change="v => console.log(v)" />
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | 开关状态（v-model） |
| `disabled` | `boolean` | `false` | 是否禁用 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `boolean` | v-model 更新 |
| `change` | `boolean` | 状态变化（含 `click` 音效与弹跳动画） |

支持鼠标/触摸拖动：水平拖动超过 10px 即按方向切换。
