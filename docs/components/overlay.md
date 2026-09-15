<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

# Overlay

所有浮层组件共享的底层定位、焦点、滚动、Teleport 与叠层服务。业务界面通常直接使用 [Dialog / Confirm](./dialog)、[Menu](./menu) 或 [Tooltip](./tooltip)。

## 基础用法

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

## API

### Props

| 名称               | 类型                                   | 默认              | 说明                                                  |
| ------------------ | -------------------------------------- | ----------------- | ----------------------------------------------------- |
| `modelValue`       | `boolean`                              | `false`           | 控制浮层是否显示，支持通过 `v-model` 双向绑定。       |
| `teleport`         | `string \| HTMLElement \| false`       | `body`            | Teleport 目标；设为 `false` 时保留在当前 DOM 层级。   |
| `locationStrategy` | `static \| connected`                  | `static`          | 使用固定视口布局，或相对 activator 进行自动定位。     |
| `location`         | `McOverlayLocation`                    | `bottom start`    | Connected 模式下相对 activator 的逻辑位置。           |
| `offset`           | `number \| [number, number]`           | `0`               | 主轴偏移，或 `[主轴, 交叉轴]` 两个方向的偏移量。      |
| `boundaryPadding`  | `number`                               | `8`               | 自动翻转和平移时与视口边缘保留的最小距离，单位为 px。 |
| `matchWidth`       | `boolean`                              | `false`           | Connected 模式下是否让浮层至少与 activator 等宽。     |
| `scrollStrategy`   | `block \| close \| reposition \| none` | `block`           | 浮层打开时如何处理页面或祖先滚动。                    |
| `focusStrategy`    | `trap \| restore \| none`              | `trap`            | 浮层打开时如何限制焦点，以及关闭后是否恢复焦点。      |
| `closeOnOverlay`   | `boolean`                              | `true`            | 点击遮罩时是否关闭当前浮层。                          |
| `closeOnEscape`    | `boolean`                              | `true`            | 当前浮层位于栈顶时，按 Escape 是否关闭。              |
| `persistent`       | `boolean`                              | `false`           | 是否阻止遮罩点击和 Escape 关闭。                      |
| `scrim`            | `boolean \| string`                    | `true`            | 是否显示遮罩；传入字符串时该值作为遮罩颜色。          |
| `transition`       | `string`                               | `mc-overlay-fade` | Vue Transition 名称。                                 |

Activator 插槽提供 `{ props, isActive, toggle, open }`；默认插槽提供 `{ close, updateLocation }`。事件为 `update:modelValue`、`open`、`close`、`afterEnter`。

Teleport 内容会携带当前 Theme 类名、CSS 变量和 Locale `dir`。客户端就绪前 Teleport 保持禁用。嵌套浮层只有栈顶响应 Escape 和外部点击。快速开关时过期的滚动锁、焦点陷阱和定位监听不会套到已关闭的浮层上。`closeWithoutRestore()` 关闭时不把焦点交回触发器，供 Menu 的 Tab 退出使用。
