# Icon 图标

统一图标组件，所有内置图标都需要通过 `<mc-icon>` 或组件的 `icon` 属性生效。

## 命名规则

| 类型 | 命名 | 是否可改色 | 说明 |
|---|---|---:|---|
| 普通图标 | `mc-xxx` | 是 | 编辑器/工具类白色图标，会继承 `currentColor` |
| 按键映射图标 | `mc-key-xxx` | 否 | 键盘、鼠标、手柄等输入映射图标，保持原色 |
| 彩色图标 | `mc-x-xxx` | 否 | 游戏内容类彩色图标，保持原色 |

## 基础用法

<div class="mc-demo">
  <mc-icon>mc-add</mc-icon>
  <mc-icon name="mc-save" color="#6fb23f" />
  <mc-icon name="mc-delete" color="#ff5555" />
  <mc-icon name="mc-key-a" />
  <mc-icon name="mc-x-creative" />
</div>

```vue
<mc-icon>mc-add</mc-icon>
<mc-icon name="mc-save" color="#6fb23f" />
<mc-icon name="mc-delete" color="#ff5555" />
<mc-icon name="mc-key-a" />
<mc-icon name="mc-x-creative" />
```

## 尺寸

像素图标放大时建议使用整数倍尺寸，例如 `24`、`36`、`48`，可减少边缘发糊。

<div class="mc-demo">
  <mc-icon name="mc-add" :size="24" />
  <mc-icon name="mc-add" :size="36" />
  <mc-icon name="mc-add" :size="48" />
  <mc-icon name="mc-key-space" :size="72" />
</div>

```vue
<mc-icon name="mc-add" :size="24" />
<mc-icon name="mc-add" :size="36" />
<mc-icon name="mc-add" :size="48" />
<mc-icon name="mc-key-space" :size="72" />
```

## 按钮图标

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

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `name` | `string` | `''` | 图标名称；不传时读取默认插槽文本 |
| `size` | `number \| string` | `24` | 图标尺寸；数字按 px 处理 |
| `color` | `string` | `''` | 普通图标颜色；按键和彩色图标不受影响 |
| `label` | `string` | `''` | 可访问性标签；不传则作为装饰图标隐藏给读屏器 |

## 注意事项

- 普通图标可继承文本颜色，也可通过 `color` 指定颜色。
- 按键映射图标和彩色图标保持原色，不支持改色。
- 图标内部已设置 `image-rendering: pixelated` / `crisp-edges`，但浏览器缩放仍可能有差异；像素风图标建议使用整数倍尺寸。
