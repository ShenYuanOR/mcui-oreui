<script setup>import { ref } from 'vue'; const checked = ref(false)</script>

# Checkbox 复选框

## 基础展示与交互

<div class="mc-demo">
  <mc-checkbox v-model="checked" label="允许多人游戏" />
  <mc-checkbox :model-value="true" label="已禁用" disabled />
  <mc-checkbox :model-value="true" label="只读选中" readonly />
  <mc-checkbox indeterminate label="混合状态" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>

<template>
  <div class="mc-demo">
    <mc-checkbox v-model="checked" label="允许多人游戏" />
    <mc-checkbox :model-value="true" label="已禁用" disabled />
    <mc-checkbox :model-value="true" label="只读选中" readonly />
    <mc-checkbox indeterminate label="混合状态" />
  </div>
</template>
```

## 验证机制

复选框支持 `required`、`rules`、`errorMessages` 与 `validateOn`。

<div class="mc-demo"><mc-checkbox label="校验错误" error-messages="必须确认此项" /></div>

```vue
<script setup lang="ts"></script>
<template>
  <div class="mc-demo"><mc-checkbox label="校验错误" error-messages="必须确认此项" /></div>
</template>
```

组件使用真实 `input[type=checkbox]`，原生支持 Space、表单提交、required、disabled 与读屏器状态。

选中勾号使用 crispEdges 像素图形，混合态横杠由固定像素块绘制，不依赖系统字体中的 `✓` / `−` 字形，因此在不同平台与字体配置下保持一致。

## Props

| 名称            | 类型                              | 默认           | 说明                                                              |
| --------------- | --------------------------------- | -------------- | ----------------------------------------------------------------- |
| `modelValue`    | `boolean`                         | `false`        | 当前选中状态，支持通过 `v-model` 双向绑定。                       |
| `indeterminate` | `boolean`                         | `false`        | 是否显示混合态；它只改变视觉和无障碍状态，不会覆盖 `modelValue`。 |
| `label`         | `string`                          | -              | 复选框标签，点击标签也会切换状态。                                |
| `description`   | `string`                          | -              | 显示在复选框前的补充说明。                                        |
| `hint`          | `string`                          | -              | 无错误时显示的辅助提示。                                          |
| `disabled`      | `boolean`                         | `false`        | 是否禁用复选框。                                                  |
| `readonly`      | `boolean`                         | `false`        | 是否只读展示并阻止状态切换。                                      |
| `required`      | `boolean`                         | `false`        | 是否要求选中，并接入 `McForm` 验证。                              |
| `color`         | `string`                          | -              | 自定义选中态强调色，接受合法 CSS 颜色值。                         |
| `rules`         | `McRule<boolean>[]`               | `[]`           | 字段验证规则列表，规则可同步或异步返回结果。                      |
| `errorMessages` | `string \| string[]`              | -              | 外部错误消息；提供后直接显示为错误状态。                          |
| `validateOn`    | `input \| blur \| submit \| lazy` | 继承 / `input` | 覆盖字段的验证触发时机；未提供时继承 `McForm`。                   |
| `id`            | `string`                          | 自动生成       | 原生 checkbox 与字段辅助文本关联所用的 id。                       |
| `name`          | `string`                          | -              | 传递给原生 checkbox 的 name，用于表单提交。                       |

事件：`update:modelValue`、`change`。标准原生与 `aria-*` Attr 会到达内部 checkbox。
