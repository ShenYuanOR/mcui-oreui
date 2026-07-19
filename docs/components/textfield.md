# TextField 文本框

支持字符过滤、最大长度、占位提示、单行/多行、自适应高度、中文输入法，以及密码模式。

<script setup>
import { ref } from 'vue'
const name = ref('')
const num = ref('')
const pwd = ref('')
</script>

<div class="mc-demo mc-demo--column">
  <mc-text-field v-model="name" hint="请输入世界名称" :max-length="20" />
  <mc-text-field v-model="num" type="number" hint="仅数字" />
  <mc-text-field v-model="pwd" password hint="请输入密码" />
  <span style="color:#fff">name = "{{ name }}"，num = "{{ num }}"，pwd = "{{ pwd }}"</span>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
const pwd = ref('')
</script>

<template>
  <mc-text-field v-model="name" hint="请输入世界名称" :max-length="20" />
  <mc-text-field v-model="num" type="number" hint="仅数字" />
  <mc-text-field v-model="pwd" password hint="请输入密码" />
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `string` | `''` | 输入内容（v-model） |
| `type` | `'text' \| 'all' \| 'number' \| 'letter' \| 'operator' \| 'base' \| 'none'` | `text` | 字符过滤规则 |
| `singleLine` | `boolean` | `true` | 禁止回车换行 |
| `maxLength` | `number` | `0` | 最大字符数（0 不限） |
| `hint` | `string` | `''` | 占位提示 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `password` | `boolean` | `false` | 密码模式，底层切换为 `input[type=password]` |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string` | v-model 更新 |
| `change` | `string` | 值变化 |
| `invalid-input` | — | 输入了被过滤规则拒绝的字符 |

## 原生属性

`<mc-text-field>` 支持所有原生属性透传（`placeholder`、`readonly`、`required`、`tabindex`、`autofocus`、`spellcheck`、`aria-*` 等）。密码模式下透传至 `<input>`，普通模式下透传至 `<textarea>`。

```html
<mc-text-field
  v-model="text"
  placeholder="请输入"
  readonly
  required
  tabindex="1"
/>
```
