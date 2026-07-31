<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

# Overlay

所有浮层组件共享的底层定位、焦点、滚动、Teleport 与叠层服务。业务界面通常直接使用 [Dialog](./dialog)、[Menu](./menu)、[Tooltip](./tooltip) 或 [Confirm](./confirm)。

## Connected 定位

<div class="mc-demo">
  <mc-overlay v-model="open" location-strategy="connected" location="bottom start" :offset="8" :scrim="false">
    <template #activator="{ props }"><mc-button v-bind="props">打开 Overlay</mc-button></template>
    <mc-panel title="底层浮层">自定义定位内容</mc-panel>
  </mc-overlay>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <div class="mc-demo">
    <mc-overlay v-model="open" location-strategy="connected" location="bottom start" :offset="8" :scrim="false">
      <template #activator="{ props }"><mc-button v-bind="props">打开 Overlay</mc-button></template>
      <mc-panel title="底层浮层">自定义定位内容</mc-panel>
    </mc-overlay>
  </div>
</template>
```

Connected 模式相对 activator 定位，并在视口边缘自动 flip/shift；ResizeObserver、滚动祖先和 resize 会触发节流重定位。Static 模式用于 Dialog 等占据固定视口位置的浮层。

## Props

| 名称                                                     | 类型                                   | 默认           |
| -------------------------------------------------------- | -------------------------------------- | -------------- |
| `modelValue`                                             | `boolean`                              | `false`        |
| `locationStrategy`                                       | `static \| connected`                  | `static`       |
| `location`                                               | `top/bottom/start/end` 及对齐变体      | `bottom start` |
| `offset`                                                 | `number \| [main, cross]`              | `0`            |
| `scrollStrategy`                                         | `block \| close \| reposition \| none` | `block`        |
| `focusStrategy`                                          | `trap \| restore \| none`              | `trap`         |
| `teleport`                                               | `string \| HTMLElement \| false`       | `body`         |
| `persistent`、`scrim`、`closeOnOverlay`、`closeOnEscape` | 对应布尔策略                           | -              |

Activator 插槽提供 `{ props, isActive, toggle, open }`；默认插槽提供 `{ close, updateLocation }`。事件为 `update:modelValue`、`open`、`close`、`afterEnter`。

Teleport 内容会携带当前 Theme 类名、CSS 变量和 Locale `dir`。嵌套浮层只有栈顶响应 Escape 和外部点击。
