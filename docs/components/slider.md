<script setup>
import { ref } from 'vue'

const value = ref(40)
const verticalValue = ref(65)
</script>

# Slider 滑块

## 基础用法

<div class="mc-demo mc-demo--column" style="width:360px">
  <mc-slider v-model="value" label="音量" :step="5" show-value />
  <mc-slider :model-value="70" label="自定义颜色" color="#2e6be5" show-value readonly />
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

## 验证机制

滑块支持 `required`、`rules`、`errorMessages` 与 `validateOn`。

<div class="mc-demo mc-demo--column" style="width:360px"><mc-slider :model-value="20" label="校验错误" error-messages="数值过低" show-value /></div>

```vue
<script setup lang="ts"></script>
<template>
  <div class="mc-demo mc-demo--column" style="width:360px">
    <mc-slider :model-value="20" label="校验错误" error-messages="数值过低" show-value />
  </div>
</template>
```

## API

### Props

| 名称            | 类型                              | 默认           | 说明                                            |
| --------------- | --------------------------------- | -------------- | ----------------------------------------------- |
| `modelValue`    | `number`                          | `0`            | 当前数值，支持通过 `v-model` 双向绑定。         |
| `min`           | `number`                          | `0`            | 可选择的最小值。                                |
| `max`           | `number`                          | `100`          | 可选择的最大值。                                |
| `step`          | `number`                          | `1`            | 每次拖动或键盘操作的数值步长。                  |
| `vertical`      | `boolean`                         | `false`        | 是否改为纵向滑块布局。                          |
| `showValue`     | `boolean`                         | `false`        | 是否在标签旁显示当前数值。                      |
| `color`         | `string`                          | -              | 自定义已完成轨道与手柄的强调色。                |
| `label`         | `string`                          | -              | 字段标签。                                      |
| `description`   | `string`                          | -              | 显示在滑块前的补充说明。                        |
| `hint`          | `string`                          | -              | 无错误时显示的辅助提示。                        |
| `disabled`      | `boolean`                         | `false`        | 是否禁用滑块。                                  |
| `readonly`      | `boolean`                         | `false`        | 是否只读展示并阻止数值变化。                    |
| `required`      | `boolean`                         | `false`        | 是否启用必填验证并接入 `McForm`。               |
| `rules`         | `McRule<number>[]`                | `[]`           | 字段验证规则列表，规则可同步或异步返回结果。    |
| `errorMessages` | `string \| string[]`              | -              | 外部错误消息；提供后直接显示为错误状态。        |
| `validateOn`    | `input \| blur \| submit \| lazy` | 继承 / `input` | 覆盖字段的验证触发时机；未提供时继承 `McForm`。 |
| `id`            | `string`                          | 自动生成       | 原生 range 与字段辅助文本关联所用的 id。        |

事件：`update:modelValue`、`change`。可访问名称和值文本直接使用标准 `aria-label` 与 `aria-valuetext` Attr。
