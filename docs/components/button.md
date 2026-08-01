# Button 按钮

Minecraft 风格立体按钮：深色描边 + inset 高光厚度。按住时按钮面向下压入 4px、高度同步收缩 4px并移除底部厚度阴影，文字与图标随按钮面一起下沉；外层占位高度保持不变，因此相邻组件不会随点击抖动。

`loading` 状态会在按钮文字前显示圆形旋转加载图标，并同步禁用按钮交互。

## 三种语义

<div class="mc-demo">
  <mc-button variant="primary">主操作</mc-button>
  <mc-button variant="normal">次要</mc-button>
  <mc-button variant="error">危险</mc-button>
  <mc-button variant="plain">朴素</mc-button>
  <mc-button loading>加载中</mc-button>
  <mc-button variant="normal" disabled>禁用</mc-button>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-button variant="primary">主操作</mc-button>
    <mc-button variant="normal">次要</mc-button>
    <mc-button variant="error">危险</mc-button>
    <mc-button variant="plain">朴素</mc-button>
    <mc-button loading>加载中</mc-button>
    <mc-button variant="normal" disabled>禁用</mc-button>
  </div>
</template>
```

## 尺寸

<div class="mc-demo">
  <mc-button size="extra_small">特小</mc-button>
  <mc-button size="small">小</mc-button>
  <mc-button size="middle">中</mc-button>
  <mc-button size="large">大</mc-button>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-button size="extra_small">特小</mc-button>
    <mc-button size="small">小</mc-button>
    <mc-button size="middle">中</mc-button>
    <mc-button size="large">大</mc-button>
  </div>
</template>
```

## 图标

`icon` 属性接收内置图标名称，按钮会在文字左侧显示图标。

<div class="mc-demo">
  <mc-button icon="mc-save" variant="primary">保存</mc-button>
  <mc-button icon="mc-delete" variant="error">删除</mc-button>
  <mc-button icon="mc-key-enter">确认</mc-button>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-button icon="mc-save" variant="primary">保存</mc-button>
    <mc-button icon="mc-delete" variant="error">删除</mc-button>
    <mc-button icon="mc-key-enter">确认</mc-button>
  </div>
</template>
```

## 带 Tooltip

`tip` 属性非空时按钮下方会显示 Tooltip，样式与 [`McTooltip`](./tooltip) 一致，均为 Minecraft 像素风格（白边框 + 黑色阴影 + Mojang 字体）。

<div class="mc-demo">
  <mc-button variant="primary" tip="这是提示文本">悬停查看</mc-button>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-button variant="primary" tip="这是提示文本">悬停查看</mc-button>
  </div>
</template>
```

## 自定义颜色

`color` prop 可以覆盖按钮背景色，同时保留 Minecraft 风格的立体阴影效果。

<div class="mc-demo">
<mc-button color="#ff6b35">橙色</mc-button>
<mc-button color="#8e44ad" icon="mc-star">紫色 + 图标</mc-button>
<mc-button color="#2ecc71">绿色</mc-button>
<mc-button color="#e84393">粉色</mc-button>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <mc-button color="#ff6b35">橙色</mc-button>
    <mc-button color="#8e44ad" icon="mc-star">紫色 + 图标</mc-button>
    <mc-button color="#2ecc71">绿色</mc-button>
    <mc-button color="#e84393">粉色</mc-button>
  </div>
</template>
```

## Props

| 名称         | 类型                                              | 默认     | 说明                                                        |
| ------------ | ------------------------------------------------- | -------- | ----------------------------------------------------------- |
| `variant`    | `'normal' \| 'primary' \| 'error' \| 'plain'`     | `normal` | 颜色/语义                                                   |
| `size`       | `'extra_small' \| 'small' \| 'middle' \| 'large'` | `middle` | 尺寸                                                        |
| `disabled`   | `boolean`                                         | `false`  | 是否禁用（禁用时不触发 click、不播音效）                    |
| `loading`    | `boolean`                                         | `false`  | 加载态，显示圆形旋转图标并同步禁用按钮                      |
| `icon`       | `string`                                          | `''`     | 左侧图标名称，如 `mc-save`、`mc-key-enter`、`mc-x-creative` |
| `tip`        | `string`                                          | `''`     | 非空则显示 Tooltip，样式与 McTooltip 一致                   |
| `color`      | `string`                                          | -        | 自定义背景色（如 `#ff6b35`），覆盖 `variant` 预设           |
| `type`       | `'button' \| 'submit' \| 'reset'`                 | `button` | 原生按钮类型                                                |
| `aria-label` | 标准 Attr                                         | -        | 无可见文字时写在组件上，并转发到内部原生按钮                |

## Events

| 事件    | 参数         | 说明                                                              |
| ------- | ------------ | ----------------------------------------------------------------- |
| `click` | `MouseEvent` | 点击（禁用时不触发）；主操作按钮播 `button` 音，其余播 `click` 音 |

按钮文字通过默认插槽传入。
