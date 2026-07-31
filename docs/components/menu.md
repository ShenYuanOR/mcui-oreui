<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

# Menu

Connected Overlay 菜单会跟随 activator，并在视口边缘自动翻转或平移。

## 操作菜单

<div class="mc-demo">
  <mc-menu v-model="open">
    <template #activator="{ props }"><mc-button v-bind="props">世界操作</mc-button></template>
    <button type="button" role="menuitem">复制世界</button>
    <button type="button" role="menuitem">导出世界</button>
    <button type="button" role="menuitem">删除世界</button>
  </mc-menu>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <div class="mc-demo">
    <mc-menu v-model="open">
      <template #activator="{ props }"><mc-button v-bind="props">世界操作</mc-button></template>
      <button type="button" role="menuitem">复制世界</button>
      <button type="button" role="menuitem">导出世界</button>
      <button type="button" role="menuitem">删除世界</button>
    </mc-menu>
  </div>
</template>
```

| Prop                  | 类型                             | 默认           |
| --------------------- | -------------------------------- | -------------- |
| `modelValue`          | `boolean`                        | `false`        |
| `teleport`            | `string \| HTMLElement \| false` | `body`         |
| `closeOnContentClick` | `boolean`                        | `true`         |
| `location`            | Overlay 逻辑位置                 | `bottom start` |
| `offset`              | `number \| [number, number]`     | `6`            |
| `minWidth`            | `string \| number`               | `180`          |

事件为 `update:modelValue`。菜单支持上下方向键、Home、End、Enter、Space、Tab 与 Escape，并跳过禁用项。
