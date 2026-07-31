<script setup>
const items = Array.from({ length: 1000 }, (_, index) => `区块 ${index + 1}`)
</script>

# VirtualScroll

只渲染可视窗口附近的固定高度项目，适合长列表。

## 千行列表

<div class="mc-demo" style="width:100%"><mc-virtual-scroll :items="items" :item-height="36" :height="220" :overscan="3"><template #default="{ item, index }"><div style="padding:8px">{{ index }} · {{ item }}</div></template></mc-virtual-scroll></div>

```vue
<script setup lang="ts">
const items = Array.from({ length: 1000 }, (_, index) => `区块 ${index + 1}`)
</script>

<template>
  <div class="mc-demo" style="width:100%">
    <mc-virtual-scroll :items="items" :item-height="36" :height="220" :overscan="3"
      ><template #default="{ item, index }"
        ><div style="padding:8px">{{ index }} · {{ item }}</div></template
      ></mc-virtual-scroll
    >
  </div>
</template>
```

| Prop         | 类型                 | 默认 |
| ------------ | -------------------- | ---- |
| `items`      | `unknown[]`          | 必填 |
| `itemHeight` | `number`             | 必填 |
| `height`     | `string \| number`   | 必填 |
| `overscan`   | `number`             | `4`  |
| `itemKey`    | `string \| function` | 索引 |

默认插槽获得 `{ item, index }`。组件默认占满父容器可用宽度，在 flex / Grid 中可安全收缩。2.0 仅支持固定行高，不包含动态高度、固定列、列拖拽或树表。
