<script setup>
import { ref } from 'vue'
const files = ref(null)
</script>

# FileInput

支持原生文件选择、拖放、清除、accept 过滤和文件大小显示。

## 基础展示

<div class="mc-demo mc-demo--column" style="width:380px">
  <mc-file-input v-model="files" label="资源包" accept=".zip,image/*" multiple hint="可拖放多个文件" />
  <mc-file-input label="单文件按钮" accept=".mcpack" variant="button" />
  <mc-file-input label="紧凑上传" accept="image/*" variant="compact" />
  <mc-file-input label="上传已关闭" disabled />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const files = ref(null)
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:380px">
    <mc-file-input v-model="files" label="资源包" accept=".zip,image/*" multiple hint="可拖放多个文件" />
    <mc-file-input label="单文件按钮" accept=".mcpack" variant="button" />
    <mc-file-input label="紧凑上传" accept="image/*" variant="compact" />
    <mc-file-input label="上传已关闭" disabled />
  </div>
</template>
```

## 验证机制

文件输入支持 `required`、`rules`、`errorMessages` 与 `validateOn`。`accept` 负责文件类型验证：可写单个类型（如 `.mcpack` 或 `image/*`），也可用逗号分隔多个类型（如 `.zip,image/*`）；`multiple` 为 `true` 时允许多个文件，否则只保留第一个匹配文件。选到不支持的类型会显示错误信息。

<div class="mc-demo mc-demo--column" style="width:380px"><mc-file-input label="待上传文件" required error-messages="请选择资源包" /></div>

```vue
<script setup lang="ts"></script>
<template>
  <div class="mc-demo mc-demo--column" style="width:380px">
    <mc-file-input label="待上传文件" required error-messages="请选择资源包" />
  </div>
</template>
```

## Props

| 名称            | 类型                                  | 默认         | 说明                                                         |
| --------------- | ------------------------------------- | ------------ | ------------------------------------------------------------ |
| `modelValue`    | `File \| File[] \| null`              | `null`       | 当前文件或文件列表，返回形态由 `multiple` 决定。             |
| `multiple`      | `boolean`                             | `false`      | 是否允许选择和保留多个文件。                                 |
| `accept`        | `string`                              | -            | 允许的扩展名、精确 MIME 或 MIME 通配符；多个规则用逗号分隔。 |
| `capture`       | `boolean \| user \| environment`      | `false`      | 在支持的移动设备上指定直接调用采集设备及摄像头方向。         |
| `variant`       | `'dropzone' \| 'compact' \| 'button'` | `'dropzone'` | 上传区外观：拖放区域、紧凑字段或按钮。                       |
| `label`         | `string`                              | -            | 字段标签。                                                   |
| `description`   | `string`                              | -            | 显示在控件前的补充说明。                                     |
| `hint`          | `string`                              | -            | 无错误时显示的辅助提示。                                     |
| `disabled`      | `boolean`                             | `false`      | 是否禁用文件选择、拖放和清除。                               |
| `readonly`      | `boolean`                             | `false`      | 是否保留当前展示但阻止文件选择、拖放和清除。                 |
| `required`      | `boolean`                             | `false`      | 是否要求至少选择一个文件，并接入 `McForm` 验证。             |
| `rules`         | `McRule<McFileInputValue>[]`          | `[]`         | 字段验证规则列表，规则可同步或异步返回结果。                 |
| `errorMessages` | `string \| string[]`                  | -            | 外部错误消息；提供后直接显示为错误状态。                     |
| `validateOn`    | `input \| blur \| submit \| lazy`     | `input`      | 覆盖字段的验证触发时机；位于 `McForm` 中时可继承表单设置。   |
| `id`            | `string`                              | 自动生成     | 原生 file input 与字段辅助文本关联所用的 id。                |

整个上传区域都可点击或按 Enter/Space 打开 Windows 文件选择器，不再只有文字区域可触发。支持拖放、清除；事件：`update:modelValue`、`change`；暴露 `browse()`、`clear()` 与校验方法。
