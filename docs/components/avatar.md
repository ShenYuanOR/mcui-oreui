# Avatar

展示用户头像、图标或首字母缩写标识。

## 基础用法

<div class="mc-demo">
  <mc-avatar size="small" text="MC" />
  <mc-avatar text="AB" />
  <mc-avatar size="large" text="CD" />
  <mc-avatar size="x-large" text="EF" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-avatar size="small" text="MC" />
    <mc-avatar text="AB" />
    <mc-avatar size="large" text="CD" />
    <mc-avatar size="x-large" text="EF" />
  </div>
</template>
```

## 图片模式

<div class="mc-demo">
  <mc-avatar size="large" src="https://cdn.vuetifyjs.com/docs/images/one/snips/avatars/1.jpg" alt="用户头像" />
  <mc-avatar size="large" rounded="50%" src="https://cdn.vuetifyjs.com/docs/images/one/snips/avatars/1.jpg" alt="圆形头像" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-avatar size="large" src="https://cdn.vuetifyjs.com/docs/images/one/snips/avatars/1.jpg" alt="用户头像" />
    <mc-avatar size="large" rounded="50%" src="https://cdn.vuetifyjs.com/docs/images/one/snips/avatars/1.jpg" alt="圆形头像" />
  </div>
</template>
```

## 图标模式

<div class="mc-demo">
  <mc-avatar size="small" icon="mc-players" color="#3c8527" />
  <mc-avatar icon="mc-players" color="#3c8527" />
  <mc-avatar size="large" icon="mc-players" color="#3c8527" />
  <mc-avatar size="x-large" icon="mc-players" color="#3c8527" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-avatar size="small" icon="mc-players" color="#3c8527" />
    <mc-avatar icon="mc-players" color="#3c8527" />
    <mc-avatar size="large" icon="mc-players" color="#3c8527" />
    <mc-avatar size="x-large" icon="mc-players" color="#3c8527" />
  </div>
</template>
```

## 变体

<div class="mc-demo">
  <mc-avatar text="A" variant="elevated" />
  <mc-avatar text="B" variant="flat" />
  <mc-avatar text="C" variant="tonal" />
  <mc-avatar text="D" variant="outlined" />
  <mc-avatar text="E" variant="text" />
  <mc-avatar text="F" variant="plain" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-avatar text="A" variant="elevated" />
    <mc-avatar text="B" variant="flat" />
    <mc-avatar text="C" variant="tonal" />
    <mc-avatar text="D" variant="outlined" />
    <mc-avatar text="E" variant="text" />
    <mc-avatar text="F" variant="plain" />
  </div>
</template>
```

## 自定义颜色

<div class="mc-demo">
  <mc-avatar text="ST" color="#f5a623" />
  <mc-avatar text="MC" color="#3c8527" />
  <mc-avatar text="OR" color="#c33636" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-avatar text="ST" color="#f5a623" />
    <mc-avatar text="MC" color="#3c8527" />
    <mc-avatar text="OR" color="#c33636" />
  </div>
</template>
```

## 圆角

<div class="mc-demo">
  <mc-avatar text="A" rounded="0" />
  <mc-avatar text="B" rounded="8" />
  <mc-avatar text="C" rounded="50%" />
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-avatar text="A" rounded="0" />
    <mc-avatar text="B" rounded="8" />
    <mc-avatar text="C" rounded="50%" />
  </div>
</template>
```

## Props

| 名称       | 类型                                                | 默认        | 说明                                                                                      |
| --------- | --------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `size`    | `number \| 'small' \| 'middle' \| 'large' \| 'x-large'` | `'middle'`  | 头像尺寸。数字按 px；预设：small=32 / middle=48 / large=64 / x-large=96。               |
| `color`   | `string`                                            | `'#3C3C3C'` | 背景颜色（无图片时生效），支持预设名或 CSS 颜色值。                                       |
| `variant` | `'elevated' \| 'flat' \| 'tonal' \| 'outlined' \| 'text' \| 'plain'` | `'elevated'` | 视觉变体：elevated（立体阴影）、flat（实心扁平）、tonal（浅色底）、outlined（仅描边）、text（透明）、plain（极简）。 |
| `rounded` | `number \| string`                                  | `'0'`       | 圆角。数字按 px；`'50%'` 为圆形。默认 0（正方形）。                                      |
| `src`     | `string`                                            | -           | 头像图片 URL，优先级高于 icon 和 text。                                                  |
| `icon`    | `string`                                            | -           | 图标名称（mc-xxx），无图片时展示。                                                       |
| `text`    | `string`                                            | -           | 文字内容（如首字母缩写），无图片和图标时展示。                                           |
| `alt`     | `string`                                            | -           | 图片替代文本。                                                                           |

默认插槽可在文字模式下替代 `text` 属性做自定义渲染；`icon` 插槽可完全替换图标区域的渲染内容。
