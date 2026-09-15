# Skeleton

在内容尚未就绪时显示像素风占位骨架。

## 基础用法

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-skeleton height="34" aria-label="正在加载世界列表" />
  <mc-skeleton width="60%" height="18" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-skeleton height="34" aria-label="正在加载世界列表" />
    <mc-skeleton width="60%" height="18" />
  </div>
</template>
```

## API

### Props

| 名称     | 类型               | 默认   | 说明                                                           |
| -------- | ------------------ | ------ | -------------------------------------------------------------- |
| `width`  | `string \| number` | `100%` | 骨架块宽度；数字或纯数字字符串按 px 处理，CSS 长度会原样使用。 |
| `height` | `string \| number` | `20`   | 骨架块高度；数字或纯数字字符串按 px 处理，CSS 长度会原样使用。 |

数字和纯数字字符串尺寸都按 px 解释，因此 `height="34"` 与 `:height="34"` 的结果一致；带单位的 CSS 长度（如 `2rem`、`60%`、`calc(...)`）会原样保留。

可访问名称直接使用标准 `aria-label`；未提供时使用当前 Locale 的加载文案。系统开启“减少动态效果”后，脉冲动画会自动停用。
