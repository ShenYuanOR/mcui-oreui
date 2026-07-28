# AppbarButton 顶栏按钮

`McAppbarButton` 是 Appbar 顶栏中的文字按钮，支持图标、Tooltip 提示和自定义背景色。

## 基础用法

带图标的文字按钮，使用默认插槽传入按钮文本。

<div class="mc-demo">
  <mc-appbar>
    <template #right>
      <mc-appbar-button icon="mc-home">制作</mc-appbar-button>
      <mc-appbar-button icon="mc-world">世界</mc-appbar-button>
      <mc-appbar-button icon="mc-friends">社交</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```html
<mc-appbar>
  <template #right>
    <mc-appbar-button icon="mc-home">制作</mc-appbar-button>
    <mc-appbar-button icon="mc-world">世界</mc-appbar-button>
    <mc-appbar-button icon="mc-friends">社交</mc-appbar-button>
  </template>
</mc-appbar>
```

## 纯文字按钮

不传 `icon` 时为纯文字按钮。

<div class="mc-demo">
  <mc-appbar>
    <template #right>
      <mc-appbar-button>保存</mc-appbar-button>
      <mc-appbar-button>取消</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```html
<mc-appbar>
  <template #right>
    <mc-appbar-button>保存</mc-appbar-button>
    <mc-appbar-button>取消</mc-appbar-button>
  </template>
</mc-appbar>
```

## 带 Tooltip

设置 `tip` 属性可在悬停时显示提示文本。

<div class="mc-demo">
  <mc-appbar>
    <template #right>
      <mc-appbar-button icon="mc-friends" tip="社交">社交</mc-appbar-button>
      <mc-appbar-button icon="mc-settings" tip="设置">设置</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```html
<mc-appbar>
  <template #right>
    <mc-appbar-button icon="mc-friends" tip="社交">社交</mc-appbar-button>
    <mc-appbar-button icon="mc-settings" tip="设置">设置</mc-appbar-button>
  </template>
</mc-appbar>
```

## 自定义背景色

通过 `bg-color` 设置自定义背景颜色，不传则使用默认透明背景。

<div class="mc-demo">
  <mc-appbar>
    <template #right>
      <mc-appbar-button icon="mc-home" bg-color="#4a90d9">蓝色</mc-appbar-button>
      <mc-appbar-button icon="mc-world" bg-color="#52c41a">绿色</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```html
<mc-appbar>
  <template #right>
    <mc-appbar-button icon="mc-home" bg-color="#4a90d9">蓝色</mc-appbar-button>
    <mc-appbar-button icon="mc-world" bg-color="#52c41a">绿色</mc-appbar-button>
  </template>
</mc-appbar>
```

## 禁用状态

设置 `disabled` 属性后按钮不可点击，呈半透明显示。

<div class="mc-demo">
  <mc-appbar>
    <template #right>
      <mc-appbar-button icon="mc-home">可用</mc-appbar-button>
      <mc-appbar-button icon="mc-world" disabled>禁用</mc-appbar-button>
    </template>
  </mc-appbar>
</div>

```html
<mc-appbar>
  <template #right>
    <mc-appbar-button icon="mc-home">可用</mc-appbar-button>
    <mc-appbar-button icon="mc-world" disabled>禁用</mc-appbar-button>
  </template>
</mc-appbar>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `icon` | `string` | `''` | 左侧图标名称 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `tip` | `string` | `''` | Tooltip 文本，非空则显示 |
| `bgColor` | `string` | `''` | 自定义背景颜色，不传则使用默认透明背景 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `click` | `MouseEvent` | 点击按钮（禁用时不触发） |

## Slots

| 名称 | 说明 |
|---|---|
| `default` | 按钮文字内容 |
