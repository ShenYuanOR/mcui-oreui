<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

# Menu

Connected Overlay 菜单会跟随 activator，并在视口边缘自动翻转或平移。直接放入的 `button`、链接或
`role="menuitem"` 元素会自动使用纵向菜单项样式，不需要在业务页面补布局 CSS。

## 基础用法

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

## API

### Props

| 名称                  | 类型                             | 默认           | 说明                                                        |
| --------------------- | -------------------------------- | -------------- | ----------------------------------------------------------- |
| `modelValue`          | `boolean`                        | `false`        | 控制菜单是否展开，支持通过 `v-model` 双向绑定。             |
| `teleport`            | `string \| HTMLElement \| false` | `body`         | Teleport 目标；设为 `false` 时保留在当前 DOM 层级。         |
| `closeOnContentClick` | `boolean`                        | `true`         | 点击可用菜单项后是否自动收起菜单。                          |
| `location`            | `McOverlayLocation`              | `bottom start` | 菜单相对 activator 的逻辑位置，越过视口时会自动翻转或平移。 |
| `offset`              | `number \| [number, number]`     | `6`            | 主轴偏移，或 `[主轴, 交叉轴]` 两个方向的偏移量。            |
| `minWidth`            | `string \| number`               | `180`          | 菜单最小宽度；数字按 px 处理，字符串作为 CSS 长度使用。     |

事件为 `update:modelValue`。菜单支持上下方向键、Home、End、Enter、Space、Tab 与 Escape，并跳过禁用项。按 Tab 关闭时不会把焦点抢回触发器，以便焦点继续前进。
