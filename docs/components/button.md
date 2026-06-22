# Button 按钮

Minecraft 风格立体按钮：深色描边 + inset 高光厚度，按下整体下沉。

## 三种语义

<div class="mc-demo">
  <mc-button variant="primary">主操作</mc-button>
  <mc-button variant="normal">次要</mc-button>
  <mc-button variant="error">危险</mc-button>
  <mc-button variant="normal" disabled>禁用</mc-button>
</div>

```vue
<mc-button variant="primary" @click="onStart">主操作</mc-button>
<mc-button variant="normal">次要</mc-button>
<mc-button variant="error">危险</mc-button>
<mc-button variant="normal" disabled>禁用</mc-button>
```

## 尺寸

<div class="mc-demo">
  <mc-button size="extra_small">特小</mc-button>
  <mc-button size="small">小</mc-button>
  <mc-button size="middle">中</mc-button>
  <mc-button size="large">大</mc-button>
</div>

```vue
<mc-button size="extra_small">特小</mc-button>
<mc-button size="small">小</mc-button>
<mc-button size="middle">中</mc-button>
<mc-button size="large">大</mc-button>
```

## 图标

`icon` 属性接收内置图标名称，按钮会在文字左侧显示图标。

<div class="mc-demo">
  <mc-button icon="mc-save" variant="primary">保存</mc-button>
  <mc-button icon="mc-delete" variant="error">删除</mc-button>
  <mc-button icon="mc-key-enter">确认</mc-button>
</div>

```vue
<mc-button icon="mc-save" variant="primary">保存</mc-button>
<mc-button icon="mc-delete" variant="error">删除</mc-button>
<mc-button icon="mc-key-enter">确认</mc-button>
```

## 带 Tooltip

<div class="mc-demo">
  <mc-button variant="primary" tip="这是提示文本">悬停查看</mc-button>
</div>

```vue
<mc-button variant="primary" tip="这是提示文本">悬停查看</mc-button>
```

## 自定义颜色

`bgcolor` prop 可以覆盖按钮背景色，同时保留 Minecraft 风格的立体阴影效果。

<div class="mc-demo">
<mc-button bgcolor="#ff6b35">橙色</mc-button>
<mc-button bgcolor="#8e44ad" icon="mdi-star">紫色 + 图标</mc-button>
<mc-button bgcolor="#2ecc71">绿色</mc-button>
<mc-button bgcolor="#e84393">粉色</mc-button>
</div>

```vue
<mc-button bgcolor="#ff6b35">橙色</mc-button>
<mc-button bgcolor="#8e44ad" icon="mdi-star">紫色 + 图标</mc-button>
<mc-button bgcolor="#2ecc71">绿色</mc-button>
<mc-button bgcolor="#e84393">粉色</mc-button>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `variant` | `'normal' \| 'primary' \| 'error'` | `normal` | 颜色/语义 |
| `size` | `'extra_small' \| 'small' \| 'middle' \| 'large'` | `middle` | 尺寸 |
| `disabled` | `boolean` | `false` | 是否禁用（禁用时不触发 click、不播音效） |
| `icon` | `string` | `''` | 左侧图标名称，如 `mc-save`、`mc-key-enter`、`mc-x-creative` |
| `tip` | `string` | `''` | 非空则显示 Tooltip |
| `bgcolor` | `string` | `''` | 自定义背景色（如 `#ff6b35`），覆盖 `variant` 预设 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `click` | `MouseEvent` | 点击（禁用时不触发）；主操作按钮播 `button` 音，其余播 `click` 音 |

按钮文字通过默认插槽传入。
