# Switch 开关

支持点击与拖动切换，带 Minecraft 弹跳动画。

<script setup>
import { ref } from 'vue'
const on = ref(true)
const off = ref(false)
const sc1 = ref(true)
const sc2 = ref(true)
const sc3 = ref(true)
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

## 自定义图标

通过 `onIcon` 和 `offIcon` 属性可自定义开关两侧的内嵌图标，传入 SVG/图片 URL 路径。不传则使用默认点状图标。

<div class="mc-demo">
  <mc-switch v-model="on" on-icon="/mcui-oreui/eye.svg" off-icon="/mcui-oreui/locked.svg" />
  <mc-switch v-model="off" on-icon="/mcui-oreui/eye.svg" off-icon="/mcui-oreui/locked.svg" />
  <span style="color:#fff">on = {{ on }}</span>
</div>

```html
<mc-switch
  v-model="enabled"
  on-icon="/mcui-oreui/eye.svg"
  off-icon="/mcui-oreui/locked.svg"
/>
```

## 自定义颜色

通过 `bgcolor` 属性设置开启时的背景色，覆盖默认绿色。

<div class="mc-demo">
  <mc-switch v-model="sc1" bgcolor="#2E6BE5" />
  <mc-switch v-model="sc2" bgcolor="#9a3f3f" />
  <mc-switch v-model="sc3" bgcolor="#ff8800" />
</div>

```html
<mc-switch v-model="enabled" bgcolor="#2E6BE5" />
<mc-switch v-model="enabled" bgcolor="#9a3f3f" />
<mc-switch v-model="enabled" bgcolor="#ff8800" />
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | 开关状态（v-model） |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `onIcon` | `string` | `''` | 自定义开启侧图标 URL；置空使用默认 |
| `offIcon` | `string` | `''` | 自定义关闭侧图标 URL；置空使用默认 |
| `bgcolor` | `string` | `''` | 开启时的自定义背景色 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `boolean` | v-model 更新 |
| `change` | `boolean` | 状态变化（含 `click` 音效与弹跳动画） |

支持鼠标/触摸拖动：水平拖动超过 10px 即按方向切换。
