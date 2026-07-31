# 分辨率 / Breakpoints

响应式工具类采用移动优先规则。基础类在所有宽度生效，加入 `sm/md/lg/xl/xxl` 中缀后，从对应最小宽度开始覆盖基础值。各工具族的类名表会把这些尺寸变体汇总为 `{breakpoint}`，不再逐条重复展示。

## 当前分辨率

调整浏览器宽度，下面只会显示当前所在的一个区间：

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-resolution-status">
    <strong class="d-block d-sm-none" data-breakpoint="xs">xs · 0–599.98px</strong>
    <strong class="d-none d-sm-block d-md-none" data-breakpoint="sm">sm · 600–959.98px</strong>
    <strong class="d-none d-md-block d-lg-none" data-breakpoint="md">md · 960–1279.98px</strong>
    <strong class="d-none d-lg-block d-xl-none" data-breakpoint="lg">lg · 1280–1919.98px</strong>
    <strong class="d-none d-xl-block d-xxl-none" data-breakpoint="xl">xl · 1920–2559.98px</strong>
    <strong class="d-none d-xxl-block" data-breakpoint="xxl">xxl · ≥2560px</strong>
  </div>
</div>

## 断点范围

| 层级        |       当前区间 | 响应式中缀的生效范围 |
| ----------- | -------------: | -------------------: |
| 基础 / `xs` |     0–599.98px |     无中缀，所有宽度 |
| `sm`        |   600–959.98px |             `≥600px` |
| `md`        |  960–1279.98px |             `≥960px` |
| `lg`        | 1280–1919.98px |            `≥1280px` |
| `xl`        | 1920–2559.98px |            `≥1920px` |
| `xxl`       |        ≥2560px |            `≥2560px` |

例如 `float-md-right` 的声明虽然仍是 `float: right`，但只从 960px 开始生效；这就是它与 `float-right` 的区别。

## 汇总写法

`{breakpoint}` 可以替换为 `sm`、`md`、`lg`、`xl` 或 `xxl`。目录只展示下列模式，实际 CSS 仍完整提供每个具体类。

| 工具族            | 基础写法      | 响应式模式                 | 示例             |
| ----------------- | ------------- | -------------------------- | ---------------- |
| Display           | `d-flex`      | `d-{breakpoint}-flex`      | `d-md-flex`      |
| Float             | `float-start` | `float-{breakpoint}-start` | `float-lg-start` |
| Flex              | `flex-row`    | `flex-{breakpoint}-row`    | `flex-md-row`    |
| Spacing / Gap     | `pa-4`        | `pa-{breakpoint}-4`        | `pa-lg-4`        |
| Text / Typography | `text-center` | `text-{breakpoint}-center` | `text-sm-center` |
| Width / Height    | `w-50`        | `w-{breakpoint}-50`        | `w-xl-50`        |

## 组合后的实际效果

下方容器在小于 `md` 时纵向排列，从 `md` 开始横向排列；内边距也会从 8px 切换为 24px。

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-demo__surface d-flex flex-column flex-md-row ga-2 pa-2 pa-md-6" data-testid="resolution-layout">
    <div class="mc-utility-demo__box flex-grow-1">内容 A</div>
    <div class="mc-utility-demo__box flex-grow-1">内容 B</div>
  </div>
</div>

```html
<div class="d-flex flex-column flex-md-row pa-2 pa-md-6">
  <!-- < 960px：纵向、8px 内边距 -->
  <!-- ≥ 960px：横向、24px 内边距 -->
</div>
```

组合基础类与响应式类即可在不同尺寸切换，而不需要额外媒体查询：

```html
<div class="float-left float-md-right">小屏向左，md 以上向右</div>
<div class="d-block d-lg-none">仅在 lg 以下显示</div>
<div class="w-100 w-xl-50">默认全宽，xl 以上半宽</div>
```

## 范围隐藏

隐藏 Helpers 也按模式汇总：

| 写法                           | 生效范围                                      |
| ------------------------------ | --------------------------------------------- |
| `hidden-{breakpoint}`          | 只在指定区间隐藏，例如 `hidden-md`            |
| `hidden-{breakpoint}-and-up`   | 从指定断点开始隐藏                            |
| `hidden-{breakpoint}-and-down` | 到指定断点区间结束前隐藏                      |
| `hidden-print-only`            | 只在浏览器打印媒体（Ctrl+P / 导出 PDF）中隐藏 |
| `hidden-screen-only`           | 只在屏幕媒体中隐藏                            |

## 固定的 CSS 断点

Utilities 使用项目标准断点生成静态媒体查询。运行时 `display.thresholds` 只影响 `useMcDisplay()` 返回的状态，不会改写已经编译的 CSS；如需两者一致，应保留默认阈值。
