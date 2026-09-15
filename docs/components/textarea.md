# Textarea 多行文本输入框

`McTextarea` 用于多行文本输入，内部已包含字段展示层，可直接作为 `McForm` 的子组件使用。

## 基础用法

<div class="mc-demo mc-demo--column" style="width:360px">
  <mc-textarea model-value="世界描述" label="世界描述" description="显示在世界列表中" :rows="3" />
  <mc-textarea model-value="只读说明" label="只读内容" readonly />
  <mc-textarea label="禁用内容" disabled />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:360px">
    <mc-textarea model-value="世界描述" label="世界描述" description="显示在世界列表中" :rows="3" />
    <mc-textarea model-value="只读说明" label="只读内容" readonly />
    <mc-textarea label="禁用内容" disabled />
  </div>
</template>
```

支持 `rows`、`auto-grow`、`max-length`；内容保持顶部起始排版，适合阅读和编辑。

## 验证机制

多行输入框共享统一表单契约：`required`、`rules`、`errorMessages`、`validateOn`、`disabled`、`readonly`、`id`。

<div class="mc-demo mc-demo--column" style="width:360px">
  <mc-textarea label="世界描述" required hint="最多 200 字" :rules="[v => v.length <= 200 || '内容过长']" />
  <mc-textarea label="错误内容" error-messages="描述不能为空" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:360px">
    <mc-textarea label="世界描述" required hint="最多 200 字" :rules="[(v) => v.length <= 200 || '内容过长']" />
    <mc-textarea label="错误内容" error-messages="描述不能为空" />
  </div>
</template>
```

## API

### Props

| 名称            | 类型                              | 默认           | 说明                                                      |
| --------------- | --------------------------------- | -------------- | --------------------------------------------------------- |
| `modelValue`    | `string`                          | `''`           | 当前文本，支持通过 `v-model` 双向绑定。                   |
| `rows`          | `number`                          | `3`            | 未自动增长时显示的初始文本行数。                          |
| `autoGrow`      | `boolean`                         | `false`        | 是否随内容增加自动扩展输入框高度；外部 `v-model` 变化也会同步高度。 |
| `maxLength`     | `number`                          | `0`            | 最大字符数；设为 `0` 时不向原生 textarea 添加 maxlength。 |
| `label`         | `string`                          | -              | 字段标签。                                                |
| `description`   | `string`                          | -              | 显示在输入框前的补充说明。                                |
| `hint`          | `string`                          | -              | 无错误时显示的辅助提示。                                  |
| `disabled`      | `boolean`                         | `false`        | 是否禁用输入框。                                          |
| `readonly`      | `boolean`                         | `false`        | 是否只读展示并阻止文本编辑。                              |
| `required`      | `boolean`                         | `false`        | 是否要求输入内容，并接入 `McForm` 验证。                  |
| `rules`         | `McRule<string>[]`                | `[]`           | 字段验证规则列表，规则可同步或异步返回结果。              |
| `errorMessages` | `string \| string[]`              | -              | 外部错误消息；提供后直接显示为错误状态。                  |
| `validateOn`    | `input \| blur \| submit \| lazy` | 继承 / `input` | 覆盖字段的验证触发时机；未提供时继承 `McForm`。           |
| `id`            | `string`                          | 自动生成       | 原生 textarea 与字段辅助文本关联所用的 id。               |

事件：`update:modelValue`、`change`。
