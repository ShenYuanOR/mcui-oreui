# 辅助工具 / Helpers

Helpers 提供无障碍隐藏、pointer events 和断点范围隐藏，不承担组件 Props 或图片布局能力。断点范围与汇总写法统一见[分辨率](./breakpoints)。

## Screen reader only

下面的链接通过 `d-sr-only-focusable` 在普通状态下视觉隐藏；使用 Tab 键聚焦后会显示。

<div class="mc-demo mc-demo--column">
  <a class="d-sr-only-focusable bg-primary pa-2" href="#helper-target">聚焦后显示的跳转链接</a>
  <div id="helper-target">键盘焦点目标</div>
</div>

## Pointer events

父容器使用 `pointer-pass-through`，自身不接收 pointer event，直接子元素仍然可以点击。

<div class="mc-demo">
  <div class="pointer-pass-through bg-surface pa-4"><button class="mc-button" type="button"><span class="mc-button__content">子按钮仍可点击</span></button></div>
  <button class="mc-button pointer-events-none" type="button"><span class="mc-button__content">pointer-events-none</span></button>
</div>

## 响应式隐藏

调整窗口宽度查看 `hidden-sm` 和 `hidden-md-and-up`：

<div class="mc-demo">
  <div class="mc-utility-demo__box hidden-sm">sm 区间隐藏</div>
  <div class="mc-utility-demo__box hidden-md-and-up">md 以上隐藏</div>
  <div class="mc-utility-demo__box hidden-print-only">Ctrl+P / 导出 PDF 时隐藏</div>
</div>

## 本章类名

<mc-utility-catalog section="helpers" />
