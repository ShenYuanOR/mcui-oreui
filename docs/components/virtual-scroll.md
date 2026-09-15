<script setup>
const items = Array.from({ length: 1000 }, (_, index) => `区块 ${index + 1}`)
</script>

# VirtualScroll

只渲染可视窗口附近的固定高度项目，适合长列表。

## 基础用法

<div class="mc-demo" style="width:100%"><mc-virtual-scroll :items="items" :item-height="36" :height="220" :overscan="3"><template #default="{ item, index }"><div style="padding:8px">{{ index }} · {{ item }}</div></template></mc-virtual-scroll></div>

```vue
<script setup lang="ts">
const items = Array.from({ length: 1000 }, (_, index) => `区块 ${index + 1}`)
</script>

<template>
  <div class="mc-demo" style="width:100%">
    <mc-virtual-scroll :items="items" :item-height="36" :height="220" :overscan="3">
      <template #default="{ item, index }">
        <div style="padding:8px">{{ index }} · {{ item }}</div>
      </template>
    </mc-virtual-scroll>
  </div>
</template>
```

## API

### Props

| 名称         | 类型                                   | 默认 | 说明                                                                                            |
| ------------ | -------------------------------------- | ---- | ----------------------------------------------------------------------------------------------- |
| `items`      | `unknown[]`                            | 必填 | 需要虚拟化渲染的完整数据列表。                                                                  |
| `itemHeight` | `number`                               | 必填 | 每个项目的固定高度，单位为 px；必须与实际项目高度一致。`<= 0` 或非有限值按 `1` 处理，避免除零。 |
| `height`     | `string \| number`                     | 必填 | 可视窗口高度；数字按 px 处理，字符串作为 CSS 高度使用。                                         |
| `overscan`   | `number`                               | `4`  | 在可视窗口上方和下方额外渲染的项目数量，用于减少快速滚动白屏。                                  |
| `itemKey`    | `string \| ((item, index) => unknown)` | 索引 | 项目对象中的唯一键名或返回唯一键的函数；未提供时使用数组索引。                                  |

默认插槽获得 `{ item, index }`。组件默认占满父容器可用宽度，在 flex / Grid 中可安全收缩。2.0 仅支持固定行高，不包含动态高度、固定列、列拖拽或树表。
