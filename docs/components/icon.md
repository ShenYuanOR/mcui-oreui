<script setup>
const accountPath = 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z'
</script>

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

## 像素渲染

通过 `pixelSize` 控制像素化光栅分辨率，默认 24×24，越小越有极简像素风。

<div class="mc-demo">
  <mc-icon :path="accountPath" color="#4fc3f7" :size="32" :pixel-size="8" />
  <mc-icon :path="accountPath" color="#ff9800" :size="32" :pixel-size="16" />
  <mc-icon :path="accountPath" color="#66bb6a" :size="32" :pixel-size="24" />
  <mc-icon :path="accountPath" color="#f44336" :size="32" :pixel-size="32" />
</div>

```html
<script setup>
const accountPath = 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z'
</script>

<mc-icon :path="accountPath" color="#4fc3f7" :size="32" :pixel-size="8" />
<mc-icon :path="accountPath" color="#ff9800" :size="32" :pixel-size="16" />
<mc-icon :path="accountPath" color="#66bb6a" :size="32" :pixel-size="24" />
<mc-icon :path="accountPath" color="#f44336" :size="32" :pixel-size="32" />
```

> **注意**：像素渲染通过 `path` prop 传入 SVG 路径 `d` 属性，经 Canvas 光栅化后输出像素 PNG。

## 自定义 SVG 图标

通过 `path` prop 传入任意 SVG 路径 `d` 属性值，配合像素渲染使用，即使第三方图标库（如 Material Design Icons）也能呈现 Minecraft 风格的像素质感。

### 使用 MDI 图标

[Material Design Icons](https://pictogrammers.com/library/mdi/) 拥有 **7000+** 图标，安装 `@mdi/js` 后将路径传给 `McIcon` 即可全部使用：

```bash
npm install @mdi/js
```

```vue
<script setup>
import { mdiHome, mdiCog } from '@mdi/js'
</script>
<template>
  <mc-icon :path="mdiHome" color="#4fc3f7" :size="32" />
  <mc-icon :path="mdiCog" color="#ff5722" :size="32" />
</template>
```

### 自定义路径

```html
<mc-icon :path="'M12 2L2 22h20L12 2z'" color="#ff6b35" :size="32" />
<mc-icon :path="'M4 4h16v16H4z'" :pixel-size="8" :size="32" />
```

> **提示**：如果不传 `color`，图标会使用 CSS `mask` + `currentColor` 着色，可继承文字颜色。

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

### 更多图标按钮

<div class="mc-demo">
  <mc-button icon="mc-add">添加</mc-button>
  <mc-button icon="mc-save" variant="primary">存档</mc-button>
  <mc-button icon="mc-clear">关闭</mc-button>
  <mc-button icon="mc-key-w" variant="primary">前进</mc-button>
</div>

```html
<mc-button icon="mc-add">添加</mc-button>
<mc-button icon="mc-save" variant="primary">存档</mc-button>
<mc-button icon="mc-clear">关闭</mc-button>
<mc-button icon="mc-key-w" variant="primary">前进</mc-button>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `name` | `string` | `''` | 图标名称；不传时读取默认插槽文本 |
| `path` | `string` | `''` | 自定义 SVG 路径 `d` 属性值，传入后忽略 `name` |
| `viewBox` | `string` | `'0 0 24 24'` | 配合 `path` 使用的 SVG viewBox |
| `size` | `number \| string` | `24` | 图标尺寸；数字按 px 处理 |
| `pixelSize` | `number` | `24` | 像素化光栅分辨率；如 8 为极简像素风，24 为清晰像素风 |
| `color` | `string` | `''` | 图标颜色，对普通图标和像素化渲染生效 |
| `label` | `string` | `''` | 可访问性标签；不传则作为装饰图标隐藏给读屏器 |

## 注意事项

- 普通图标可继承文本颜色，也可通过 `color` 指定颜色。
- 按键映射图标和彩色图标保持原色，不支持改色。
- 像素图标通过 Canvas 光栅化渲染（`crispEdges` 无抗锯齿），默认 24×24，可通过 `pixelSize` 调整分辨率；渲染结果会按图标名+颜色+分辨率缓存复用。
- 图标内部已设置 `image-rendering: pixelated` / `crisp-edges`，但浏览器缩放仍可能有差异；像素风图标建议使用整数倍尺寸。
