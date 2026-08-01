<script setup>
import { ref } from 'vue'
const mode = ref(null)
const options = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
  { title: '冒险', value: 'adventure' },
  { title: '旁观（不可用）', value: 'spectator', disabled: true },
]
</script>

# Autocomplete

可编辑的 combobox，输入时过滤选项；焦点始终留在真实输入框。

## 基础展示

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-autocomplete v-model="mode" label="搜索游戏模式" hint="输入文字筛选" :options="options" />
  <mc-autocomplete model-value="creative" label="只读模式" :options="options" readonly />
  <mc-autocomplete label="禁用模式" :options="options" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref(null)
const options = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
  { title: '冒险', value: 'adventure' },
  { title: '旁观（不可用）', value: 'spectator', disabled: true },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-autocomplete v-model="mode" label="搜索游戏模式" hint="输入文字筛选" :options="options" />
    <mc-autocomplete model-value="creative" label="只读模式" :options="options" readonly />
    <mc-autocomplete label="禁用模式" :options="options" disabled />
  </div>
</template>
```

## 验证机制

自动补全共享统一表单契约：`required`、`rules`、`errorMessages`、`validateOn`、`disabled`、`readonly`、`id`。

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-autocomplete label="游戏模式" :options="options" required :rules="[v => Boolean(v) || '请选择可用模式']" />
  <mc-autocomplete label="错误状态" :options="options" error-messages="请选择可用模式" />
</div>

```vue
<script setup lang="ts">
const options = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-autocomplete label="游戏模式" :options="options" required :rules="[(v) => Boolean(v) || '请选择可用模式']" />
    <mc-autocomplete label="错误状态" :options="options" error-messages="请选择可用模式" />
  </div>
</template>
```

## Props

| 名称            | 类型                                           | 默认     | 说明                                                       |
| --------------- | ---------------------------------------------- | -------- | ---------------------------------------------------------- |
| `modelValue`    | `string \| number \| boolean \| null`          | `null`   | 当前选中项的 value，支持通过 `v-model` 双向绑定。          |
| `options`       | `(primitive \| { title, value, disabled? })[]` | `[]`     | 候选项；原始值会自动转换为同名标题和值。                   |
| `noFilter`      | `boolean`                                      | `false`  | 是否关闭组件内本地过滤，适合由外部搜索请求提供 options。   |
| `placeholder`   | `string`                                       | -        | 输入为空时显示的占位文本。                                 |
| `label`         | `string`                                       | -        | 字段标签。                                                 |
| `description`   | `string`                                       | -        | 显示在输入框前的补充说明。                                 |
| `hint`          | `string`                                       | -        | 无错误时显示的辅助提示。                                   |
| `disabled`      | `boolean`                                      | `false`  | 是否禁用输入、展开和选择。                                 |
| `readonly`      | `boolean`                                      | `false`  | 是否只读展示并阻止输入、展开和选择。                       |
| `required`      | `boolean`                                      | `false`  | 是否要求选择一项，并接入 `McForm` 验证。                   |
| `rules`         | `McRule<McSelectValue>[]`                      | `[]`     | 字段验证规则列表，规则可同步或异步返回结果。               |
| `errorMessages` | `string \| string[]`                           | -        | 外部错误消息；提供后直接显示为错误状态。                   |
| `validateOn`    | `input \| blur \| submit \| lazy`              | `input`  | 覆盖字段的验证触发时机；位于 `McForm` 中时可继承表单设置。 |
| `id`            | `string`                                       | 自动生成 | 原生输入框、列表框与字段辅助文本关联所用的 id。            |

事件：`update:modelValue`、`change`、`update:search`；`option` 插槽获得 `{ option, selected }`。
