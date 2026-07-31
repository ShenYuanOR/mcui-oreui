# 显示与打印 / Display & Print

使用 `d-*` 控制元素的显示模式。响应式变体在值前加入断点，打印变体使用 `d-print-*`。

## 实际效果

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-demo__stack">
    <div><span class="mc-utility-demo__label">d-inline / d-inline-block</span><span class="d-inline bg-primary pa-2">inline</span> <span class="d-inline-block bg-surface-light pa-2">inline-block</span></div>
    <div><span class="mc-utility-demo__label">d-block</span><span class="d-block bg-primary pa-2">占据一整行</span></div>
    <div><span class="mc-utility-demo__label">d-flex</span><span class="d-flex ga-2"><span class="mc-utility-demo__box">A</span><span class="mc-utility-demo__box">B</span></span></div>
    <div class="d-table w-100 border"><div class="d-table-row"><span class="d-table-cell pa-2 border-e">table cell A</span><span class="d-table-cell pa-2">table cell B</span></div></div>
  </div>
</div>

## 响应式显示

调整浏览器宽度，下面两条提示会在 `md`（960px）处切换：

<div class="mc-demo">
  <div class="d-block d-md-none bg-warning text-inverse pa-3">当前小于 md</div>
  <div class="d-none d-md-block bg-primary pa-3">当前达到 md 或更大</div>
</div>

```html
<div class="d-block d-md-none">小屏显示</div>
<div class="d-none d-md-block">md 以上显示</div>
```

## 打印

这里的“打印”特指浏览器进入打印媒体：按 `Ctrl + P`、打开打印预览，或将网页导出为 PDF。它不会调用打印机，也不是页面中的打印按钮。

`d-print-*` 只负责元素在打印媒体中的 `display`，不会自动决定它在普通屏幕上是否可见。特别要注意：单独使用 `d-print-block` 只是“打印时改成 block”，并不等于“只在打印时显示”。

| 写法                   | 普通网页             | Ctrl+P / 打印预览 | 常见用途               |
| ---------------------- | -------------------- | ----------------- | ---------------------- |
| `d-print-none`         | 保持元素原有显示方式 | 隐藏              | 导航栏、按钮、筛选控件 |
| `d-print-block`        | 保持元素原有显示方式 | 以 block 显示     | 调整打印布局           |
| `d-block d-print-none` | 以 block 显示        | 隐藏              | 仅屏幕显示的内容       |
| `d-none d-print-block` | 隐藏                 | 以 block 显示     | 打印标题、日期、签字区 |

下面灰色区域当前显示的是屏幕内容。按 `Ctrl + P` 进入打印预览后，它会消失，并由“打印专用内容”替代：

<div class="mc-demo">
  <span class="d-block d-print-none" data-print-visibility="screen">屏幕内容（打印时隐藏）</span>
  <span class="d-none d-print-block" data-print-visibility="print">打印专用内容（普通网页中隐藏）</span>
</div>

```html
<!-- 网页中显示，打印时隐藏 -->
<nav class="d-print-none">页面导航</nav>

<!-- 网页中隐藏，只在打印预览或 PDF 中显示 -->
<header class="d-none d-print-block">打印专用标题</header>
```

## 本章类名

<mc-utility-catalog section="display" />
