<script setup>
import { ref } from 'vue'
const mode = ref('survival')
const options = [
  { label: '生存', value: 'survival' },
  { label: '创造', value: 'creative' },
  { label: '冒险', value: 'adventure' },
  { label: '旁观', value: 'spectator', disabled: true },
]
</script>

# RadioGroup

使用 fieldset/legend 语义管理一组选项，并统一处理标签、校验和禁用状态。

## 方向与禁用项

<div class="mc-demo mc-demo--column">
  <mc-radio-group v-model="mode" label="默认游戏模式" direction="vertical" :options="options" />
  <span>当前：{{ mode }}</span>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
const options = [
  { label: '生存', value: 'survival' },
  { label: '创造', value: 'creative' },
  { label: '冒险', value: 'adventure' },
  { label: '旁观', value: 'spectator', disabled: true },
]
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-radio-group v-model="mode" label="默认游戏模式" direction="vertical" :options="options" />
    <span>当前：{{ mode }}</span>
  </div>
</template>
```

## Props

| 名称            | 类型                              | 默认         | 说明                                                       |
| --------------- | --------------------------------- | ------------ | ---------------------------------------------------------- |
| `modelValue`    | `string \| number \| boolean`     | `''`         | 当前选中的值，支持通过 `v-model` 双向绑定。                |
| `options`       | `{ label, value, disabled? }[]`   | `[]`         | 生成单选项的数据；也可使用默认插槽手工声明 `McRadio`。     |
| `direction`     | `horizontal \| vertical`          | `horizontal` | 单选项横向或纵向排列。                                     |
| `label`         | `string`                          | -            | 单选组标题，并作为 `fieldset` 的 `legend`。                |
| `description`   | `string`                          | -            | 显示在单选项前的补充说明。                                 |
| `hint`          | `string`                          | -            | 无错误时显示的辅助提示。                                   |
| `disabled`      | `boolean`                         | `false`      | 是否禁用组内全部单选项。                                   |
| `readonly`      | `boolean`                         | `false`      | 是否只读展示并阻止选项切换。                               |
| `required`      | `boolean`                         | `false`      | 是否要求选择一项，并接入 `McForm` 验证。                   |
| `rules`         | `McRule<McRadioValue>[]`          | `[]`         | 字段验证规则列表，规则可同步或异步返回结果。               |
| `errorMessages` | `string \| string[]`              | -            | 外部错误消息；提供后直接显示为错误状态。                   |
| `validateOn`    | `input \| blur \| submit \| lazy` | `input`      | 覆盖字段的验证触发时机；位于 `McForm` 中时可继承表单设置。 |
| `id`            | `string`                          | 自动生成     | 单选组与辅助文本关联所用的 id。                            |
| `name`          | `string`                          | 自动生成     | 传递给组内原生 radio 的 name，使其参与同一组选中行为。     |

默认插槽可替换 options，手工声明 [Radio](./radio) 子项。事件：`update:modelValue`、`change`。
