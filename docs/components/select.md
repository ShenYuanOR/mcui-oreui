<script setup lang="ts">
const options = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
  { title: '旁观（不可用）', value: 'spectator', disabled: true },
]
</script>

# Select 选择器

`McSelect` 用于从选项列表中选择一个值，内部已包含字段展示层，可直接作为 `McForm` 的子组件使用。

## 基础展示

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-select model-value="survival" label="游戏模式" :options="options" placeholder="请选择" />
  <mc-select model-value="creative" label="只读模式" :options="options" readonly />
  <mc-select label="禁用状态" :options="options" disabled />
</div>

```vue
<script setup lang="ts">
const options = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
  { title: '旁观（不可用）', value: 'spectator', disabled: true },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-select model-value="survival" label="游戏模式" :options="options" placeholder="请选择" />
    <mc-select model-value="creative" label="只读模式" :options="options" readonly />
    <mc-select label="禁用状态" :options="options" disabled />
  </div>
</template>
```

展开时选择器会像按钮一样向下压入 4px，右侧三角旋转 180°；收起后恢复。它使用 Connected Overlay，支持方向键、Home、End、Enter、Space 与 Escape。需要输入搜索时请使用 [Autocomplete](./autocomplete)。

## 验证机制

选择器共享统一表单契约：`required`、`rules`、`errorMessages`、`validateOn`、`disabled`、`readonly`、`id`。

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-select label="游戏模式" :options="options" required hint="请选择一个模式" :rules="[v => Boolean(v) || '请选择游戏模式']" />
  <mc-select label="错误状态" :options="options" error-messages="请选择游戏模式" />
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
    <mc-select
      label="游戏模式"
      :options="options"
      required
      hint="请选择一个模式"
      :rules="[(v) => Boolean(v) || '请选择游戏模式']"
    />
    <mc-select label="错误状态" :options="options" error-messages="请选择游戏模式" />
  </div>
</template>
```

## Props

| 名称            | 类型                                           | 默认           | 说明                                              |
| --------------- | ---------------------------------------------- | -------------- | ------------------------------------------------- |
| `modelValue`    | `string \| number \| boolean \| null`          | `null`         | 当前选中项的 value，支持通过 `v-model` 双向绑定。 |
| `options`       | `(primitive \| { title, value, disabled? })[]` | `[]`           | 候选项；原始值会自动转换为同名标题和值。          |
| `placeholder`   | `string`                                       | -              | 未选择任何项目时显示的占位文本。                  |
| `label`         | `string`                                       | -              | 字段标签。                                        |
| `description`   | `string`                                       | -              | 显示在选择器前的补充说明。                        |
| `hint`          | `string`                                       | -              | 无错误时显示的辅助提示。                          |
| `disabled`      | `boolean`                                      | `false`        | 是否禁用展开和选择。                              |
| `readonly`      | `boolean`                                      | `false`        | 是否只读展示并阻止展开和选择。                    |
| `required`      | `boolean`                                      | `false`        | 是否要求选择一项，并接入 `McForm` 验证。          |
| `rules`         | `McRule<McSelectValue>[]`                      | `[]`           | 字段验证规则列表，规则可同步或异步返回结果。      |
| `errorMessages` | `string \| string[]`                           | -              | 外部错误消息；提供后直接显示为错误状态。          |
| `validateOn`    | `input \| blur \| submit \| lazy`              | 继承 / `input` | 覆盖字段的验证触发时机；未提供时继承 `McForm`。   |
| `id`            | `string`                                       | 自动生成       | 触发按钮、列表框与字段辅助文本关联所用的 id。     |

事件：`update:modelValue`、`change`；`option` 插槽获得 `{ option, selected }`。
