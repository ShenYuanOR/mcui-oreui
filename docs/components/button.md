# Button 按钮

Minecraft 风格立体按钮：深色描边 + inset 高光厚度，按下整体下沉。

## 三种语义

<div class="mc-demo">
  <mc-button variant="green">主操作</mc-button>
  <mc-button variant="normal">次要</mc-button>
  <mc-button variant="red">危险</mc-button>
  <mc-button variant="normal" disabled>禁用</mc-button>
</div>

```vue
<mc-button variant="green" @click="onStart">主操作</mc-button>
<mc-button variant="normal">次要</mc-button>
<mc-button variant="red">危险</mc-button>
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

## 带 Tooltip

<div class="mc-demo">
  <mc-button variant="green" tip="这是提示文本">悬停查看</mc-button>
</div>

```vue
<mc-button variant="green" tip="这是提示文本">悬停查看</mc-button>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `variant` | `'normal' \| 'green' \| 'red'` | `normal` | 颜色/语义 |
| `size` | `'extra_small' \| 'small' \| 'middle' \| 'large'` | `middle` | 尺寸 |
| `disabled` | `boolean` | `false` | 是否禁用（禁用时不触发 click、不播音效） |
| `tip` | `string` | `''` | 非空则显示 Tooltip |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `click` | `MouseEvent` | 点击（禁用时不触发）；绿色按钮播 `button` 音，其余播 `click` 音 |

按钮文字通过默认插槽传入。
