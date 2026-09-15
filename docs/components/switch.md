<script setup>import { ref } from 'vue'; const enabled = ref(true)</script>

# Switch 开关

## 基础用法

<div class="mc-demo">
  <mc-switch v-model="enabled" label="启用音效" />
  <mc-switch :model-value="true" label="只读开启" readonly />
  <mc-switch label="禁用状态" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(true)
</script>

<template>
  <div class="mc-demo">
    <mc-switch v-model="enabled" label="启用音效" />
    <mc-switch :model-value="true" label="只读开启" readonly />
    <mc-switch label="禁用状态" disabled />
  </div>
</template>
```

## 验证机制

开关支持 `required`、`rules`、`errorMessages` 与 `validateOn`。

<div class="mc-demo"><mc-switch label="校验错误" error-messages="必须开启" /></div>

```vue
<script setup lang="ts"></script>
<template>
  <div class="mc-demo"><mc-switch label="校验错误" error-messages="必须开启" /></div>
</template>
```

Switch 基于原生 checkbox 并声明 `role="switch"`，支持键盘和表单语义。可见层恢复 Spectrollay Ore UI 的双色像素轨道、开/关图标、32px 凸起手柄，以及 hover、active、focus-visible、disabled、readonly 和 error 状态；不依赖浏览器默认 checkbox 外观。

## API

### Props

| 名称            | 类型                              | 默认           | 说明                                            |
| --------------- | --------------------------------- | -------------- | ----------------------------------------------- |
| `modelValue`    | `boolean`                         | `false`        | 当前开关状态，支持通过 `v-model` 双向绑定。     |
| `label`         | `string`                          | -              | 开关标签，点击标签也会切换状态。                |
| `description`   | `string`                          | -              | 显示在开关前的补充说明。                        |
| `hint`          | `string`                          | -              | 无错误时显示的辅助提示。                        |
| `disabled`      | `boolean`                         | `false`        | 是否禁用开关。                                  |
| `readonly`      | `boolean`                         | `false`        | 是否只读展示并阻止状态切换。                    |
| `required`      | `boolean`                         | `false`        | 是否要求开启（仅 `true` 算已填），并接入 `McForm` 验证。 |
| `color`         | `string`                          | -              | 自定义开启状态的强调色，接受合法 CSS 颜色值。   |
| `rules`         | `McRule<boolean>[]`               | `[]`           | 字段验证规则列表，规则可同步或异步返回结果。    |
| `errorMessages` | `string \| string[]`              | -              | 外部错误消息；提供后直接显示为错误状态。        |
| `validateOn`    | `input \| blur \| submit \| lazy` | 继承 / `input` | 覆盖字段的验证触发时机；未提供时继承 `McForm`。 |
| `id`            | `string`                          | 自动生成       | 原生 checkbox 与字段辅助文本关联所用的 id。     |
| `name`          | `string`                          | -              | 传递给原生 checkbox 的 name，用于表单提交。     |

事件：`update:modelValue`、`change`。标准原生与 `aria-*` Attr 会到达内部 checkbox。
