<script setup>
import { ref } from 'vue'

const value = ref(40)
const verticalValue = ref(65)
</script>

# Slider 滑块

## 数值与字段状态

<div class="mc-demo mc-demo--column" style="width:360px">
  <mc-slider v-model="value" label="音量" :step="5" show-value />
  <mc-slider :model-value="70" label="自定义颜色" color="#2e6be5" show-value readonly />
  <mc-slider :model-value="20" label="校验错误" error-messages="数值过低" show-value />
  <mc-slider :model-value="50" aria-label="禁用滑块" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(40)
const verticalValue = ref(65)
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:360px">
    <mc-slider v-model="value" label="音量" :step="5" show-value />
    <mc-slider :model-value="70" label="自定义颜色" color="#2e6be5" show-value readonly />
    <mc-slider :model-value="20" label="校验错误" error-messages="数值过低" show-value />
    <mc-slider :model-value="50" aria-label="禁用滑块" disabled />
  </div>
</template>
```

## 纵向布局

<div class="mc-demo" style="height:220px">
  <mc-slider v-model="verticalValue" vertical label="音乐" show-value />
  <mc-slider :model-value="35" vertical label="音效" color="#2e6be5" readonly show-value />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(40)
const verticalValue = ref(65)
</script>

<template>
  <div class="mc-demo" style="height:220px">
    <mc-slider v-model="verticalValue" vertical label="音乐" show-value />
    <mc-slider :model-value="35" vertical label="音效" color="#2e6be5" readonly show-value />
  </div>
</template>
```

Slider 保留 36px 高的透明原生 range 作为表单、指针和键盘交互层；可见部分使用独立的 Ore UI 轨道、进度填充和 20px 凸起像素手柄，因此不会退回 Chromium、Firefox 或 WebKit 的默认 range 外观。手柄与 12px 轨道的比例为 `20 / 12 ≈ 1.67`，贴近黄金比并保持整数像素；缩小的是视觉手柄，不会缩小拖动热区。支持 hover、active、focus-visible、disabled、readonly、error 和纵向布局，并补充 Home、End、PageUp、PageDown。

Props 包括 `modelValue`、`min`、`max`、`step`、`label`、`description`、`hint`、`disabled`、`readonly`、`required`、`rules`、`errorMessages`、`validateOn`、`id`、`vertical`、`showValue`、`color`。可访问名称和值文本直接使用标准 `aria-label` 与 `aria-valuetext` Attr。
