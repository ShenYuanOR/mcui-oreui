# Progress 进度条

Minecraft 风格进度条，适合加载资源、世界生成、下载与提交状态。

<script setup>
import { ref } from 'vue'
const value = ref(64)
</script>

## 基础用法

<div class="mc-demo mc-demo--column">
  <mc-progress :value="value" label="正在生成世界" />
  <mc-slider v-model="value" :min="0" :max="100" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref(64)
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-progress :value="value" label="正在生成世界" />
    <mc-slider v-model="value" :min="0" :max="100" />
  </div>
</template>
```

## 状态

<div class="mc-demo mc-demo--column">
  <mc-progress :value="80" label="资源加载" variant="success" />
  <mc-progress :value="35" label="连接失败" variant="error" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref(64)
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-progress :value="80" label="资源加载" variant="success" />
    <mc-progress :value="35" label="连接失败" variant="error" />
  </div>
</template>
```

## 不确定进度

<div class="mc-demo mc-demo--column">
  <mc-progress label="正在搜索服务器" indeterminate />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref(64)
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-progress label="正在搜索服务器" indeterminate />
  </div>
</template>
```

## 自定义颜色

通过 `color` 属性设置进度条颜色，设置后 `variant` 颜色不再生效。

<div class="mc-demo mc-demo--column">
  <mc-progress :value="64" label="下载资源包" color="#2E6BE5" />
  <mc-progress :value="64" label="加载世界" color="#9a3f3f" />
  <mc-progress :value="64" label="提交表单" color="#ff8800" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref(64)
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-progress :value="64" label="下载资源包" color="#2E6BE5" />
    <mc-progress :value="64" label="加载世界" color="#9a3f3f" />
    <mc-progress :value="64" label="提交表单" color="#ff8800" />
  </div>
</template>
```

## Props

| 名称            | 类型                               | 默认     | 说明                                      |
| --------------- | ---------------------------------- | -------- | ----------------------------------------- |
| `value`         | `number`                           | `0`      | 当前进度值                                |
| `max`           | `number`                           | `100`    | 最大值                                    |
| `label`         | `string`                           | -        | 左侧说明文本                              |
| `showValue`     | `boolean`                          | `true`   | 是否显示百分比                            |
| `indeterminate` | `boolean`                          | `false`  | 是否为不确定进度                          |
| `variant`       | `'normal' \| 'success' \| 'error'` | `normal` | 语义状态                                  |
| `color`         | `string`                           | -        | 自定义进度条颜色，设置后 variant 颜色失效 |
