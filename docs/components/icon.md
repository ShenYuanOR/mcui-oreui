# Icon 图标

统一图标组件，所有内置图标都需要通过 `<mc-icon>` 或组件的 `icon` 属性生效。

## 命名规则

| 类型 | 命名 | 是否可改色 | 说明 |
|---|---|---:|---|
| 普通图标 | `mc-xxx` | 是 | 编辑器/工具类白色图标，会继承 `currentColor` |
| 按键映射图标 | `mc-key-xxx` | 否 | 键盘、鼠标、手柄等输入映射图标，保持原色 |
| 彩色图标 | `mc-x-xxx` | 否 | 游戏内容类彩色图标，保持原色 |
| MDI 像素图标 | `mdi-xxx` | 是 | [Material Design Icons](https://pictogrammers.com/library/mdi/)，24×24 像素化渲染（可通过 `pixelSize` 调整） |

## 基础用法

<div class="mc-demo">
  <mc-icon>mc-add</mc-icon>
  <mc-icon name="mc-save" color="#6fb23f" />
  <mc-icon name="mc-delete" color="#ff5555" />
  <mc-icon name="mc-key-a" />
  <mc-icon name="mc-x-creative" />
</div>

```html
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

```html
<mc-icon name="mc-add" :size="24" />
<mc-icon name="mc-add" :size="36" />
<mc-icon name="mc-add" :size="48" />
<mc-icon name="mc-key-space" :size="72" />
```

## MDI 像素图标

通过 `mdi-` 前缀引用 [Material Design Icons](https://pictogrammers.com/library/mdi/) 中的图标，图标默认 24×24 像素化光栅渲染（可通过 `pixelSize` 调整），配合像素风格完美呈现。

<div class="mc-demo">
  <mc-icon name="mdi-home" color="#4fc3f7" :size="32" />
  <mc-icon name="mdi-cog" color="#ff5722" :size="32" />
  <mc-icon name="mdi-heart" color="#f44336" :size="32" />
  <mc-icon name="mdi-account-circle" color="#66bb6a" :size="32" />
</div>

```html
<mc-icon name="mdi-home" color="#4fc3f7" :size="32" />
<mc-icon name="mdi-cog" color="#ff5722" :size="32" />
<mc-icon name="mdi-heart" color="#f44336" :size="32" />
<mc-icon name="mdi-account-circle" color="#66bb6a" :size="32" />
```

> **提示**：MDI 图标名称请参考 [MDI 图标库](https://pictogrammers.com/library/mdi/)，使用时将图标名转为 kebab-case，如 `account-circle` → `mdi-account-circle`。

## 按钮图标

<div class="mc-demo">
  <mc-button icon="mc-save" variant="primary">保存</mc-button>
  <mc-button icon="mc-delete" variant="error">删除</mc-button>
  <mc-button icon="mc-key-enter">确认</mc-button>
</div>

```html
<mc-button icon="mc-save" variant="primary">保存</mc-button>
<mc-button icon="mc-delete" variant="error">删除</mc-button>
<mc-button icon="mc-key-enter">确认</mc-button>
```

### MDI 图标按钮

<div class="mc-demo">
  <mc-button icon="mdi-home">主页</mc-button>
  <mc-button icon="mdi-cog">设置</mc-button>
  <mc-button icon="mdi-plus-circle" variant="primary">新建</mc-button>
  <mc-button icon="mdi-delete" variant="error">删除</mc-button>
</div>

```html
<mc-button icon="mdi-home">主页</mc-button>
<mc-button icon="mdi-cog">设置</mc-button>
<mc-button icon="mdi-plus-circle" variant="primary">新建</mc-button>
<mc-button icon="mdi-delete" variant="error">删除</mc-button>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `name` | `string` | `''` | 图标名称；不传时读取默认插槽文本 |
| `size` | `number \| string` | `24` | 图标尺寸；数字按 px 处理 |
| `pixelSize` | `number` | `24` | MDI 像素图标光栅化分辨率；如 8 为极简像素风，24 为清晰像素风 |
| `color` | `string` | `''` | 图标颜色，对普通图标和 MDI 像素图标生效 |
| `label` | `string` | `''` | 可访问性标签；不传则作为装饰图标隐藏给读屏器 |

## 注意事项

- 普通图标可继承文本颜色，也可通过 `color` 指定颜色。
- 按键映射图标和彩色图标保持原色，不支持改色。
- MDI 像素图标通过 Canvas 光栅化渲染（`crispEdges` 无抗锯齿），默认 24×24，可通过 `pixelSize` 调整分辨率；渲染结果会按图标名+颜色+分辨率缓存复用。
- 图标内部已设置 `image-rendering: pixelated` / `crisp-edges`，但浏览器缩放仍可能有差异；像素风图标建议使用整数倍尺寸。
