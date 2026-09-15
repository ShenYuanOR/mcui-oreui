# Tooltip 提示

通用悬停提示组件，可包裹按钮、图标或任意内联内容。

## 基础用法

<div class="mc-demo">
  <mc-tooltip content="保存当前设置">
    <mc-button variant="primary">悬停查看</mc-button>
  </mc-tooltip>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-tooltip content="保存当前设置">
      <mc-button variant="primary">悬停查看</mc-button>
    </mc-tooltip>
  </div>
</template>
```

## 显示位置

<div class="mc-demo">
  <mc-tooltip content="顶部" placement="top"><mc-button>Top</mc-button></mc-tooltip>
  <mc-tooltip content="底部" placement="bottom"><mc-button>Bottom</mc-button></mc-tooltip>
  <mc-tooltip content="左侧" placement="left"><mc-button>Left</mc-button></mc-tooltip>
  <mc-tooltip content="右侧" placement="right"><mc-button>Right</mc-button></mc-tooltip>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-tooltip content="顶部" placement="top"><mc-button>Top</mc-button></mc-tooltip>
    <mc-tooltip content="底部" placement="bottom"><mc-button>Bottom</mc-button></mc-tooltip>
    <mc-tooltip content="左侧" placement="left"><mc-button>Left</mc-button></mc-tooltip>
    <mc-tooltip content="右侧" placement="right"><mc-button>Right</mc-button></mc-tooltip>
  </div>
</template>
```

## 自定义内容

`content` 插槽可以组合标题、说明等多行内容；整个插槽始终位于同一个提示面中，不会按行拆分边框。

<div class="mc-demo">
  <mc-tooltip>
    <mc-button variant="normal">复杂提示</mc-button>
    <template #content>
      <strong>McUI</strong><br />支持插槽内容
    </template>
  </mc-tooltip>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-tooltip>
      <mc-button variant="normal">复杂提示</mc-button>
      <template #content>
        <strong>McUI</strong>
        <br />
        支持插槽内容
      </template>
    </mc-tooltip>
  </div>
</template>
```

## API

### Props

| 名称        | 类型                                     | 默认    | 说明               |
| ----------- | ---------------------------------------- | ------- | ------------------ |
| `content`   | `string`                                 | `''`    | 提示文本           |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `top`   | 显示位置           |
| `disabled`  | `boolean`                                | `false` | 是否禁用提示       |
| `delay`     | `number`                                 | `0`     | 显示延迟，单位毫秒 |

悬停、聚焦显示；鼠标离开、失焦、Escape，以及触摸 / 手写笔按下时关闭。

### Slots

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 触发提示的内容 |
| `content` | 自定义提示内容 |
