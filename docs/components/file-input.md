<script setup>
import { ref } from 'vue'
const files = ref(null)
</script>

# FileInput

支持原生文件选择、拖放、清除、accept 过滤和文件大小显示。

## 选择、校验与禁用状态

<div class="mc-demo mc-demo--column" style="width:380px">
  <mc-file-input v-model="files" label="资源包" accept=".zip,image/*" multiple required hint="可拖放多个文件" />
  <mc-file-input label="待上传文件" error-messages="请选择资源包" />
  <mc-file-input label="上传已关闭" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const files = ref(null)
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:380px">
    <mc-file-input v-model="files" label="资源包" accept=".zip,image/*" multiple required hint="可拖放多个文件" />
    <mc-file-input label="待上传文件" error-messages="请选择资源包" />
    <mc-file-input label="上传已关闭" disabled />
  </div>
</template>
```

| Prop         | 类型                             | 默认    |
| ------------ | -------------------------------- | ------- |
| `modelValue` | `File \| File[] \| null`         | `null`  |
| `multiple`   | `boolean`                        | `false` |
| `accept`     | `string`                         | -       |
| `capture`    | `boolean \| user \| environment` | `false` |

同时支持统一表单契约。事件：`update:modelValue`、`change`；暴露 `browse()`、`clear()` 与校验方法。
