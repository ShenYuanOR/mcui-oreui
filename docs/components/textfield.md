<script setup>import { ref } from 'vue'; const name = ref('')</script>

# TextField

## 输入与校验状态

<div class="mc-demo mc-demo--column" style="width:340px">
  <mc-text-field v-model="name" label="世界名称" required hint="至少 3 个字符" :rules="[v => v.length >= 3 || '名称太短']" />
  <mc-text-field model-value="Steve" label="只读名称" readonly />
  <mc-text-field label="服务端错误" error-messages="名称已被占用" />
  <mc-text-field label="禁用输入" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:340px">
    <mc-text-field
      v-model="name"
      label="世界名称"
      required
      hint="至少 3 个字符"
      :rules="[(v) => v.length >= 3 || '名称太短']"
    />
    <mc-text-field model-value="Steve" label="只读名称" readonly />
    <mc-text-field label="服务端错误" error-messages="名称已被占用" />
    <mc-text-field label="禁用输入" disabled />
  </div>
</template>
```

TextField 使用原生 input，并共享 `label`、`description`、`hint`、`disabled`、`readonly`、`required`、`rules`、`errorMessages`、`validateOn` 与 `id` 表单契约。多行内容请使用独立的 [Textarea](./textarea) 页面。

输入框使用 40px 固定高度、20px 整数行高与对称的 8px 上下内边距，文字和 placeholder 会在边框内垂直居中。

`McTextField` 的 `filter` 控制字符过滤（`text | all | number | letter | operator | base | none`），标准 `type` 控制原生 input 类型。`autocomplete`、`maxlength`、`inputmode`、`placeholder`、`aria-*` 等原生属性直接写在组件上并转发到 input；不再提供 `password`、`inputType`、`maxLength`、`error` 或 `success` 包装 Props。外部错误统一通过 `errorMessages` 传入。多行内容请使用 `McTextarea`。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const password = ref('')
const serverErrors = ref<string[]>([])
</script>

<template>
  <mc-text-field
    v-model="password"
    type="password"
    filter="all"
    maxlength="64"
    autocomplete="current-password"
    :error-messages="serverErrors"
  />
</template>
```

事件：`update:modelValue`、`change`。标准原生 input 属性、`aria-*` 和监听器会路由到真实输入框。
