<script setup>
import { ref } from 'vue'
const players = ref(4)
</script>

# NumberInput

带步进按钮的数值输入，编辑期间保留临时文本，Enter 或失焦时解析并夹取范围。

## 基础展示

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-number-input v-model="players" label="最大玩家数" :min="1" :max="30" :step="1" />
  <mc-number-input :model-value="8" label="只读数量" readonly />
  <mc-number-input :model-value="4" label="禁用数量" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const players = ref(4)
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-number-input v-model="players" label="最大玩家数" :min="1" :max="30" :step="1" />
    <mc-number-input :model-value="8" label="只读数量" readonly />
    <mc-number-input :model-value="4" label="禁用数量" disabled />
  </div>
</template>
```

## 验证机制

数字输入支持 `required`、`rules`、`errorMessages` 与 `validateOn`。

<div class="mc-demo mc-demo--column" style="width:340px"><mc-number-input :model-value="0" label="无效数量" error-messages="至少需要 1 名玩家" /></div>

```vue
<script setup lang="ts"></script>
<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-number-input :model-value="0" label="无效数量" error-messages="至少需要 1 名玩家" />
  </div>
</template>
```

## Props

| 名称            | 类型                              | 默认        | 说明                                                       |
| --------------- | --------------------------------- | ----------- | ---------------------------------------------------------- |
| `modelValue`    | `number \| null`                  | `null`      | 当前数值；输入为空或无法解析时为 `null`。                  |
| `min`           | `number`                          | `-Infinity` | 允许的最小值，提交和步进时会夹取到此下限。                 |
| `max`           | `number`                          | `Infinity`  | 允许的最大值，提交和步进时会夹取到此上限。                 |
| `step`          | `number`                          | `1`         | 步进按钮与上下方向键每次增加或减少的数值。                 |
| `placeholder`   | `string`                          | -           | 输入为空时显示的占位文本。                                 |
| `label`         | `string`                          | -           | 字段标签。                                                 |
| `description`   | `string`                          | -           | 显示在输入框前的补充说明。                                 |
| `hint`          | `string`                          | -           | 无错误时显示的辅助提示。                                   |
| `disabled`      | `boolean`                         | `false`     | 是否禁用输入框和步进按钮。                                 |
| `readonly`      | `boolean`                         | `false`     | 是否只读展示并阻止输入与步进操作。                         |
| `required`      | `boolean`                         | `false`     | 是否要求提供有效数值，并接入 `McForm` 验证。               |
| `rules`         | `McRule<number \| null>[]`        | `[]`        | 字段验证规则列表，规则可同步或异步返回结果。               |
| `errorMessages` | `string \| string[]`              | -           | 外部错误消息；提供后直接显示为错误状态。                   |
| `validateOn`    | `input \| blur \| submit \| lazy` | `input`     | 覆盖字段的验证触发时机；位于 `McForm` 中时可继承表单设置。 |
| `id`            | `string`                          | 自动生成    | 原生输入框与字段辅助文本关联所用的 id。                    |

上下方向键和两侧按钮按 step 增减。事件：`update:modelValue`、`change`；暴露 `commit()`、`increment()`、`decrement()` 与校验方法。
