# Appbar 顶栏

顶部导航栏，分为左、中、右三个区域。使用 [`McAppbarButton`](./appbar-button) 和 [`McAppbarIcon`](./appbar-icon) 作为子组件。

## 基础用法

<div class="mc-demo">
  <mc-appbar>
    <template #left>
      <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
    </template>
    <template #right>
      <mc-appbar-button icon="mc-home">制作</mc-appbar-button>
      <mc-appbar-button icon="mc-world">世界</mc-appbar-button>
      <mc-appbar-button icon="mc-friends">社交</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```html
<mc-appbar>
  <template #left>
    <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
  </template>
  <template #right>
    <mc-appbar-button icon="mc-home">制作</mc-appbar-button>
    <mc-appbar-button icon="mc-world">世界</mc-appbar-button>
    <mc-appbar-button icon="mc-friends">社交</mc-appbar-button>
  </template>
</mc-appbar>
```

## 左中右分区

<div class="mc-demo mc-demo--column">
  <mc-appbar>
    <template #left>
      <mc-appbar-button>返回</mc-appbar-button>
    </template>
    <span style="font-family:'Minecraft Seven'">世界编辑</span>
    <template #right>
      <mc-appbar-button>帮助</mc-appbar-button>
      <mc-appbar-button>完成</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```vue
<template>
  <mc-appbar>
    <template #left>
      <mc-appbar-button>返回</mc-appbar-button>
    </template>
    <span style="font-family:'Minecraft Seven'">世界编辑</span>
    <template #right>
      <mc-appbar-button>帮助</mc-appbar-button>
      <mc-appbar-button>完成</mc-appbar-button>
    </template>
  </mc-appbar>
</template>
```

## 带 Tooltip

为按钮添加提示文本 `tip`。

<div class="mc-demo">
  <mc-appbar>
    <template #right>
      <mc-appbar-button icon="mc-friends" tip="社交">社交</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```html
<mc-appbar>
  <template #right>
    <mc-appbar-button icon="mc-friends" tip="社交">社交</mc-appbar-button>
  </template>
</mc-appbar>
```

## AppbarIcon 图标按钮

[`McAppbarIcon`](./appbar-icon) 是纯图标按钮，适合作为工具栏操作图标放置在左侧。

<div class="mc-demo">
  <mc-appbar title="编辑器">
    <template #left>
      <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
      <mc-appbar-icon icon="mc-undo" tip="撤销" />
      <mc-appbar-icon icon="mc-redo" tip="重做" />
    </template>
  </mc-appbar>
</div>

```html
<mc-appbar title="编辑器">
  <template #left>
    <mc-appbar-icon icon="mc-chevron-left" tip="返回" />
    <mc-appbar-icon icon="mc-undo" tip="撤销" />
    <mc-appbar-icon icon="mc-redo" tip="重做" />
  </template>
</mc-appbar>
```

详细用法见 [AppbarIcon](./appbar-icon)。

## AppbarButton 文字按钮

[`McAppbarButton`](./appbar-button) 是带文字和可选图标的按钮，适合放在左右区域。

<div class="mc-demo">
  <mc-appbar>
    <template #right>
      <mc-appbar-button icon="mc-home">制作</mc-appbar-button>
      <mc-appbar-button icon="mc-world">世界</mc-appbar-button>
      <mc-appbar-button icon="mc-settings" bg-color="#4a90d9">自定义</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```html
<mc-appbar>
  <template #right>
    <mc-appbar-button icon="mc-home">制作</mc-appbar-button>
    <mc-appbar-button icon="mc-world">世界</mc-appbar-button>
    <mc-appbar-button icon="mc-settings" bg-color="#4a90d9">自定义</mc-appbar-button>
  </template>
</mc-appbar>
```

详细用法见 [AppbarButton](./appbar-button)。



## 外观说明

- 默认高度 `100px`
- 背景色 `#E6E8EB`，Minecraft 浅色顶栏风格
- 底部 3px `#B1B2B5` 实线 + 1px 黑色半透明内阴影，形成双层斜面底边
- 左、右区域靠边对齐，中间区域占满剩余宽度、居中显示

### 按钮外观

按钮使用 `box-shadow` 内阴影实现立体边框效果，避免边框遮挡顶栏底部。

| 状态 | 左边 | 右边 | 上边 | 下边 | 背景 |
|---|---|---|---|---|---|
| 正常 | `#FFFFFF` | `#A1A3A5` | 无 | 无 | 跟随顶栏 |
| 按下 | `#FFFFFF` | `#E6E8EB` | `#E6E8EB` | `#EBEDEF` | `#D0D1D4` |

- 按钮高度自动占满顶栏内容区
- 禁用时半透明显示，不可点击
- 点击时播放 `click` 音效

## 自定义高度

<div class="mc-demo mc-demo--column">
  <mc-appbar title="高度 60px" :height="60">
    <mc-appbar-button>保存</mc-appbar-button>
  </mc-appbar>
</div>

```html
<mc-appbar title="高度 60px" :height="60">
  <mc-appbar-button>保存</mc-appbar-button>
</mc-appbar>
```

## Appbar Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `title` | `string` | `''` | 左侧标题文本，不传则隐藏 |
| `height` | `number \| string` | `100` | 顶栏高度；数字为 px，字符串原样使用 |

子组件 Props 详见 [AppbarButton](./appbar-button) 和 [AppbarIcon](./appbar-icon)。

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `click` | `MouseEvent` | 点击按钮（禁用时不触发） |

## Slots

| 名称 | 说明 |
|---|---|
| `left` | 左侧区域，与 `title` 同行；可放置按钮、图标等 |
| `default` | 中间区域，默认插槽，内容居中显示 |
| `right` | 右侧区域，可放置操作按钮 |
| `default`（按钮插槽） | 按钮文字 |
