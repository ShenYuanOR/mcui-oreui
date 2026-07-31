<script setup>import { ref } from 'vue'; const enabled = ref(true)</script>

# Switch 开关

## 开关与字段状态

<div class="mc-demo">
  <mc-switch v-model="enabled" label="启用音效" />
  <mc-switch :model-value="true" label="只读开启" readonly />
  <mc-switch label="校验错误" error-messages="必须开启" />
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
    <mc-switch label="校验错误" error-messages="必须开启" />
    <mc-switch label="禁用状态" disabled />
  </div>
</template>
```

Switch 基于原生 checkbox 并声明 `role="switch"`，支持键盘和表单语义。可见层恢复 Spectrollay Ore UI 的双色像素轨道、开/关图标、32px 凸起手柄，以及 hover、active、focus-visible、disabled、readonly 和 error 状态；不依赖浏览器默认 checkbox 外观。

Props：`modelValue`、`label`、`description`、`hint`、`disabled`、`readonly`、`required`、`rules`、`errorMessages`、`validateOn`、`id`、`name`、`color`。标准原生与 `aria-*` Attr 会到达内部 checkbox。
