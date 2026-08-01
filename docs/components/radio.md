# Radio

用于声明单个原生 radio 选项；声明式选项组请查看 [RadioGroup](./radio-group)。

<script setup>
import { ref } from 'vue'
const mode = ref('survival')
</script>

## 单个 Radio

<div class="mc-demo">
  <mc-radio v-model="mode" value="survival">生存</mc-radio>
  <mc-radio v-model="mode" value="creative">创造</mc-radio>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>

<template>
  <div class="mc-demo">
    <mc-radio v-model="mode" value="survival">生存</mc-radio>
    <mc-radio v-model="mode" value="creative">创造</mc-radio>
  </div>
</template>
```

## 旋转显示

设置 `rotate` 可将单选控件旋转 45 度，适合需要菱形视觉风格的场景。

<div class="mc-demo">
  <mc-radio v-model="mode" value="survival" rotate>生存</mc-radio>
  <mc-radio v-model="mode" value="creative" rotate>创造</mc-radio>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>

<template>
  <div class="mc-demo">
    <mc-radio v-model="mode" value="survival" rotate>生存</mc-radio>
    <mc-radio v-model="mode" value="creative" rotate>创造</mc-radio>
  </div>
</template>
```

## 自定义颜色

通过 `color` 属性设置选中时的背景色，覆盖默认绿色，hover 时自动变暗。

<div class="mc-demo">
  <mc-radio v-model="mode" value="survival" color="#2E6BE5">生存</mc-radio>
  <mc-radio v-model="mode" value="creative" color="#e52e2e">创造</mc-radio>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>

<template>
  <div class="mc-demo">
    <mc-radio v-model="mode" value="survival" color="#2E6BE5">生存</mc-radio>
    <mc-radio v-model="mode" value="creative" color="#e52e2e">创造</mc-radio>
  </div>
</template>
```

## 交互状态

<div class="mc-demo">
  <mc-radio v-model="mode" value="survival" readonly>只读选中</mc-radio>
  <mc-radio v-model="mode" value="disabled" disabled>禁用</mc-radio>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>

<template>
  <div class="mc-demo">
    <mc-radio v-model="mode" value="survival" readonly>只读选中</mc-radio>
    <mc-radio v-model="mode" value="disabled" disabled>禁用</mc-radio>
  </div>
</template>
```

## 验证机制

单选项支持 `required`、`rules`、`errorMessages` 与 `validateOn`。

<div class="mc-demo"><mc-radio v-model="mode" value="required" error-messages="请选择模式">校验错误</mc-radio></div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>
<template>
  <div class="mc-demo"><mc-radio v-model="mode" value="required" error-messages="请选择模式">校验错误</mc-radio></div>
</template>
```

## Props

| 名称            | 类型                              | 默认           | 说明                                               |
| --------------- | --------------------------------- | -------------- | -------------------------------------------------- |
| `modelValue`    | `string \| number \| boolean`     | `''`           | 当前选中的组值，支持通过 `v-model` 双向绑定。      |
| `value`         | `string \| number \| boolean`     | `''`           | 当前单选项被选中时写入 `modelValue` 的值。         |
| `label`         | `string`                          | -              | 单选项标签；默认插槽也可提供标签内容。             |
| `description`   | `string`                          | -              | 显示在单选项前的补充说明。                         |
| `hint`          | `string`                          | -              | 无错误时显示的辅助提示。                           |
| `disabled`      | `boolean`                         | `false`        | 是否禁用当前单选项。                               |
| `readonly`      | `boolean`                         | `false`        | 是否只读展示并阻止选中操作。                       |
| `rotate`        | `boolean`                         | `false`        | 是否将方形选中标记旋转 45 度。                     |
| `color`         | `string`                          | -              | 自定义选中状态的背景色，接受合法 CSS 颜色值。      |
| `required`      | `boolean`                         | `false`        | 是否要求当前字段具有选中值，并接入 `McForm` 验证。 |
| `rules`         | `McRule<McRadioValue>[]`          | `[]`           | 字段验证规则列表，规则可同步或异步返回结果。       |
| `errorMessages` | `string \| string[]`              | -              | 外部错误消息；提供后直接显示为错误状态。           |
| `validateOn`    | `input \| blur \| submit \| lazy` | 继承 / `input` | 覆盖字段的验证触发时机；未提供时继承 `McForm`。    |
| `id`            | `string`                          | 自动生成       | 原生 radio 与字段辅助文本关联所用的 id。           |
| `name`          | `string`                          | -              | 传递给原生 radio 的 name，用于原生分组和表单提交。 |

标准原生属性、`aria-*` 和交互监听器直接写在 `<mc-radio>` 上并转发到内部 radio input；`class`、`style`、`data-*` 保留在组件外层。

## Events

| 事件                | 参数                          | 说明         |
| ------------------- | ----------------------------- | ------------ |
| `update:modelValue` | `string \| number \| boolean` | v-model 更新 |
| `change`            | `string \| number \| boolean` | 值变化       |
