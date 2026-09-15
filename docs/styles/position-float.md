# 定位与浮动 / Position & Float

定位工具控制元素采用 static、relative、fixed、absolute 或 sticky 布局，并可将定位元素贴到四个物理边缘。浮动工具提供 left/right 以及随 `dir` 自动映射的 start/end，并支持响应式和打印媒体变体。

## 基础用法

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-demo__position position-relative">
    <div class="mc-utility-demo__box position-absolute top-0 right-0" style="width:50%">absolute · top-0 · right-0</div>
    <div class="mc-utility-demo__box position-absolute bottom-0 left-0" style="width:25%">bottom-0 · left-0</div>
  </div>
</div>

```html
<section class="position-relative">
  <aside class="position-absolute top-0 right-0">右上角</aside>
</section>
```

`top-0/right-0/bottom-0/left-0` 只设置对应边缘为 0，需要配合非 static 定位使用。

## 浮动与 RTL

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-demo__grid">
    <div class="mc-utility-demo__surface" style="display:flow-root" dir="ltr">
      <span class="mc-utility-demo__label">LTR · float-start</span>
      <div class="mc-utility-demo__box float-start" data-position-float="ltr">Start</div>
    </div>
    <div class="mc-utility-demo__surface" style="display:flow-root" dir="rtl">
      <span class="mc-utility-demo__label">RTL · float-start</span>
      <div class="mc-utility-demo__box float-start" data-position-float="rtl">Start</div>
    </div>
    <div class="mc-utility-demo__surface" style="display:flow-root">
      <span class="mc-utility-demo__label">float-right</span>
      <div class="mc-utility-demo__box float-right">Right</div>
    </div>
  </div>
</div>

```html
<section dir="rtl">
  <div class="float-start">RTL 中浮向右侧</div>
</section>
```

响应式中缀统一见[分辨率](./breakpoints)。例如 `float-left float-md-right` 会在小屏向左浮动，从 md 开始改为向右。

## 打印媒体中的浮动

`float-print-start/end/left/right/none` 只在浏览器打印媒体中覆盖当前浮动，即按 `Ctrl + P`、进入打印预览或导出 PDF 时生效。“打印媒体”的完整说明见[显示与打印](./display#打印)。

## 本章类名

<mc-utility-catalog section="position-float" />
