# TextField 单行文本输入框

`McTextField` 用于单行文本输入，内部已包含字段展示层，可直接作为 `McForm` 的子组件使用。

## 基础用法

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-text-field model-value="Steve" label="玩家名称" />
  <mc-text-field model-value="只读名称" label="只读名称" readonly />
  <mc-text-field label="禁用输入" disabled />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-text-field model-value="Steve" label="玩家名称" />
    <mc-text-field model-value="只读名称" label="只读名称" readonly />
    <mc-text-field label="禁用输入" disabled />
  </div>
</template>
```

使用原生 `type`、`autocomplete`、`maxlength`、`inputmode`、`placeholder` 和 `aria-*` 属性；`filter` 支持 `text | all | number | letter | operator | base | none`。输入框保持 40px 高度和 20px 行高。

## 验证机制

单行输入框共享统一表单契约：`required`、`rules`、`errorMessages`、`validateOn`、`disabled`、`readonly`、`id`。错误和规则只在需要校验时配置。

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-text-field label="世界名称" required hint="至少 3 个字符" :rules="[v => v.length >= 3 || '名称太短']" />
  <mc-text-field label="服务端错误" error-messages="名称已被占用" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-text-field label="世界名称" required hint="至少 3 个字符" :rules="[(v) => v.length >= 3 || '名称太短']" />
    <mc-text-field label="服务端错误" error-messages="名称已被占用" />
  </div>
</template>
```

## API

### Props

| 名称            | 类型                                                          | 默认           | 说明                                             |
| --------------- | ------------------------------------------------------------- | -------------- | ------------------------------------------------ |
| `modelValue`    | `string`                                                      | `''`           | 当前文本，支持通过 `v-model` 双向绑定。          |
| `filter`        | `text \| all \| number \| letter \| operator \| base \| none` | `text`         | 输入字符过滤模式；被过滤时触发 `invalid-input`。 |
| `type`          | `string`                                                      | `text`         | 传递给原生 input 的 type。                       |
| `label`         | `string`                                                      | -              | 字段标签。                                       |
| `description`   | `string`                                                      | -              | 显示在输入框前的补充说明。                       |
| `hint`          | `string`                                                      | -              | 无错误时显示的辅助提示。                         |
| `disabled`      | `boolean`                                                     | `false`        | 是否禁用输入框。                                 |
| `readonly`      | `boolean`                                                     | `false`        | 是否只读展示并阻止文本编辑。                     |
| `required`      | `boolean`                                                     | `false`        | 是否要求输入内容，并接入 `McForm` 验证。         |
| `rules`         | `McRule<string>[]`                                            | `[]`           | 字段验证规则列表，规则可同步或异步返回结果。     |
| `errorMessages` | `string \| string[]`                                          | -              | 外部错误消息；提供后直接显示为错误状态。         |
| `validateOn`    | `input \| blur \| submit \| lazy`                             | 继承 / `input` | 覆盖字段的验证触发时机；未提供时继承 `McForm`。  |
| `id`            | `string`                                                      | 自动生成       | 原生 input 与字段辅助文本关联所用的 id。         |

事件：`update:modelValue`、`change`、`invalid-input`。多行内容请使用 [Textarea 多行文本输入框](./textarea)。
