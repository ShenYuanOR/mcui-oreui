# Spinner 加载动画

Minecraft 风格加载动画，使用像素风 GIF 旋转效果，适合加载态、等待场景。

<script setup>
import { ref } from 'vue'
</script>

## 基础用法

默认显示像素风转圈动画，只需设置 `size` 控制尺寸。

<div class="mc-demo">
  <mc-spinner />
  <mc-spinner :size="64" />
  <mc-spinner :size="80" />
</div>

```html
<mc-spinner />
<mc-spinner :size="64" />
<mc-spinner :size="80" />
```

## 颜色

通过 `color` 属性切换 GIF 颜色，`white` 适合深色背景，`dark` 适合浅色背景。

<div class="mc-demo">
  <div style="background:#1E1E1F;padding:12px;display:inline-flex;border-radius:4px">
    <mc-spinner color="white" />
  </div>
  <div style="background:#D0D1D4;padding:12px;display:inline-flex;border-radius:4px">
    <mc-spinner color="dark" />
  </div>
</div>

```html
<!-- 白色，适合深色背景 -->
<mc-spinner color="white" />

<!-- 深色，适合浅色背景 -->
<mc-spinner color="dark" />
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `size` | `number` | `48` | 圆形尺寸（px） |
| `color` | `'white' \| 'dark'` | `'white'` | GIF 颜色 |
