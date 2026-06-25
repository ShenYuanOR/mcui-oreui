# Slider 滑动条

支持连续（range）与分段（set）两种模式，支持拖动滑块、点击或拖动轨道、方向键。

<script setup>
import { ref } from 'vue'
const v1 = ref(50)
const v2 = ref(2)
</script>

## 连续滑块（range）

<div class="mc-demo mc-demo--column">
  <mc-slider v-model="v1" :min="0" :max="100" :step="5" type="range" />
  <span style="color:#fff">value = {{ v1 }}</span>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v1 = ref(50)
</script>

<template>
  <mc-slider v-model="v1" :min="0" :max="100" :step="5" type="range" />
</template>
```

## 分段滑块（set）

<div class="mc-demo mc-demo--column">
  <mc-slider v-model="v2" :min="0" :max="4" :segments="4" type="set" />
  <span style="color:#fff">value = {{ v2 }}</span>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v1 = ref(50)
const v2 = ref(2)
</script>

<template>
  <mc-slider v-model="v1" :min="0" :max="100" :step="5" type="range" />
  <mc-slider v-model="v2" :min="0" :max="4" :segments="4" type="set" />
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `number` | `0` | 当前值（v-model） |
| `min` / `max` | `number` | `0` / `100` | 取值范围 |
| `step` | `number` | `1` | range 步长（键盘） |
| `segments` | `number` | `4` | set 分段数 |
| `type` | `'range' \| 'set'` | `range` | 模式 |
| `showSegments` | `boolean` | `true` | 显示刻度/端点标签 |
| `customSegments` | `boolean` | `false` | 启用自定义分段值 |
| `segmentValues` | `(string\|number)[]` | `[]` | 自定义分段值（长度 `segments+1`） |
| `disabled` | `boolean` | `false` | 是否禁用 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `number` | v-model 更新 |
| `change` | `number` | 值变化 |
